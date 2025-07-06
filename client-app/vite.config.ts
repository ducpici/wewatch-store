import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";
import svgr from "vite-plugin-svgr";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
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
        https: {
            key: fs.readFileSync("./shop.wewatch.com-key.pem"),
            cert: fs.readFileSync("./shop.wewatch.com.pem"),
        },
        host: "shop.wewatch.com", // hoặc "shop.localhost"
        port: 5174, // hoặc 5174 nếu là trang shop
        strictPort: true, // báo lỗi nếu port bị chiếm
        cors: true,
    },
    // postcss: [autoprefixer()],
});
