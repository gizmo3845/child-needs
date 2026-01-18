"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { List, Item } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ListCard } from "@/components/ListCard";
import { ListEditor } from "@/components/ListEditor";

export default function AdminPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<List | undefined>(undefined);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const [listsRes, itemsRes] = await Promise.all([
        fetch("/api/lists"),
        fetch("/api/items"),
      ]);
      const listsData = await listsRes.json();
      const itemsData = await itemsRes.json();
      setLists(listsData);
      setItems(itemsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  const handleCreate = () => {
    setEditingList(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (list: List) => {
    setEditingList(list);
    setIsModalOpen(true);
  };

  const handleDelete = async (list: List) => {
    if (!confirm(`Supprimer la liste de ${list.childName} ?`)) return;

    try {
      await fetch(`/api/lists/${list.id}`, { method: "DELETE" });
      setLists((prev) => prev.filter((l) => l.id !== list.id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleSave = async (childName: string, selectedItems: string[]) => {
    try {
      if (editingList) {
        const response = await fetch(`/api/lists/${editingList.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childName, items: selectedItems }),
        });
        const updatedList = await response.json();
        setLists((prev) =>
          prev.map((l) => (l.id === editingList.id ? updatedList : l))
        );
      } else {
        const response = await fetch("/api/lists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childName, items: selectedItems }),
        });
        const newList = await response.json();
        setLists((prev) => [...prev, newList]);
      }
      setIsModalOpen(false);
      setEditingList(undefined);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
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
              href="/admin/items"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Gérer les éléments
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            Listes ({lists.length})
          </h2>
          <Button onClick={handleCreate}>Nouvelle liste</Button>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Aucune liste pour le moment.</p>
            <Button onClick={handleCreate}>Créer une liste</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                items={items}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingList(undefined);
        }}
        title={editingList ? "Modifier la liste" : "Nouvelle liste"}
      >
        <ListEditor
          list={editingList}
          items={items}
          onSave={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingList(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
