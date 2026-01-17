import { NextRequest, NextResponse } from "next/server";
import { getAllItems, createItem, getItemUsageCount } from "@/lib/db";

export async function GET() {
  try {
    const items = getAllItems();
    const itemsWithUsage = items.map((item) => ({
      ...item,
      usageCount: getItemUsageCount(item.id),
    }));
    return NextResponse.json(itemsWithUsage);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des éléments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Le nom de l'élément est requis" },
        { status: 400 }
      );
    }

    const item = createItem(name.trim());
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'élément" },
      { status: 500 }
    );
  }
}
