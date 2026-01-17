"use client";

import { Item } from "@/types";

interface ItemSelectorProps {
  items: Item[];
  selectedItems: string[];
  onToggle: (itemId: string) => void;
}

export function ItemSelector({
  items,
  selectedItems,
  onToggle,
}: ItemSelectorProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Aucun élément disponible. Créez-en dans la gestion des éléments.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
      {items.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 text-left ${
              isSelected
                ? "bg-[#6B57FF]/20 border-[#6B57FF] text-white"
                : "bg-[#2a2a2a] border-[#3a3a3a] text-gray-300 hover:border-[#4a4a4a]"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  isSelected
                    ? "bg-[#6B57FF] border-[#6B57FF]"
                    : "border-[#4a4a4a]"
                }`}
              >
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
