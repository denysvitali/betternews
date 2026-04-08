"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components, ExtraProps } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { visit } from "unist-util-visit";
import type { Root as MdastRoot, Text } from "mdast";
import DOMPurify from "isomorphic-dompurify";
import { convertHNUrlToRelative } from "@/lib/utils";

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
  return (tree: MdastRoot) => {
    visit(tree, "text", (node) => {
      const textNode = node as Text;

      // Convert HN-style links [text](url) to proper markdown links
      if (typeof textNode.value === "string") {
        textNode.value = textNode.value
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[$1]($2)");
      }
    });
  };
}

type MarkdownAnchorProps = React.ComponentPropsWithoutRef<"a"> & ExtraProps;
type MarkdownCodeProps = React.ComponentPropsWithoutRef<"code"> &
  ExtraProps & {
    inline?: boolean;
  };
type MarkdownElementProps<T extends keyof React.JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T> & ExtraProps;
type SyntaxHighlighterStyle = Record<string, React.CSSProperties>;
const codeBlockStyle = vscDarkPlus as unknown as SyntaxHighlighterStyle;

// Custom components for ReactMarkdown
const markdownComponents: Components = {
  a: ({ ...props }: MarkdownAnchorProps) => {
    const href = props.href || "";

    // Try to convert HN URLs to relative paths
    const relativePath = convertHNUrlToRelative(href);
    const finalHref = relativePath || href;
    const isExternal = finalHref.startsWith("http");
    const isHNConverted = relativePath !== null;

    // Extract HN ID if it's a converted link for display
    const hnIdMatch = relativePath?.match(/\/story\/(\d+)/);
    const hnId = hnIdMatch ? hnIdMatch[1] : null;

    return (
      <span className="inline-flex items-center gap-1">
        <a
          {...props}
          href={finalHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={`${isHNConverted
            ? "text-blue-600 dark:text-blue-400 font-medium"
            : "text-orange-600 dark:text-orange-500"
          } hover:underline`}
        />
        {isHNConverted && hnId && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono">
            HN#{hnId}
          </span>
        )}
      </span>
    );
  },
  code: ({ inline, className, children, style: _style, ...props }: MarkdownCodeProps) => {
    void _style;
    const match = /language-(\w+)/.exec(className || "");

    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={codeBlockStyle}
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
  pre: (props: MarkdownElementProps<"pre">) => (
    <pre
      className="overflow-x-auto bg-neutral-100 dark:bg-neutral-900 p-3 rounded-lg my-4"
      {...props}
    />
  ),
  blockquote: (props: MarkdownElementProps<"blockquote">) => (
    <blockquote
      className="border-l-4 border-orange-500 pl-4 italic text-neutral-600 dark:text-neutral-400 my-2"
      {...props}
    />
  ),
  hr: (props: MarkdownElementProps<"hr">) => (
    <hr className="border-neutral-200 dark:border-neutral-800 my-6" {...props} />
  ),
  ul: (props: MarkdownElementProps<"ul">) => (
    <ul className="list-disc pl-6 my-2 space-y-1" {...props} />
  ),
  ol: (props: MarkdownElementProps<"ol">) => (
    <ol className="list-decimal pl-6 my-2 space-y-1" {...props} />
  ),
  li: (props: MarkdownElementProps<"li">) => (
    <li className="pl-1" {...props} />
  ),
  h1: (props: MarkdownElementProps<"h1">) => (
    <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />
  ),
  h2: (props: MarkdownElementProps<"h2">) => (
    <h2 className="text-xl font-bold mt-5 mb-2" {...props} />
  ),
  h3: (props: MarkdownElementProps<"h3">) => (
    <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
  ),
  h4: (props: MarkdownElementProps<"h4">) => (
    <h4 className="text-base font-bold mt-3 mb-1" {...props} />
  ),
  h5: (props: MarkdownElementProps<"h5">) => (
    <h5 className="text-sm font-bold mt-2 mb-1" {...props} />
  ),
  h6: (props: MarkdownElementProps<"h6">) => (
    <h6 className="text-xs font-bold mt-1 mb-1" {...props} />
  ),
  p: (props: MarkdownElementProps<"p">) => (
    <p className="mb-3 leading-relaxed" {...props} />
  )
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
  allowHtml?: boolean;
  stripHtml?: boolean;
}

export function MarkdownRenderer({
  content,
  className = "",
  allowHtml = false,
  stripHtml = false
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

  // If stripHtml is enabled, remove HTML tags completely
  if (stripHtml) {
    cleanedContent = cleanedContent
      .replace(/<\/?p>/g, '\n\n')  // Convert p tags to line breaks
      .replace(/<a[^>]*>(.*?)<\/a>/g, '$1')  // Extract link text, remove tags
      .replace(/<[^>]*>/g, '')  // Remove any remaining HTML tags
      .replace(/\n{3,}/g, '\n\n')  // Normalize excessive line breaks
      .trim();
  }

  // If we allow HTML, check if this is HTML content (like from HN stories)
  if (allowHtml) {
    // Check if content contains HTML tags (pure HTML or mixed content from HN)
    if (/<[^>]+>/.test(cleanedContent)) {
      // This is HTML content (pure or mixed), sanitize and render as HTML
      const sanitizedHtml = DOMPurify.sanitize(cleanedContent, sanitizeOptions);
      return (
        <div
          className={`prose dark:prose-invert max-w-none ${className}`}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      );
    }
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
