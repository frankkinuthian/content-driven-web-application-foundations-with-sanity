import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { client, sanityFetch } from "@/sanity/lib/client";
import { POST_QUERY, POSTS_SLUGS_QUERY } from "@/sanity/lib/queries";
import { Post } from "@/components/post";
import { tryCatch } from "@/utils/tryCatch";
import { urlFor } from "@/sanity/lib/image";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

const getPost = async (params: RouteProps["params"]) => {
  const { slug } = await params;

  return sanityFetch({
    query: POST_QUERY,
    params: { slug },
    revalidate: 3600,
    tags: [`post:${slug}`, "author", "category"],
  });
};

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const post = await getPost(params);

  if (!post) {
    return {};
  }

  const metadata: Metadata = {
    title: post.seo.title,
    description: post.seo.description,
  };

  if (post.seo.image) {
    metadata.openGraph = {
      images: {
        url: urlFor(post.seo.image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: post.seo.title,
      },
    };
  }

  if (post.seo.noIndex) {
    metadata.robots = "noindex";
  }

  return metadata;
}

export default async function Page({ params }: RouteProps) {
  const post = await getPost(params);

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
