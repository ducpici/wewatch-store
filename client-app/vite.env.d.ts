/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // khai báo thêm các biến môi trường khác ở đây nếu cần
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
