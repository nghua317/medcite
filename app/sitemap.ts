import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://citeease.com/",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://citeease.com/guides",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://citeease.com/guides/how-to-cite-medical-journal-article-nlm",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://citeease.com/guides/find-a-doi",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://citeease.com/guides/check-a-generated-citation",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://citeease.com/faq",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://citeease.com/about",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
