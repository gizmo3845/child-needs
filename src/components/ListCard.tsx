"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { List, Item } from "@/types";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

interface ListCardProps {
  list: List;
  items: Item[];
  onEdit: (list: List) => void;
  onDelete: (list: List) => void;
}

export function ListCard({ list, items, onEdit, onDelete }: ListCardProps) {
  const [showQrCode, setShowQrCode] = useState(false);

  const listItems = list.items
    .map((itemId) => items.find((i) => i.id === itemId))
    .filter(Boolean) as Item[];

  const getShareUrl = () => `${window.location.origin}/list/${list.id}`;

  const shareList = async () => {
    const url = getShareUrl();
    await navigator.clipboard.writeText(url);
    window.open(url, "_blank");
  };

  return (
    <>
      <Card variant="elevated">
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{list.childName}</h3>
              <p className="text-sm text-gray-400">
                {listItems.length} élément{listItems.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowQrCode(true)} title="QR Code">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4h4v4H4V4zm0 12h4v4H4v-4zm12-12h4v4h-4V4zm0 12h4v4h-4v-4zm-6-6h4v4h-4v-4zm-6 0h2v2H4v-2zm14 0h2v2h-2v-2zm-7-7h2v2h-2V5zm0 14h2v2h-2v-2z"
                  />
                </svg>
              </Button>
              <Button variant="ghost" size="sm" onClick={shareList} title="Partager">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(list)} title="Modifier">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(list)} title="Supprimer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {listItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listItems.map((item) => (
                <span
                  key={item.id}
                  className="px-2 py-1 text-xs bg-[#2a2a2a] text-gray-300 rounded-md"
                >
                  {item.name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showQrCode}
        onClose={() => setShowQrCode(false)}
        title={`QR Code - ${list.childName}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG value={getShareUrl()} size={200} />
          </div>
          <p className="text-sm text-gray-400 text-center">
            Scannez ce code pour accéder à la liste
          </p>
        </div>
      </Modal>
    </>
  );
}
