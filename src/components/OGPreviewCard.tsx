/**
 * Shows how a shared link will look on social platforms (Twitter/X, FB, LinkedIn).
 * Mirrors the `summary_large_image` card layout used in our SEO meta.
 */
export const OGPreviewCard = ({
  title,
  description,
  image,
  url,
}: { title: string; description: string; image?: string; url: string }) => {
  const host = (() => {
    try { return new URL(url).host.replace(/^www\./, ""); } catch { return url; }
  })();
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.02]">
      <div className="aspect-[1.91/1] w-full overflow-hidden bg-gradient-to-br from-gold/15 via-black to-black">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={`OG preview: ${title}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30 text-xs uppercase tracking-[0.22em]">
            Sin imagen OG
          </div>
        )}
      </div>
      <div className="border-t border-white/10 bg-black/40 p-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{host}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-white">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-white/55">{description}</p>
      </div>
    </div>
  );
};