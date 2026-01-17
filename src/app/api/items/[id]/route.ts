import { NextRequest, NextResponse } from "next/server";
import { updateItem, deleteItem, getItemById } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const item = getItemById(id);

    if (!item) {
      return NextResponse.json(
        { error: "Élément non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'élément" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Le nom de l'élément est requis" },
        { status: 400 }
      );
    }

    const item = updateItem(id, name.trim());

    if (!item) {
      return NextResponse.json(
        { error: "Élément non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'élément" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = deleteItem(id);

    if (!success) {
      return NextResponse.json(
        { error: "Élément non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'élément" },
      { status: 500 }
    );
  }
}
