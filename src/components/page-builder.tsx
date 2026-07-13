import { Hero } from "@/components/blocks/hero";
import { Features } from "@/components/blocks/features";
import { SplitImage } from "@/components/blocks/split-image";
import { FAQs } from "@/components/blocks/faqs";
import { PAGE_QUERY_RESULT } from "@/sanity/types";

type PageBuilderProps = {
  content: NonNullable<PAGE_QUERY_RESULT>["content"];
};

export function PageBuilder({ content }: PageBuilderProps) {
  if (!Array.isArray(content)) {
    return null;
  }

  return (
    <main>
      {content.map((block) => {
        const { _key, _type } = block;

        switch (block._type) {
          case "hero":
            return <Hero key={_key} {...block} />;
          case "features":
            return <Features key={_key} {...block} />;
          case "splitImage":
            return <SplitImage key={_key} {...block} />;
          case "faqs":
            return <FAQs key={_key} {...block} />;
          default:
            // This is a fallback for when we don't have a block type
            return <div key={_key}>Block not found: {_type}</div>;
        }
      })}
    </main>
  );
}
