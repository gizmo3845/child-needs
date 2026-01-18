import { notFound } from "next/navigation";
import { getListById, getAllItems } from "@/lib/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ListPage({ params }: PageProps) {
  const { id } = await params;
  const list = getListById(id);

  if (!list) {
    notFound();
  }

  const allItems = getAllItems();
  const listItemsWithDetails = list.items
    .map((listItem) => {
      const item = allItems.find((i) => i.id === listItem.itemId);
      if (!item) return null;
      return { ...listItem, name: item.name };
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a]">
      <div className="max-w-lg mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#6B57FF] to-[#3B74EE] mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Liste de {list.childName}
          </h1>
          <p className="text-gray-400">
            {listItemsWithDetails.length} élément{listItemsWithDetails.length !== 1 ? "s" : ""} à
            apporter
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Mise à jour le {formatDate(list.updatedAt)}
          </p>
        </header>

        {listItemsWithDetails.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun élément dans cette liste.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {listItemsWithDetails.map((item) => (
              <li
                key={item!.itemId}
                className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#6B57FF] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#6B57FF]" />
                  </div>
                  <span className="text-white font-medium flex-1">
                    {item!.quantity > 1 && (
                      <span className="text-[#6B57FF] font-bold mr-2">
                        {item!.quantity}x
                      </span>
                    )}
                    {item!.name}
                  </span>
                </div>
                {item!.note && (
                  <p className="text-sm text-gray-400 mt-2 ml-10 italic">
                    {item!.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const list = getListById(id);

  if (!list) {
    return { title: "Liste non trouvée" };
  }

  return {
    title: `Liste de ${list.childName}`,
    description: `Éléments à apporter pour ${list.childName}`,
  };
}
