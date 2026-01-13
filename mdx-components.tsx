import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override default elements with custom styling
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3 text-slate-700 dark:text-slate-300">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2 text-slate-700 dark:text-slate-300">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-400">
        {children}
      </p>
    ),
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-alkane-600 hover:text-alkane-700 dark:text-alkane-400 dark:hover:text-alkane-300 underline"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href || "#"}
          className="text-alkane-600 hover:text-alkane-700 dark:text-alkane-400 dark:hover:text-alkane-300 underline"
        >
          {children}
        </Link>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-600 dark:text-slate-400">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-600 dark:text-slate-400">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-alkane-500 pl-4 py-2 my-4 bg-alkane-50 dark:bg-alkane-900/20 rounded-r-lg">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      // Check if this is a code block (has language class) or inline code
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return <code className={className}>{children}</code>;
      }
      return (
        <code className="bg-slate-800 text-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold border border-slate-200 dark:border-slate-700">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 border border-slate-200 dark:border-slate-700">
        {children}
      </td>
    ),
    hr: () => <hr className="my-8 border-slate-200 dark:border-slate-700" />,
    // Merge with any provided components
    ...components,
  };
}
