const buttonBase =
  "px-3 py-1 text-sm rounded-lg cursor-pointer active:scale-95 transition-transform";

export const cardStyles = {
  base: "bg-white border border-gray-200 rounded-xl shadow-md w-96 overflow-hidden",
  header: "flex items-center justify-between px-5 pt-5 pb-3",
  headerTitle: "text-base font-semibold text-gray-800",
  body: "px-5 pb-4",
  message: "text-sm text-gray-500 leading-relaxed text-left",
  footer:
    "flex items-center justify-between px-5 py-2 border-t border-gray-100 mt-1",
  footerEnd:
    "flex items-center justify-end px-5 py-2 border-t border-gray-100 mt-1",
  closeButton: `${buttonBase} text-white bg-accent hover:opacity-90`,
  cancelButton: `${buttonBase} text-gray-600 bg-white border border-gray-300 hover:bg-gray-50`,
  confirmButton: `${buttonBase} text-white bg-[#f01d3c] hover:bg-[#d01835]`,
};
