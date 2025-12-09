import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",
  devCommand: "npm run dev",
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content/pages"],
      models: [
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.json",
          fields: [
            { name: "slug", type: "string", required: true },
            { name: "title", type: "string", required: true },
            {
              name: "hero",
              type: "object",
              fields: [
                { name: "title", type: "string", required: true },
                { name: "subtitle", type: "string" },
                { name: "image", type: "image" },
                {
                  name: "buttons",
                  type: "object",
                  fields: [
                    {
                      name: "donate",
                      type: "object",
                      fields: [
                        { name: "text", type: "string" },
                        { name: "url", type: "string" }
                      ]
                    },
                    {
                      name: "learnMore",
                      type: "object",
                      fields: [
                        { name: "text", type: "string" },
                        { name: "url", type: "string" }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "about",
              type: "object",
              fields: [
                { name: "title", type: "string" },
                { name: "paragraph", type: "text" },
                { name: "buttonText", type: "string" },
                { name: "buttonUrl", type: "string" },
                { name: "images", type: "list", items: { type: "image" } }
              ]
            }
          ]
        }
      ],
      assetsConfig: {
        referenceType: "static",
        staticDir: "images",
        uploadDir: "uploads",
        publicPath: "/images/"
      }
    })
  ]
});
