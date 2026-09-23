// ==========================================
// Tabs — simple tab switcher
// Parent controls the activeTab state
// ==========================================
export const Tabs = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div className={`border-b border-neutral-200 ${className}`}>
      <nav className="flex gap-1 -mb-px">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                px-4 py-2.5 text-sm font-medium
                border-b-2 transition-colors
                ${
                  isActive
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300"
                }
              `}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};