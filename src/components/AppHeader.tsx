import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { githubUrl } from "../lib/constants";
import { homePath } from "../lib/routes";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

type AppHeaderProps = {
  breadcrumbs?: ReactNode;
  menuOpen?: boolean;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
};

export function AppHeader({
  breadcrumbs,
  menuOpen,
  onMenuToggle,
  showMenuButton = false,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          {showMenuButton && onMenuToggle ? (
            <Button
              className="lg:hidden"
              onClick={onMenuToggle}
              size="icon"
              type="button"
              variant="outline"
              aria-label="Toggle Navigation"
            >
              {menuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </Button>
          ) : null}
          <Link
            to={homePath()}
            className="flex items-center gap-3 min-w-0 group"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20 group-hover:bg-primary/90 transition-colors">
              <BookOpen className="size-4.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight truncate">
                Programming Bitcoin
              </h1>
              <p className="text-xs text-muted-foreground font-medium truncate">
                Guía de Estudio y Resúmenes
              </p>
            </div>
          </Link>
        </div>

        {breadcrumbs ? (
          <Breadcrumb className="hidden md:flex min-w-0">
            <BreadcrumbList className="text-xs font-medium">
              {breadcrumbs}
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          <Button
            render={<a href={githubUrl} target="_blank" rel="noreferrer" />}
            size="icon"
            title="Ver en GitHub"
            aria-label="Ver en GitHub"
          >
            <GithubIcon className="size-4.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
