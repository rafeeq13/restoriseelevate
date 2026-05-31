import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { LexicalContent } from "@/components/marketing/LexicalContent";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { getBlogPostBySlug } from "@/lib/content";

type Params = { locale: string; slug: string };

type Post = {
  title?: string;
  excerpt?: string;
  publishedAt?: string;
  readingTimeMinutes?: number;
  author?: { name?: string } | string;
  category?: { name?: string } | string;
  body?: SerializedEditorState | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = (await getBlogPostBySlug(slug, locale)) as unknown as Post | null;
  return {
    title: post?.title ?? "Article",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const post = (await getBlogPostBySlug(slug, locale)) as unknown as Post | null;
  if (!post) notFound();

  const categoryName =
    typeof post.category === "object"
      ? post.category?.name
      : (post.category as string | undefined);

  return (
    <>
      <PageHeader
        eyebrow={categoryName}
        title={post.title ?? "Article"}
        description={post.excerpt}
      />

      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]" width="narrow">
          <Reveal variant="fade-up">
            <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--brand-border)] pb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              <span className="text-ink-soft">
                {typeof post.author === "object" ? post.author?.name : post.author}
              </span>
              {post.publishedAt && (
                <>
                  <span aria-hidden="true" className="inline-block h-px w-4 bg-[color:var(--brand-border-strong)]" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </>
              )}
              <span aria-hidden="true" className="inline-block h-px w-4 bg-[color:var(--brand-border-strong)]" />
              <span>{post.readingTimeMinutes ?? "—"} min read</span>
            </div>
            <div className="photo-frame aspect-[16/9] my-10" />
            <article className="drop-cap">
              <LexicalContent data={post.body} />
            </article>
          </Reveal>
        </Container>
      </section>

      <FinalCTA
        eyebrow="Got a venue problem?"
        title="Skip the article. Just"
        accentWord="ask us."
        description="Reading is great. A 15-minute call is better. Tell us what you're working on and we'll point you at the highest-leverage move."
        primaryLabel="Book a call"
      />
    </>
  );
}
