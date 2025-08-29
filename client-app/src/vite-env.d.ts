/// <reference types="vite/client" />
declare module "@tailwindcss/vite";
interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    // thêm biến env khác ở đây nếu cần
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
