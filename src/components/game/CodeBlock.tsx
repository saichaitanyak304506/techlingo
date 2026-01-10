import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Code } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
        <Code className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-mono text-muted-foreground uppercase">{language}</span>
      </div>
      <div className="code-block">
        <ReactMarkdown
          components={{
            code: ({ children }) => (
              <code className="text-code-foreground">{children}</code>
            ),
            pre: ({ children }) => <pre className="whitespace-pre-wrap">{children}</pre>,
          }}
        >
          {`\`\`\`${language}\n${code}\n\`\`\``}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default CodeBlock;
