import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";
import svgr from "vite-plugin-svgr";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [
            tailwindcss(),
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
        server: {
            host: "0.0.0.0",
            port: parseInt(env.VITE_PORT),
            strictPort: true, // báo lỗi nếu port bị chiếm
            cors: true,
        },
    };
});
