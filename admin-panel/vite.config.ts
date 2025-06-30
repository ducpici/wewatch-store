import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
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
    server: {
        https: {
            key: fs.readFileSync("./admin.wewatch.com-key.pem"),
            cert: fs.readFileSync("./admin.wewatch.com.pem"),
        },
        host: "admin.wewatch.com", // hoặc "shop.localhost"
        port: 5173, // hoặc 5174 nếu là trang shop
        strictPort: true, // báo lỗi nếu port bị chiếm
        cors: true,
    },
});
