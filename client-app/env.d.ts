interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // 👆 Thêm các biến khác nếu cần
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
