import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	sassOptions: {
		includePaths: ["./node_modules"],
	},
	webpack(config) {
		// Configure SVGR for importing SVG as React components
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
};

export default nextConfig;
