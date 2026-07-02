"use client";

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import rust from "highlight.js/lib/languages/rust";
import go from "highlight.js/lib/languages/go";
import type { CodeLanguage } from "@/types/blocks";

hljs.registerLanguage("python", python);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("go", go);

const LANGUAGE_KEYS: Record<CodeLanguage, string> = {
  Python: "python",
  JavaScript: "javascript",
  TypeScript: "typescript",
  Rust: "rust",
  Go: "go",
};

/** Syntax-highlighted, line-numbered code viewer shared by code blocks. */
export function CodeView({
  code,
  language,
}: {
  code: string;
  language: CodeLanguage;
}) {
  const lines = useMemo(() => {
    const key = LANGUAGE_KEYS[language];
    try {
      const highlighted = hljs.highlight(code, { language: key }).value;
      return highlighted.split("\n");
    } catch {
      return code
        .split("\n")
        .map((line) =>
          line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        );
    }
  }, [code, language]);

  return (
    <div className="nowheel h-full overflow-auto rounded-lg border border-border bg-background">
      <table className="w-full border-collapse font-mono text-[11px] leading-5">
        <tbody>
          {lines.map((line, i) => (
            <tr key={i}>
              <td className="w-8 select-none border-r border-border/60 px-2 text-right align-top text-text-secondary/50">
                {i + 1}
              </td>
              <td className="whitespace-pre px-3 align-top">
                <span
                  className="hljs"
                  dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
