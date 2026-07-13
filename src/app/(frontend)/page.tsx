import { PageBuilder } from "@/components/page-builder";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  const { data: page } = await sanityFetch({
    query: HOME_PAGE_QUERY,
  });

  return page?.homePage?.content ? (
    <PageBuilder
      content={page?.homePage.content}
      documentId={page?.homePage._id}
      documentType={page?.homePage._type}
    />
  ) : null;
}
