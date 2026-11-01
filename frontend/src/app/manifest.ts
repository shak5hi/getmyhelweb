import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GetMyHelp",
    short_name: "GetMyHelp",
    description: "Verified domestic help, organised at the society level.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: "#5a2ca0",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
