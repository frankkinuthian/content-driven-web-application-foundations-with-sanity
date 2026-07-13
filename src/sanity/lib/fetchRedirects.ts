import { client } from "@/sanity/lib/client";
import { REDIRECTS_QUERY } from "@/sanity/lib/queries";

export async function fetchRedirects() {
  const redirects = await client
    .withConfig({ useCdn: false })
    .fetch(REDIRECTS_QUERY);

  return redirects
    .filter((redirect) => redirect.source && redirect.destination)
    .map((redirect) => ({
      source: redirect.source as string,
      destination: redirect.destination as string,
      permanent: redirect.permanent ?? true,
    }));
}
