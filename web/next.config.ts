import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que o Codespaces (e qualquer proxy reverso) sirva a aplicação
  allowedDevHosts: [".app.github.dev", ".github.dev", "localhost"],
};

export default nextConfig;
