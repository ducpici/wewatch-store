import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [
            react(),
            svgr({
                svgrOptions: {
                    icon: true,
                    // This will transform your SVG to a React component
                    exportType: "named",
                    namedExport: "ReactComponent",
                },
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            host: "0.0.0.0",
            port: parseInt(env.VITE_PORT),
            strictPort: true, // báo lỗi nếu port bị chiếm
            cors: true,
        },
    };
});
