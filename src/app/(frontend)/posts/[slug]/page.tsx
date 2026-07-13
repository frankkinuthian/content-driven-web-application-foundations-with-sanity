import { notFound } from "next/navigation";

import { client, sanityFetch } from "@/sanity/lib/client";
import { POST_QUERY, POSTS_SLUGS_QUERY } from "@/sanity/lib/queries";
import { Post } from "@/components/post";
import { tryCatch } from "@/utils/tryCatch";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await sanityFetch({
    query: POST_QUERY,
    params,
    revalidate: 3600,
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto grid grid-cols-1 gap-6 p-12">
      <Post {...post} />
    </main>
  );
}

/** Generate static params for all posts */
export async function generateStaticParams() {
  const { data: slugs, error } = await tryCatch(() =>
    client.withConfig({ useCdn: false }).fetch(POSTS_SLUGS_QUERY),
  );

  if (error) {
    console.error("Failed to fetch slugs for static generation:", error);
    throw error;
  }

  return slugs;
}
