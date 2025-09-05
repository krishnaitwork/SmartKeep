import React from "react";
import {
  Moon,
  Sun,
  Download,
  Upload,
  Archive,
  ArchiveRestore,
  Search,
  Plus,
  Settings,
} from "lucide-react";

const Header = ({
  darkMode,
  onToggleTheme,
  onExport,
  onImport,
  showArchived,
  onToggleArchived,
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onCreateNote,
  onOpenConfig,
}) => {
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
      event.target.value = ""; // Reset input
    }
  };

  return (
    <header className="bg-card px-4 py-3 border-b border-border flex flex-col md:flex-row items-center justify-between gap-3 md:gap-5 w-full box-border">
      <h1 className="text-primary text-[2.2rem] leading-none font-semibold tracking-tight flex-shrink-0">
        📒 SmartKeep
      </h1>

      <div className="flex-1 flex justify-center w-full max-w-[860px]">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center w-full">
          <div className="relative flex-1 max-w-full sm:max-w-60">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              style={{
                width: "18px",
                height: "18px",
                color: "var(--muted-foreground)",
              }}
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-input rounded-full bg-background text-foreground text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm outline-none cursor-pointer min-w-[140px] w-full sm:w-auto focus:border-primary"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={onCreateNote}
            className="bg-primary text-primary-foreground w-9 h-9 border-none rounded-full cursor-pointer flex items-center justify-center transition-all flex-shrink-0 shadow-md hover:bg-primary/90 active:scale-95"
            title="Create Note"
          >
            <Plus
              size={20}
              style={{
                width: "20px",
                height: "20px",
                color: "var(--primary-foreground)",
              }}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="bg-transparent border-none cursor-pointer w-9 h-9 rounded-full flex items-center justify-center text-foreground transition-colors flex-shrink-0 hover:bg-accent"
          onClick={onOpenConfig}
          title="Sensitive Content Settings"
        >
          <Settings
            size={20}
            style={{
              width: "20px",
              height: "20px",
              color: "var(--foreground)",
            }}
          />
        </button>

        <button
          className="bg-transparent border-none cursor-pointer w-9 h-9 rounded-full flex items-center justify-center text-foreground transition-colors flex-shrink-0 hover:bg-accent"
          onClick={onExport}
          title="Export Notes"
        >
          <Download
            size={20}
            style={{
              width: "20px",
              height: "20px",
              color: "var(--foreground)",
            }}
          />
        </button>

        <label
          className="bg-transparent border-none cursor-pointer w-9 h-9 rounded-full flex items-center justify-center text-foreground transition-colors flex-shrink-0 hover:bg-accent"
          title="Import Notes"
        >
          <Upload
            size={20}
            style={{
              width: "20px",
              height: "20px",
              color: "var(--foreground)",
            }}
          />
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </label>

        <button
          className={`bg-transparent border-none cursor-pointer w-9 h-9 rounded-full flex items-center justify-center text-foreground transition-colors flex-shrink-0 hover:bg-accent ${
            showArchived ? "bg-primary text-primary-foreground" : ""
          }`}
          onClick={onToggleArchived}
          title={showArchived ? "Show Active Notes" : "Show Archived Notes"}
        >
          {showArchived ? (
            <ArchiveRestore
              size={20}
              style={{
                width: "20px",
                height: "20px",
                color: "var(--primary-foreground)",
              }}
            />
          ) : (
            <Archive
              size={20}
              style={{
                width: "20px",
                height: "20px",
                color: "var(--foreground)",
              }}
            />
          )}
        </button>

        <div
          className={`relative w-11 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors ${
            darkMode ? "bg-primary" : ""
          }`}
          onClick={onToggleTheme}
          title="Toggle Theme"
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
              darkMode ? "translate-x-5" : ""
            }`}
          >
            {darkMode ? (
              <Moon
                size={12}
                style={{
                  width: "12px",
                  height: "12px",
                  color: "var(--primary)",
                }}
              />
            ) : (
              <Sun
                size={12}
                style={{
                  width: "12px",
                  height: "12px",
                  color: "var(--primary)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
