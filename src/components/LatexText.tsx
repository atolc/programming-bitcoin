import katex from "katex";

interface LatexTextProps {
  text: string;
}

export function LatexText({ text }: LatexTextProps) {
  if (!text) return null;

  // Split the text by inline math expressions like $...$
  // Using parenthesis in regex captures the matched delimiters in the split array
  const parts = text.split(/(\$[^\$]+\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: html }}
                className="inline-block align-middle"
              />
            );
          } catch (e) {
            console.error("Error rendering KaTeX in LatexText:", e);
            return <span key={index}>{part}</span>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
