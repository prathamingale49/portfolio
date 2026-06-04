import createMDX from "@next/mdx";
import path from "node:path";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    root: path.resolve(),
  },
};

export default withMDX(nextConfig);
