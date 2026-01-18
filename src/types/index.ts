export interface Item {
  id: string;
  name: string;
}

export interface ListItem {
  itemId: string;
  quantity: number;
  note: string;
}

export interface List {
  id: string;
  childName: string;
  items: ListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  lists: List[];
  items: Item[];
}
