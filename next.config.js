/** @type {import("next").NextConfig} */
const nextConfig = {
  serverExternalPackages: ["iyzipay"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wsrgkfvqlypmpfsdajav.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;