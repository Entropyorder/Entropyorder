import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { findPostBySlug, getAdjacentPosts, localizedTitle } from '../content/blog/index.js';
import { MarkdownBody } from '../components/blog/MarkdownBody.jsx';
import { OverlayShell } from '../components/OverlayShell.jsx';

export function BlogDetailPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const lng = i18n.language;

  const post = findPostBySlug(slug);
  const { newer, older } = getAdjacentPosts(slug);

  return (
    <OverlayShell>
      {({ close }) => {
        if (!post) {
          return (
            <div className="p-12 text-center">
              <button
                onClick={close}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="关闭"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
              <h1 className="font-display text-2xl font-bold mb-2">文章未找到</h1>
              <Link to="/blog" className="text-brand-600 hover:underline">返回博客列表</Link>
            </div>
          );
        }

        const title = localizedTitle(post, lng);

        return (
          <div className="relative">
            {/* Close button (top-right) */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 p-2 rounded-full
                bg-white/80 dark:bg-slate-900/80 backdrop-blur
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-colors"
              aria-label="关闭"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>

            {/* Cover (shared element) */}
            {post.cover && (
              <motion.div
                layoutId={`blog-cover-${post.slug}`}
                className="w-full overflow-hidden"
              >
                <img
                  src={post.cover}
                  alt={title}
                  className="w-full aspect-[21/9] object-cover"
                />
              </motion.div>
            )}

            {/* Body */}
            <article className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
              {/* Tags + date */}
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span>{post.date}</span>
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/25 text-brand-600 dark:text-brand-300"
                  >
                    {tag}
                  </span>
                ))}
                {post.readingMinutes != null && (
                  <span className="ml-auto">{post.readingMinutes} 分钟阅读</span>
                )}
              </div>

              <motion.h1
                layoutId={`blog-title-${post.slug}`}
                className="font-display text-3xl md:text-4xl font-bold leading-tight mb-8 text-slate-800 dark:text-slate-50"
              >
                {title}
              </motion.h1>

              <MarkdownBody content={post.rawContent} post={post} />

              {/* Prev / Next */}
              {(newer || older) && (
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-4">
                  {newer ? (
                    <Link
                      to={`/blog/${newer.slug}`}
                      replace
                      className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors max-w-[45%]"
                    >
                      <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left min-w-0">
                        <div className="text-xs text-slate-400">较新一篇</div>
                        <div className="font-medium truncate">{localizedTitle(newer, lng)}</div>
                      </div>
                    </Link>
                  ) : <div />}
                  {older ? (
                    <Link
                      to={`/blog/${older.slug}`}
                      replace
                      className="flex items-center gap-3 text-right text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors max-w-[45%]"
                    >
                      <div className="min-w-0">
                        <div className="text-xs text-slate-400">较旧一篇</div>
                        <div className="font-medium truncate">{localizedTitle(older, lng)}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 flex-shrink-0" />
                    </Link>
                  ) : <div />}
                </div>
              )}
            </article>
          </div>
        );
      }}
    </OverlayShell>
  );
}
