import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { type Section } from "../data/chapters";
import { useLocale } from "../context/LocaleContext";
import { chapterPath } from "../lib/routes";
import { LatexText } from "./LatexText";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function TableOfContents({
  chapterFolder,
  sections,
  activeSectionId,
}: {
  chapterFolder: string;
  sections: Section[];
  activeSectionId?: string;
}) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  if (sections.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 shrink-0 pl-8 sticky top-24 max-h-[calc(100vh-120px)]">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {t("toc.sections")}
      </p>
      <ScrollArea className="max-h-[calc(100vh-150px)]">
        <ul className="space-y-2.5 text-sm pr-4">
          {sections.map((section) => {
            const isActive = activeSectionId === section.id;
            const path = chapterPath(locale, chapterFolder, section.id);
            return (
              <li key={section.id}>
                <a
                  href={`${basePath}${path}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(path);
                  }}
                  className={cn(
                    "block py-0.5 transition-colors duration-150 leading-relaxed",
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <LatexText text={section.title} />
                </a>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
