interface InputProps {
    type?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    type = "text",
    placeholder,
    onKeyDown,
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]`}
            onKeyDown={onKeyDown}
        />
    );
};

export default Input;
