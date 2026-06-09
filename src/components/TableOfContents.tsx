import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseToc, TocItem } from "../lib/toc";

export function TableOfContents({
  content,
  chapterId,
}: {
  content: string;
  chapterId: string;
}) {
  const navigate = useNavigate();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setItems(parseToc(content));
  }, [content]);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Filter elements currently in the viewport
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort visible entries or use the first visible heading from top
          const firstVisible = visibleEntries[0].target.id;
          setActiveId(firstVisible);
        }
      },
      {
        rootMargin: "-100px 0px -70% 0px", // Matches scroll offset
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      items.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 shrink-0 pl-8 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
        En este capítulo
      </p>
      <ul className="space-y-2.5 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`${basePath}/docs/${chapterId}/${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/docs/${chapterId}/${item.id}`);
              }}
              className={`block py-0.5 transition-colors duration-150 leading-relaxed ${
                activeId === item.id
                  ? "text-amber-500 dark:text-amber-450 font-medium"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
