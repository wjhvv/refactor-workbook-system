const navItemBase = "flex items-center gap-2 px-3 py-1.5 rounded-md text-base font-medium cursor-pointer";

export const navStyles = {
  base: "shrink-0 bg-accent text-white flex items-center gap-6 px-6 h-16",
  brand: "flex items-center gap-3",
  logoImage: "h-8 object-contain",
  title: "text-sm font-semibold tracking-wide whitespace-nowrap",
  items: "flex items-center gap-1 flex-1",
  item: `${navItemBase} transition-colors text-white/80 hover:bg-white/10 hover:text-white`,
  itemActive: `${navItemBase} bg-white/20 text-white`,
};
