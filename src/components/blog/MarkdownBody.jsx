import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export function MarkdownBody({ content, post }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          img: ({ src, alt, ...rest }) => {
            const resolved = src && src.startsWith('./') && post?.resolveAsset
              ? post.resolveAsset(src)
              : src;
            return (
              <img
                src={resolved}
                alt={alt ?? ''}
                loading="lazy"
                className="my-6 rounded-xl w-full"
                {...rest}
              />
            );
          },
          a: ({ href, children, ...rest }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
