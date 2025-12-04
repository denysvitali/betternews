"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Card } from "@/components/ui";

export default function TestMarkdownPage() {
  const testContent = `
# Markdown Test Page

This is a test of the **safe markdown rendering** functionality.

## Features

- ✅ **Bold text** and *italic text*
- \`inline code\` and code blocks
- [Links](https://example.com)
- Lists (like this one)
- > Blockquotes
- \`\`\`javascript
function hello() {
  console.log("Hello, safe markdown!");
}
\`\`\`

## Security Features

- ✅ XSS protection via DOMPurify
- ✅ Safe HTML sanitization
- ✅ Proper link handling (external links open in new tab)
- ✅ Syntax highlighting for code blocks

## HN-Specific Features

- ✅ Handles HN-style links: [text](url)
- ✅ Preserves HN formatting
- ✅ Safe rendering of user-generated content
  `;

  const dangerousContent = `
# Dangerous Content Test

This should be safely rendered:

<script>alert('XSS attack!')</script>
<iframe src="evil.com"></iframe>
<img src="x" onerror="alert('XSS')">

But legitimate content should work:

- Normal **markdown** formatting
- [Safe links](https://example.com)
- \`code examples\`
  `;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Markdown Rendering Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="default" padding="md" className="sm:p-6">
          <h2 className="text-xl font-bold mb-4">✅ Safe Markdown Test</h2>
          <MarkdownRenderer content={testContent} />
        </Card>

        <Card variant="default" padding="md" className="sm:p-6">
          <h2 className="text-xl font-bold mb-4">🛡️ Security Test</h2>
          <MarkdownRenderer content={dangerousContent} allowHtml={true} />
        </Card>
      </div>

      <Card variant="default" padding="md" className="mt-6 sm:p-6">
        <h2 className="text-xl font-bold mb-4">📝 Code Example</h2>
        <MarkdownRenderer
          content={`
Here's some example code with syntax highlighting:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

\`\`\`python
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)
\`\`\`
          `}
        />
      </Card>
    </div>
  );
}