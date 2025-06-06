import { Link } from "react-router";

export interface BreadcrumbItem {
    label: string;
    path?: string; // Nếu không có path thì không phải là Link
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {items[items.length - 1]?.label || ""}
            </h2>
            <nav>
                <ol className="flex items-center gap-1.5">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                        >
                            {item.path ? (
                                <Link
                                    to={item.path}
                                    className="inline-flex items-center gap-1.5"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span>{item.label}</span>
                            )}
                            {index < items.length - 1 && (
                                <svg
                                    className="stroke-current"
                                    width="17"
                                    height="16"
                                    viewBox="0 0 17 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                                        stroke=""
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default PageBreadcrumb;
