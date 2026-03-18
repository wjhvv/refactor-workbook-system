const tabBase =
  "px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap";

export const tabBarStyles = {
  container: "flex border-b border-gray-200 shrink-0",
  tab: `${tabBase} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`,
  tabActive: `${tabBase} border-accent text-accent`,
};

export interface TabItem {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function TabBar({ tabs, activeId, onSelect }: TabBarProps) {
  return (
    <div className={tabBarStyles.container}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={activeId === tab.id ? tabBarStyles.tabActive : tabBarStyles.tab}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
