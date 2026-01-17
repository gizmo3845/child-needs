export interface Item {
  id: string;
  name: string;
}

export interface List {
  id: string;
  childName: string;
  items: string[]; // Array of item IDs
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  lists: List[];
  items: Item[];
}
