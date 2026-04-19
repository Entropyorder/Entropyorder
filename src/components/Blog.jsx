import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { stagger, offset, duration, spring } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';

function BlogCard({ post, onOpen }) {
  const aspectRatio = 'aspect-[8.5/11]';
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', ...spring.snappy }}
      onClick={() => onOpen(post)}
      className="group cursor-pointer rounded-2xl overflow-hidden
        bg-white dark:bg-[#0d1a2d]
        border border-slate-200/80 dark:border-white/[0.07]
        shadow-[0_2px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]
        dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]
        hover:shadow-[0_12px_40px_rgba(37,99,235,0.14),0_4px_12px_rgba(0,0,0,0.08)]
        dark:hover:shadow-[0_12px_48px_rgba(37,99,235,0.22),0_4px_16px_rgba(0,0,0,0.6)]
        transition-shadow duration-300"
    >
      <div className={`${aspectRatio} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 via-accent-500/80 to-cyan-500/90 dark:from-brand-500/80 dark:via-accent-400/70 dark:to-cyan-400/80" />
        <div className="absolute inset-0 opacity-25 dark:opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
          <div className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-center mb-3 drop-shadow-lg" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
            {post.title.split(' ').slice(0, 3).join(' ')}
          </div>
          <div className="h-px w-16 bg-white/40 mb-3" />
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/70 font-medium">
            {post.date}
          </div>
        </div>
        <div className="card-shimmer" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-page-bg dark:from-[#0d1a2d] to-transparent" />
      </div>
      <div className="relative p-4 sm:p-5 z-[2]">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-50 leading-snug mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
          {post.summary}
        </p>
        <div className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all">
          <span>阅读全文</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

function ArticleModal({ post, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: offset.small }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: offset.small }}
          transition={{ duration: duration.normal, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-50 leading-snug">{post.title}</h2>
              <span className="text-sm text-slate-400 dark:text-slate-500 mt-1 block">{post.date}</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="article-prose max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Blog() {
  const { t } = useTranslation();
  const rawPosts = t('blog.posts', { returnObjects: true });
  const posts = Array.isArray(rawPosts) ? rawPosts : [];
  const [selectedPost, setSelectedPost] = useState(null);
  const { getChildProps } = useScrollReveal(stagger.fast);

  return (
    <section id="blog" className="relative py-28 overflow-hidden bg-page-bg dark:bg-page-bg-dark">
      <div className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(37,99,235,0.18) 1.5px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...presets.fadeUp(offset.medium)}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-500 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 inline-block" />
            {t('blog.tag')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50 mb-5 leading-tight">
            {t('blog.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: offset.medium }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: duration.normal, delay: getChildProps(i).delay, ease: [0.16, 1, 0.3, 1] }}
            >
              <BlogCard post={post} onOpen={setSelectedPost} />
            </motion.div>
          ))}
        </div>
      </div>

      {selectedPost && (
        <ArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </section>
  );
}