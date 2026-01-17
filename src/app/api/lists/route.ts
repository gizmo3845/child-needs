import { NextRequest, NextResponse } from "next/server";
import { getAllLists, createList } from "@/lib/db";

export async function GET() {
  try {
    const lists = getAllLists();
    return NextResponse.json(lists);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des listes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { childName, items } = await request.json();

    if (!childName || typeof childName !== "string") {
      return NextResponse.json(
        { error: "Le nom de l'enfant est requis" },
        { status: 400 }
      );
    }

    const list = createList(childName.trim(), items || []);
    return NextResponse.json(list, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de la liste" },
      { status: 500 }
    );
  }
}
