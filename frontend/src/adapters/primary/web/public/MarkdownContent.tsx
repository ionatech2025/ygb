import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { slugifyHeading } from '../../../../core/content/pdmPublicInfoSections';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h2: ({ children }) => {
          const text = String(children);
          return (
            <h2 id={slugifyHeading(text)} className="mt-10 scroll-mt-24 text-2xl font-semibold text-text first:mt-0">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const text = String(children);
          return (
            <h3 id={slugifyHeading(text)} className="mt-6 scroll-mt-24 text-xl font-semibold text-text">
              {children}
            </h3>
          );
        },
        p: ({ children }) => <p className="mt-4 leading-7 text-text-muted">{children}</p>,
        ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-text-muted">{children}</ul>,
        ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-text-muted">{children}</ol>,
        blockquote: ({ children }) => (
          <blockquote className="mt-4 border-l-4 border-brand pl-4 italic text-text-muted">{children}</blockquote>
        ),
        table: ({ children }) => (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-surface-muted px-3 py-2 text-left font-semibold text-text">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-3 py-2 text-text-muted">{children}</td>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="font-medium text-brand underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="my-8 border-border" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
