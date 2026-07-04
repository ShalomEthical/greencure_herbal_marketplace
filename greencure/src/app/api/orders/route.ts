import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { address, phone, items } = await req.json();

    if (!address || !phone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Address, phone number and items are required" },
        { status: 400 }
      );
    }

    // Begin Transaction/Batch checks
    // Get all products to verify stock and price
    const productIds = items.map((i: any) => i.id);
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate stock and calculate total
    let calculatedTotal = 0;
    const itemsToCreate: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const dbProd = productMap.get(item.id);
      if (!dbProd) {
        return NextResponse.json(
          { error: `Product not found: ${item.name || item.id}` },
          { status: 404 }
        );
      }

      if (dbProd.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${dbProd.name}. Available: ${dbProd.stock}` },
          { status: 400 }
        );
      }

      calculatedTotal += dbProd.price * item.quantity;
      itemsToCreate.push({
        productId: dbProd.id,
        quantity: item.quantity,
        price: dbProd.price,
      });
    }

    // Update stock and create order in a transaction
    const order = await db.$transaction(async (tx) => {
      // 1. Deduct stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 2. Create order
      return await tx.order.create({
        data: {
          userId: (session.user as any).id,
          status: "PENDING",
          total: calculatedTotal,
          address,
          phone,
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let orders: any[] = [];

    if (role === "ADMIN") {
      orders = await db.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: true } },
          deliveryAgent: { select: { name: true, email: true } },
        },
      });
    } else if (role === "SUPPLIER") {
      // Return orders containing products supplied by this user
      orders = await db.order.findMany({
        where: {
          items: {
            some: {
              product: {
                supplierId: userId,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: {
            where: {
              product: {
                supplierId: userId,
              },
            },
            include: { product: true },
          },
          deliveryAgent: { select: { name: true, email: true } },
        },
      });
    } else if (role === "DELIVERY_AGENT") {
      // Return orders assigned to this agent, or unassigned pending/processing/shipped orders
      orders = await db.order.findMany({
        where: {
          OR: [
            { deliveryAgentId: userId },
            {
              deliveryAgentId: null,
              status: { in: ["PENDING", "PROCESSING"] },
            },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: true } },
        },
      });
    } else {
      // CUSTOMER
      orders = await db.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: true } },
          deliveryAgent: { select: { name: true, email: true } },
        },
      });
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
