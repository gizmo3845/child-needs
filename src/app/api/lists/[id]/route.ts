import { NextRequest, NextResponse } from "next/server";
import { getListById, updateList, deleteList } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const list = getListById(id);

    if (!list) {
      return NextResponse.json(
        { error: "Liste non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la liste" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates: { childName?: string; items?: string[] } = {};

    if (body.childName !== undefined) {
      updates.childName = body.childName.trim();
    }
    if (body.items !== undefined) {
      updates.items = body.items;
    }

    const list = updateList(id, updates);

    if (!list) {
      return NextResponse.json(
        { error: "Liste non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la liste" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = deleteList(id);

    if (!success) {
      return NextResponse.json(
        { error: "Liste non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la liste" },
      { status: 500 }
    );
  }
}
