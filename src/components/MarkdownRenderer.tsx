import ReactMarkdown, { Components } from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import { CodeSandbox } from "./CodeSandbox";
import { slugify } from "../lib/toc";

interface MarkdownRendererProps {
  content: string;
}

const getNodeText = (node: any): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (node && node.props && node.props.children) return getNodeText(node.props.children);
  return "";
};

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
  code({ node, className, children, ...props }) {
    const match = /language-([\w-]+)/.exec(className || "");
    const isInline = !match;

    if (isInline) {
      return (
        <code
          className="rounded bg-stone-250 dark:bg-stone-800 px-1.5 py-0.5 text-sm font-semibold text-stone-900 dark:text-stone-100"
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
        outputPart = fullContent.substring(separatorIndex + 5); // Length of "\n---\n"
      }

      return (
        <CodeSandbox
          code={codePart}
          output={outputPart}
        />
      );
    }

    return (
      <CodeBlock
        code={String(children).replace(/\n$/, "")}
        lang={lang}
      />
    );
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-stone dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none prose-headings:scroll-mt-24">
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

