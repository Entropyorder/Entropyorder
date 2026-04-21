import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { spring } from '../../animations/tokens.js';
import { localizedTitle, localizedSummary } from '../../content/blog/index.js';

export function BlogCard({ post }) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lng = i18n.language;
  const title = localizedTitle(post, lng);
  const summary = localizedSummary(post, lng);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', ...spring.snappy }}
    >
      <Link
        to={`/blog/${post.slug}`}
        state={{ backgroundLocation: location }}
        className="block group relative cursor-pointer rounded-2xl overflow-hidden
          bg-white dark:bg-[#0d1a2d]
          border border-slate-200/80 dark:border-white/[0.07]
          shadow-[0_2px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]
          dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]
          hover:shadow-[0_12px_40px_rgba(37,99,235,0.14),0_4px_12px_rgba(0,0,0,0.08)]
          dark:hover:shadow-[0_12px_48px_rgba(37,99,235,0.22),0_4px_16px_rgba(0,0,0,0.6)]
          transition-shadow duration-300"
      >
        {/* Cover */}
        <motion.div
          layoutId={`blog-cover-${post.slug}`}
          className="aspect-[8.5/11] relative overflow-hidden"
        >
          {post.cover ? (
            <img
              src={post.cover}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 via-accent-500/80 to-cyan-500/90 dark:from-brand-500/80 dark:via-accent-400/70 dark:to-cyan-400/80" />
              <div
                className="absolute inset-0 opacity-25 dark:opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <div
                  className="font-display text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-center mb-3 drop-shadow-lg"
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
                >
                  {title.split(' ').slice(0, 3).join(' ')}
                </div>
                <div className="h-px w-16 bg-white/40 mb-3" />
                <div className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/70 font-medium">
                  {post.date}
                </div>
              </div>
            </>
          )}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-page-bg dark:from-[#0d1a2d] to-transparent" />
        </motion.div>

        {/* Text */}
        <div className="relative p-4 sm:p-5 z-[2]">
          <motion.h3
            layoutId={`blog-title-${post.slug}`}
            className="font-display text-base sm:text-lg font-bold text-slate-800 dark:text-slate-50 leading-snug mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
          >
            {title}
          </motion.h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
            {summary}
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all">
            <span>阅读全文</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
