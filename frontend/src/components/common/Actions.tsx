import { FaPen } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";

interface ActionsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string; // cho phép custom style nếu cần
}

export default function Actions({
    onView,
    onEdit,
    onDelete,
    className = "",
}: ActionsProps) {
    return (
        <div className={`flex items-center ${className}`}>
            {onView && (
                <IoMdEye
                    className="mx-2 cursor-pointer hover:text-green-500"
                    onClick={onView}
                />
            )}
            {onEdit && (
                <FaPen
                    className="mx-2 cursor-pointer hover:text-blue-500"
                    onClick={onEdit}
                />
            )}
            {onDelete && (
                <FaTrashAlt
                    className="mx-2 cursor-pointer hover:text-red-500"
                    onClick={onDelete}
                />
            )}
        </div>
    );
}
