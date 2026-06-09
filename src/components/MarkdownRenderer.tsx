import ReactMarkdown, { Components } from "react-markdown";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "./CodeBlock";
import { CodeSandbox } from "./CodeSandbox";
import { QuizBlock, type Question } from "./QuizBlock";
import { Callout, parseCallout } from "./Callout";
import { Collapsible } from "./Collapsible";
import { slugify } from "../lib/toc";
import { remarkDirectiveComponents } from "../lib/remark-directive-components";

interface MarkdownRendererProps {
  content: string;
}

const getNodeText = (node: unknown): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (
    node &&
    typeof node === "object" &&
    "props" in node &&
    node.props &&
    typeof node.props === "object" &&
    "children" in node.props
  ) {
    return getNodeText((node.props as { children: unknown }).children);
  }
  return "";
};

function parseQuizContent(raw: string): Question[] {
  try {
    const parsed = JSON.parse(raw) as Question[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (q) =>
        typeof q.prompt === "string" &&
        Array.isArray(q.options) &&
        typeof q.answer === "number" &&
        typeof q.explanation === "string",
    );
  } catch {
    return [];
  }
}

const markdownComponents: Components = {
  pre({ children }) {
    return <>{children}</>;
  },
  h2({ children }) {
    const id = slugify(getNodeText(children));
    return <h2 id={id}>{children}</h2>;
  },
  h3({ children }) {
    const id = slugify(getNodeText(children));
    return <h3 id={id}>{children}</h3>;
  },
  blockquote({ children }) {
    const text = getNodeText(children).trim();
    const callout = parseCallout(text);
    if (callout) {
      return (
        <Callout variant={callout.variant}>
          <p>{callout.body}</p>
        </Callout>
      );
    }
    return <blockquote>{children}</blockquote>;
  },
  // @ts-expect-error custom element from remark directive plugin
  collapsible({ title, children }: { title?: string; children?: React.ReactNode }) {
    return <Collapsible title={title || "Detalles"}>{children}</Collapsible>;
  },
  code({ className, children, ...props }) {
    const match = /language-([\w-]+)/.exec(className || "");
    const isInline = !match;

    if (isInline) {
      return (
        <code
          className="rounded bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 text-sm font-semibold text-stone-900 dark:text-stone-100"
          {...props}
        >
          {children}
        </code>
      );
    }

    const lang = match[1];

    if (lang === "python-sandbox") {
      const fullContent = String(children).replace(/\n$/, "");
      const separatorIndex = fullContent.indexOf("\n---\n");
      let codePart = fullContent;
      let outputPart = "";

      if (separatorIndex !== -1) {
        codePart = fullContent.substring(0, separatorIndex);
        outputPart = fullContent.substring(separatorIndex + 5);
      }

      return <CodeSandbox code={codePart} expectedOutput={outputPart} />;
    }

    if (lang === "quiz") {
      const questions = parseQuizContent(String(children).replace(/\n$/, ""));
      return <QuizBlock questions={questions} />;
    }

    return (
      <CodeBlock code={String(children).replace(/\n$/, "")} lang={lang} />
    );
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-stone dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none prose-headings:scroll-mt-24">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkDirective, remarkDirectiveComponents]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
