import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { stagger, offset, duration } from '../animations/tokens.js';
import * as presets from '../animations/presets.js';
import { BlogCard } from '../components/blog/BlogCard.jsx';
import { loadPosts } from '../content/blog/index.js';

export function BlogListPage() {
  const { t } = useTranslation();
  const posts = loadPosts();
  const { getChildProps } = useScrollReveal(stagger.fast);

  return (
    <section id="blog" className="relative py-28 overflow-hidden bg-page-bg dark:bg-page-bg-dark min-h-screen">
      <div
        className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(37,99,235,0.18) 1.5px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...presets.fadeUp(offset.medium)} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-500 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 inline-block" />
            {t('blog.tag')}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50 mb-5 leading-tight">
            {t('blog.title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <div className="text-center text-slate-400 py-20">暂无博客</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: offset.medium }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: duration.normal, delay: getChildProps(i).delay, ease: [0.16, 1, 0.3, 1] }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
