"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { visit } from "unist-util-visit";
import { Node } from "unist";
import { Root } from "hast";
import DOMPurify from "isomorphic-dompurify";

// Custom sanitization and processing for HN content
const sanitizeOptions = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "s", "a", "code", "pre",
    "ul", "ol", "li", "blockquote", "hr", "h1", "h2", "h3", "h4", "h5", "h6"
  ],
  ALLOWED_ATTR: ["href", "title", "class", "id"],
  ALLOW_DATA_ATTR: false,
  ALLOWED_URI_REGEXP: /^(https?|mailto):/i
};

// Custom remark plugin to process HN-specific markdown
function hnRemarkPlugin() {
  return (tree: Root) => {
    visit(tree, "text", (node: any) => {
      // Convert HN-style links [text](url) to proper markdown links
      if (typeof node.value === "string") {
        node.value = node.value
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[$1]($2)");
      }
    });
  };
}

// Custom components for ReactMarkdown
const markdownComponents = {
  a: ({ node, ...props }: any) => {
    const href = props.href || "";
    const isExternal = href.startsWith("http");

    return (
      <a
        {...props}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-orange-600 dark:text-orange-500 hover:underline"
      />
    );
  },
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");

    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }

    return (
      <code
        className={`bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-sm font-mono ${className || ""}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ node, ...props }: any) => (
    <pre
      className="overflow-x-auto bg-neutral-100 dark:bg-neutral-900 p-3 rounded-lg my-4"
      {...props}
    />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-orange-500 pl-4 italic text-neutral-600 dark:text-neutral-400 my-2"
      {...props}
    />
  ),
  hr: ({ node, ...props }: any) => (
    <hr className="border-neutral-200 dark:border-neutral-800 my-6" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc pl-6 my-2 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal pl-6 my-2 space-y-1" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li className="pl-1" {...props} />
  ),
  h1: ({ node, ...props }: any) => (
    <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-xl font-bold mt-5 mb-2" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
  ),
  h4: ({ node, ...props }: any) => (
    <h4 className="text-base font-bold mt-3 mb-1" {...props} />
  ),
  h5: ({ node, ...props }: any) => (
    <h5 className="text-sm font-bold mt-2 mb-1" {...props} />
  ),
  h6: ({ node, ...props }: any) => (
    <h6 className="text-xs font-bold mt-1 mb-1" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="mb-3 leading-relaxed" {...props} />
  )
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
  allowHtml?: boolean;
}

export function MarkdownRenderer({
  content,
  className = "",
  allowHtml = false
}: MarkdownRendererProps) {
  if (!content) {
    return null;
  }

  // Clean the content first
  let cleanedContent = content.trim();

  // Decode HTML entities that HN API returns
  cleanedContent = cleanedContent
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");  // HN uses this for forward slashes

  // If we allow HTML, sanitize it first
  if (allowHtml) {
    cleanedContent = DOMPurify.sanitize(cleanedContent, sanitizeOptions);
  }

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, hnRemarkPlugin]}
        components={markdownComponents}
        skipHtml={!allowHtml}
        unwrapDisallowed={true}
      >
        {cleanedContent}
      </ReactMarkdown>
    </div>
  );
}