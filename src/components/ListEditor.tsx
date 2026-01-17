"use client";

import { useState, useEffect } from "react";
import { List, Item } from "@/types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { ItemSelector } from "./ItemSelector";

interface ListEditorProps {
  list?: List;
  items: Item[];
  onSave: (childName: string, selectedItems: string[]) => void;
  onCancel: () => void;
}

export function ListEditor({ list, items, onSave, onCancel }: ListEditorProps) {
  const [childName, setChildName] = useState(list?.childName || "");
  const [selectedItems, setSelectedItems] = useState<string[]>(
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
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

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
        <ItemSelector
          items={items}
          selectedItems={selectedItems}
          onToggle={toggleItem}
        />
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
