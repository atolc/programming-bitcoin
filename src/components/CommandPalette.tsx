import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  ListTree,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  buildSearchIndex,
  type SearchResult,
  type SearchResultType,
} from "../lib/search-index";
import { useLocale } from "../context/LocaleContext";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";
import { DialogTitle } from "./ui/dialog";
import { Kbd } from "./ui/kbd";

const RESULT_GROUPS: SearchResultType[] = ["chapter", "section", "exercise"];

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function findMatchRange(text: string, query: string) {
  const normalizedText = normalizeSearchText(text);
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return undefined;

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const exactIndex = normalizedText.indexOf(normalizedQuery);
  const matchIndex =
    exactIndex >= 0
      ? exactIndex
      : terms
          .map((term) => normalizedText.indexOf(term))
          .filter((index) => index >= 0)
          .sort((a, b) => a - b)[0];

  if (matchIndex === undefined) return undefined;
  const matchedTerm =
    exactIndex >= 0
      ? normalizedQuery
      : terms.find((term) => normalizedText.indexOf(term) === matchIndex) ??
        normalizedQuery;
  const sourceIndexByNormalizedIndex: number[] = [];
  let normalizedIndex = 0;

  for (let sourceIndex = 0; sourceIndex < text.length;) {
    const character = String.fromCodePoint(text.codePointAt(sourceIndex) ?? 0);
    const normalizedCharacter = normalizeSearchText(character);
    for (let offset = 0; offset < normalizedCharacter.length; offset += 1) {
      sourceIndexByNormalizedIndex[normalizedIndex] = sourceIndex;
      normalizedIndex += 1;
    }
    sourceIndex += character.length;
  }

  const start = sourceIndexByNormalizedIndex[matchIndex];
  const lastNormalizedIndex = matchIndex + matchedTerm.length - 1;
  const end = sourceIndexByNormalizedIndex[lastNormalizedIndex];
  if (start === undefined || end === undefined) return undefined;

  const lastCharacter = String.fromCodePoint(text.codePointAt(end) ?? 0);
  return { start, end: end + lastCharacter.length };
}

function highlightMatch(text: string, query: string) {
  const range = findMatchRange(text, query);
  if (!range) return text;

  return (
    <>
      {text.slice(0, range.start)}
      <mark className="rounded bg-primary/20 px-0.5 text-primary">
        {text.slice(range.start, range.end)}
      </mark>
      {text.slice(range.end)}
    </>
  );
}

function getExcerpt(result: SearchResult, query: string) {
  const range = findMatchRange(result.searchText, query);
  if (!range) return undefined;

  const start = Math.max(0, range.start - 44);
  const end = Math.min(result.searchText.length, range.end + 72);
  const excerpt = result.searchText.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${excerpt}${end < result.searchText.length ? "…" : ""}`;
}

function resultIcon(type: SearchResultType) {
  if (type === "chapter") return <BookOpen aria-hidden="true" />;
  if (type === "section") return <ListTree aria-hidden="true" />;
  return <Code2 aria-hidden="true" />;
}

export function CommandPalette() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchIndex = useMemo(() => buildSearchIndex(locale), [locale]);
  const shortcut =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform)
      ? "⌘ K"
      : "Ctrl K";

  const filteredResults = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim());
    if (!normalizedQuery) return [];

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    const matches = searchIndex
      .filter((result) => {
        const searchableText = normalizeSearchText(result.searchText);
        return terms.every((term) => searchableText.includes(term));
      })
      .sort((a, b) => {
        const normalizedTitleA = normalizeSearchText(a.title);
        const normalizedTitleB = normalizeSearchText(b.title);
        const titleScoreA = normalizedTitleA.includes(normalizedQuery) ? 0 : 1;
        const titleScoreB = normalizedTitleB.includes(normalizedQuery) ? 0 : 1;
        return titleScoreA - titleScoreB || a.chapterNumber - b.chapterNumber;
      });

    return RESULT_GROUPS.flatMap((type) =>
      matches.filter((result) => result.type === type).slice(0, 8),
    );
  }, [query, searchIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openResult = (result: SearchResult) => {
    setOpen(false);
    navigate(result.path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandDialogTrigger
        className="hidden lg:inline-flex"
        render={
          <Button
            className="min-w-36 justify-between text-muted-foreground"
            size="sm"
            variant="outline"
          >
            <span className="inline-flex items-center gap-2">
              <Search className="size-4" aria-hidden="true" />
              {t("search.button")}
            </span>
            <Kbd>{shortcut}</Kbd>
          </Button>
        }
      />
      <CommandDialogTrigger
        className="lg:hidden"
        render={
          <Button
            aria-label={t("search.button")}
            size="icon"
            variant="outline"
          >
            <Search aria-hidden="true" className="size-4.5" />
          </Button>
        }
      />
      <CommandDialogPopup className="max-w-2xl">
        <DialogTitle className="sr-only">{t("search.dialogTitle")}</DialogTitle>
        <Command
          mode="none"
          items={filteredResults.map((result) => result.id)}
          value={query}
          onValueChange={setQuery}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex items-center gap-3 border-b border-border px-4">
            <CommandInput
              aria-label={t("search.placeholder")}
              className="h-14 border-0! shadow-none before:hidden"
              placeholder={t("search.placeholder")}
            />
            <Kbd className="shrink-0">Esc</Kbd>
          </div>

          <CommandList className="max-h-[min(60vh,28rem)] flex-1 p-2">
            <CommandEmpty>
              {query.trim() ? t("search.empty") : t("search.startTyping")}
            </CommandEmpty>
            {RESULT_GROUPS.map((type) => {
              const results = filteredResults.filter(
                (result) => result.type === type,
              );
              if (results.length === 0) return null;

              return (
                <CommandGroup
                  key={type}
                  items={results.map((result) => result.id)}
                >
                  <CommandGroupLabel>
                    {t(`search.groups.${type}`)}
                  </CommandGroupLabel>
                  <CommandCollection>
                    {(resultId: string) => {
                      const result = results.find(
                        (candidate) => candidate.id === resultId,
                      );
                      if (!result) return null;

                      const titleMatches = findMatchRange(result.title, query);
                      const subtitleMatches = result.subtitle
                        ? findMatchRange(result.subtitle, query)
                        : undefined;
                      const excerpt =
                        !titleMatches && !subtitleMatches
                          ? getExcerpt(result, query)
                          : undefined;

                      return (
                        <CommandItem
                          key={result.id}
                          value={result.id}
                          onClick={() => openResult(result)}
                          className="min-h-14 gap-3 px-3 py-2"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
                            {resultIcon(result.type)}
                          </span>
                          <span className="grid min-w-0 flex-1 gap-0.5">
                            <span className="truncate font-medium">
                              {highlightMatch(result.title, query)}
                            </span>
                            {result.subtitle ? (
                              <span className="truncate text-xs text-muted-foreground">
                                {highlightMatch(result.subtitle, query)}
                              </span>
                            ) : null}
                            {excerpt ? (
                              <span className="line-clamp-2 text-xs text-muted-foreground/80">
                                {highlightMatch(excerpt, query)}
                              </span>
                            ) : null}
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground"
                          />
                        </CommandItem>
                      );
                    }}
                  </CommandCollection>
                </CommandGroup>
              );
            })}
          </CommandList>

          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
            <span>{t("search.keyboardHint")}</span>
            <Kbd>{shortcut}</Kbd>
          </div>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
