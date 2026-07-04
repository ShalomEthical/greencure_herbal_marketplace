import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, deliveryAgentId } = await req.json();

    const currentOrder = await db.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
    }
    if (deliveryAgentId !== undefined) {
      updateData.deliveryAgentId = deliveryAgentId;
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        items: { include: { product: true } },
        deliveryAgent: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
