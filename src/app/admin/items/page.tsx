"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Item } from "@/types";
import { Button } from "@/components/ui/Button";
import { ItemManager } from "@/components/ItemManager";

interface ItemWithUsage extends Item {
  usageCount: number;
}

export default function ItemsPage() {
  const [items, setItems] = useState<ItemWithUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Erreur lors du chargement des éléments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  const handleAdd = async (name: string) => {
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const newItem = await response.json();
      setItems((prev) => [...prev, { ...newItem, usageCount: 0 }]);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };

  const handleUpdate = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const updatedItem = await response.json();
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...updatedItem, usageCount: item.usageCount } : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Nounou</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Retour aux listes
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-white mb-6">
          Gestion des éléments
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Ces éléments peuvent être réutilisés dans toutes les listes.
        </p>

        <ItemManager
          items={items}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
