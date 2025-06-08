import { FaPen } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";

interface ActionsProps {
    onEditRole?: () => void;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string; // cho phép custom style nếu cần
}

export default function Actions({
    onEditRole,
    onView,
    onEdit,
    onDelete,
    className = "",
}: ActionsProps) {
    return (
        <div className={`flex items-center ${className}`}>
            {onEditRole && (
                <FaUserShield
                    className="mx-2 cursor-pointer hover:text-green-500 w-5 h-5"
                    onClick={onEditRole}
                />
            )}
            {onView && (
                <IoMdEye
                    className="mx-2 cursor-pointer hover:text-green-500 w-5 h-5"
                    onClick={onView}
                />
            )}
            {onEdit && (
                <FaPen
                    className="mx-2 cursor-pointer hover:text-blue-500 w-4 h-4"
                    onClick={onEdit}
                />
            )}
            {onDelete && (
                <FaTrashAlt
                    className="mx-2 cursor-pointer hover:text-red-500 w-4 h-4"
                    onClick={onDelete}
                />
            )}
        </div>
    );
}
