import React, { useState } from "react";
import {
  Pin,
  Archive,
  ArchiveRestore,
  Trash2,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  hasSensitiveContent,
  maskSensitiveContent,
} from "../config/sensitiveConfig";

const NoteCard = ({ note, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: "#1a73e8",
      Personal: "#e67c73",
      Home: "#34a853",
      Finance: "#fbbc04",
    };

    // Generate color based on category name hash for custom categories
    if (!colors[category]) {
      let hash = 0;
      for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
      }
      const palette = [
        "#1a73e8",
        "#e67c73",
        "#fbbc04",
        "#34a853",
        "#a142f4",
        "#ff7043",
      ];
      return palette[Math.abs(hash) % palette.length];
    }

    return colors[category];
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      const textToCopy = note.title
        ? `${note.title}\n\n${note.content}`
        : note.content;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1200);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    action();
  };

  const renderContent = () => {
    let content = note.content;

    // Check if content has sensitive information using the config
    const isSensitive = hasSensitiveContent(content);

    if (isSensitive && !showPassword) {
      // Use the config-based masking system
      content = maskSensitiveContent(content);
    }

    // Convert URLs to clickable links
    content = content.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: underline;">$1</a>'
    );

    return content;
  };

  // Ensure this is a real boolean; numeric 0 was being rendered when using `hasPassword && (...)`
  const hasPassword = hasSensitiveContent(note.content) || !!note.is_password;

  return (
    <div
      className={`group bg-card rounded-xl p-3 shadow-sm border transition-all cursor-pointer min-h-[150px] flex flex-col relative hover:border-primary hover:shadow-md ${
        note.pinned ? "border-yellow-400" : "border-border"
      }`}
      onClick={() => onEdit(note)}
    >
      {/* Top row with title and category */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="font-semibold text-lg text-primary line-clamp-2 flex-1 pr-2">
          {note.title || "(No Title)"}
        </div>
        <span
          className="text-white px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
          style={{ backgroundColor: getCategoryColor(note.category) }}
        >
          {note.category}
        </span>
      </div>

      {/* Content area */}
      <div
        className="flex-1 text-sm leading-relaxed whitespace-pre-wrap break-words mb-2 max-h-[120px] overflow-hidden"
        dangerouslySetInnerHTML={{ __html: renderContent() }}
      />

      {/* Password toggle button */}
      {hasPassword && (
        <button
          className="absolute top-3 right-16 bg-transparent border-none cursor-pointer p-1 rounded text-foreground transition-colors hover:bg-accent opacity-100 z-10"
          onClick={(e) => {
            e.stopPropagation();
            setShowPassword(!showPassword);
          }}
          title={showPassword ? "Hide Password" : "Show Password"}
        >
          {showPassword ? (
            <EyeOff
              size={16}
              style={{
                width: "16px",
                height: "16px",
                color: "var(--foreground)",
              }}
            />
          ) : (
            <Eye
              size={16}
              style={{
                width: "16px",
                height: "16px",
                color: "var(--foreground)",
              }}
            />
          )}
        </button>
      )}

      {/* Bottom row with date and action icons */}
      <div className="flex justify-between items-center gap-2 mt-auto pt-1">
        <span className="text-[15px] text-muted-foreground flex-shrink-0 tracking-tight">
          {formatDate(note.LastModifiedDate)}
        </span>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-0.5">
          <button
            className={`bg-transparent border-none cursor-pointer p-1 rounded-full transition-all hover:bg-accent hover:scale-105 ${
              note.pinned ? "text-yellow-500" : "text-foreground"
            }`}
            onClick={(e) => handleAction(e, () => onTogglePin(note.id))}
            title={note.pinned ? "Unpin" : "Pin"}
          >
            <Pin
              size={14}
              style={{
                width: "14px",
                height: "14px",
                color: note.pinned ? "#eab308" : "var(--foreground)",
              }}
            />
          </button>

          <button
            className="bg-transparent border-none cursor-pointer p-1 rounded-full text-foreground transition-all hover:bg-accent hover:scale-105"
            onClick={handleCopy}
            title="Copy Note"
            style={{ color: copySuccess ? "#22c55e" : "var(--foreground)" }}
          >
            <Copy
              size={14}
              style={{
                width: "14px",
                height: "14px",
                color: copySuccess ? "#22c55e" : "var(--foreground)",
              }}
            />
          </button>

          <button
            className="bg-transparent border-none cursor-pointer p-1 rounded-full text-foreground transition-all hover:bg-accent hover:scale-105"
            onClick={(e) => handleAction(e, () => onToggleArchive(note.id))}
            title={note.archived ? "Unarchive" : "Archive"}
          >
            {note.archived ? (
              <ArchiveRestore
                size={14}
                style={{
                  width: "14px",
                  height: "14px",
                  color: "var(--foreground)",
                }}
              />
            ) : (
              <Archive
                size={14}
                style={{
                  width: "14px",
                  height: "14px",
                  color: "var(--foreground)",
                }}
              />
            )}
          </button>

          <button
            className="bg-transparent border-none cursor-pointer p-1 rounded-full text-red-500 transition-all hover:bg-accent hover:scale-105"
            onClick={(e) => handleAction(e, () => onDelete(note))}
            title="Delete"
          >
            <Trash2
              size={14}
              style={{ width: "14px", height: "14px", color: "#ef4444" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
