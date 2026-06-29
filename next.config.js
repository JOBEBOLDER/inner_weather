/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Vercel serverless: include prompt .txt files in API route bundles
  experimental: {
    outputFileTracingIncludes: {
      "/api/quick": ["./prompts/**/*"],
      "/api/deep/chat": ["./prompts/**/*"],
      "/api/deep/receipt": ["./prompts/**/*"],
    },
  },
};

module.exports = nextConfig;
