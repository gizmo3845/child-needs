import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { Database, List, Item } from "@/types";

// Use /app/data in production (Docker), otherwise use cwd/data
const DATA_DIR = process.env.NODE_ENV === "production"
  ? "/app/data"
  : join(process.cwd(), "data");
const DB_PATH = join(DATA_DIR, "db.json");

const defaultDb: Database = {
  lists: [],
  items: [
    { id: "item-1", name: "Biberon" },
    { id: "item-2", name: "Couches" },
    { id: "item-3", name: "Doudou" },
    { id: "item-4", name: "Tétine" },
    { id: "item-5", name: "Change de vêtements" },
  ],
};

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDb(): Database {
  ensureDataDir();
  if (!existsSync(DB_PATH)) {
    writeDb(defaultDb);
    return defaultDb;
  }
  const data = readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function writeDb(db: Database): void {
  ensureDataDir();
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Lists CRUD
export function getAllLists(): List[] {
  const db = readDb();
  return db.lists;
}

export function getListById(id: string): List | undefined {
  const db = readDb();
  return db.lists.find((list) => list.id === id);
}

export function createList(childName: string, items: string[] = []): List {
  const db = readDb();
  const now = new Date().toISOString();
  const newList: List = {
    id: generateId(),
    childName,
    items,
    createdAt: now,
    updatedAt: now,
  };
  db.lists.push(newList);
  writeDb(db);
  return newList;
}

export function updateList(
  id: string,
  updates: Partial<Pick<List, "childName" | "items">>
): List | null {
  const db = readDb();
  const index = db.lists.findIndex((list) => list.id === id);
  if (index === -1) return null;

  db.lists[index] = {
    ...db.lists[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  return db.lists[index];
}

export function deleteList(id: string): boolean {
  const db = readDb();
  const index = db.lists.findIndex((list) => list.id === id);
  if (index === -1) return false;

  db.lists.splice(index, 1);
  writeDb(db);
  return true;
}

// Items CRUD
export function getAllItems(): Item[] {
  const db = readDb();
  return db.items;
}

export function getItemById(id: string): Item | undefined {
  const db = readDb();
  return db.items.find((item) => item.id === id);
}

export function createItem(name: string): Item {
  const db = readDb();
  const newItem: Item = {
    id: `item-${generateId()}`,
    name,
  };
  db.items.push(newItem);
  writeDb(db);
  return newItem;
}

export function updateItem(id: string, name: string): Item | null {
  const db = readDb();
  const index = db.items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  db.items[index] = { ...db.items[index], name };
  writeDb(db);
  return db.items[index];
}

export function deleteItem(id: string): boolean {
  const db = readDb();
  const index = db.items.findIndex((item) => item.id === id);
  if (index === -1) return false;

  // Also remove this item from all lists
  db.lists = db.lists.map((list) => ({
    ...list,
    items: list.items.filter((itemId) => itemId !== id),
  }));

  db.items.splice(index, 1);
  writeDb(db);
  return true;
}

export function getItemUsageCount(itemId: string): number {
  const db = readDb();
  return db.lists.filter((list) => list.items.includes(itemId)).length;
}
