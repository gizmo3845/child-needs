"use client";

import { useState, useEffect } from "react";
import { List, Item, ListItem } from "@/types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface ListEditorProps {
  list?: List;
  items: Item[];
  onSave: (childName: string, selectedItems: ListItem[]) => void;
  onCancel: () => void;
}

export function ListEditor({ list, items, onSave, onCancel }: ListEditorProps) {
  const [childName, setChildName] = useState(list?.childName || "");
  const [selectedItems, setSelectedItems] = useState<ListItem[]>(
    list?.items || []
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setChildName(list?.childName || "");
    setSelectedItems(list?.items || []);
  }, [list]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      setError("Le nom de l'enfant est requis");
      return;
    }
    onSave(childName.trim(), selectedItems);
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.itemId === itemId);
      if (exists) {
        return prev.filter((i) => i.itemId !== itemId);
      }
      return [...prev, { itemId, quantity: 1, note: "" }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  };

  const updateNote = (itemId: string, note: string) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, note } : i))
    );
  };

  const isSelected = (itemId: string) =>
    selectedItems.some((i) => i.itemId === itemId);

  const getListItem = (itemId: string) =>
    selectedItems.find((i) => i.itemId === itemId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nom de l'enfant"
        value={childName}
        onChange={(e) => {
          setChildName(e.target.value);
          setError("");
        }}
        placeholder="Ex: Lucas"
        error={error}
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Éléments à apporter
        </label>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {items.map((item) => {
            const selected = isSelected(item.id);
            const listItem = getListItem(item.id);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg border transition-all ${
                  selected
                    ? "bg-[#6B57FF]/10 border-[#6B57FF]"
                    : "bg-[#2a2a2a] border-[#3a3a3a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                      selected
                        ? "bg-[#6B57FF] border-[#6B57FF]"
                        : "border-[#4a4a4a]"
                    }`}
                  >
                    {selected && (
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
                  </button>
                  <span
                    className={`flex-1 ${
                      selected ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {item.name}
                  </span>
                  {selected && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400">Qté:</label>
                      <select
                        value={listItem?.quantity || 1}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="w-16 px-2 py-1 text-sm bg-[#1a1a1a] border border-[#3a3a3a] rounded text-white text-center appearance-none"
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {selected && (
                  <div className="mt-2 pl-8">
                    <input
                      type="text"
                      value={listItem?.note || ""}
                      onChange={(e) => updateNote(item.id, e.target.value)}
                      placeholder="Note (optionnel)..."
                      className="w-full px-3 py-1.5 text-sm bg-[#1a1a1a] border border-[#3a3a3a] rounded text-white placeholder-gray-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {list ? "Mettre à jour" : "Créer la liste"}
        </Button>
      </div>
    </form>
  );
}
