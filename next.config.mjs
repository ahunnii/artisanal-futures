import withBundleAnalyzer from "@next/bundle-analyzer";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "media.githubusercontent.com",
      "img.clerk.com",
      "avatars.githubusercontent.com",
      "cdn.discordapp.com",
      "lh3.googleusercontent.com",
      "s.gravatar.com",
    ],
  },
};

// export default withAnalyzer(config);
export default config;
