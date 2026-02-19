import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/checkout", "/api/generate", "/api/webhook", "/api/test-db", "/api/cancel-subscription", "/auth/"],
    },
    sitemap: "https://nippogen-app.vercel.app/api/sitemap",
  };
}
