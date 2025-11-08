import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// function NextArrow(props: any) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={`${className} !flex !items-center !justify-center !bg-gray-800/60 hover:!bg-gray-900/80
//                   !w-10 !h-10 !rounded-full !absolute !top-1/2 !-translate-y-1/2 !right-2 !z-10 cursor-pointer`}
//       style={{ ...style }}
//       onClick={onClick}
//     >
//       <FaChevronRight className="text-white text-sm" />
//     </div>
//   );
// }

// function PrevArrow(props: any) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={`${className} !flex !items-center !justify-center !bg-gray-800/60 hover:!bg-gray-900/80
//                   !w-10 !h-10 !rounded-full !absolute !top-1/2 !-translate-y-1/2 !left-2 !z-10 cursor-pointer`}
//       style={{ ...style }}
//       onClick={onClick}
//     >
//       <FaChevronLeft className="text-white text-sm" />
//     </div>
//   );
// }
function NextArrow({ onClick }: any) {
  return (
    <div
      className="group flex items-center justify-center border-2 border-gray-400 hover:border-0 hover:bg-gray-900/80
                 w-8 h-8 rounded-full absolute top-1/2 -translate-y-1/2 right-2 z-8 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <FaChevronRight className="text-gray-400 group-hover:text-white text-sm transition-colors" />
    </div>
  );
}

function PrevArrow({ onClick }: any) {
  return (
    <div
      className="group flex items-center justify-center border-2 border-gray-400 hover:border-0 hover:bg-gray-900/80 
                 w-8 h-8 rounded-full absolute top-1/2 -translate-y-1/2 left-2 z-8 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <FaChevronLeft className="text-gray-400 group-hover:text-white text-sm transition-colors" />
    </div>
  );
}

export { NextArrow, PrevArrow };
