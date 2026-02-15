/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "khfbozdcrkgxblswaqlg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run"
      },
    ],
  },
};

export default nextConfig;
