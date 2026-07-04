import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const supplierId = searchParams.get("supplierId");
    const mine = searchParams.get("mine");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);
    const all = searchParams.get("all"); // bypass pagination

    const where: any = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (mine === "true") {
      const session = await auth();
      if (session?.user) {
        where.supplierId = (session.user as any).id;
      }
    } else if (supplierId) {
      where.supplierId = supplierId;
    }

    // If "all" is set, return all products (for admin/supplier dashboards)
    if (all === "true") {
      const products = await db.product.findMany({
        where,
        include: { supplier: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(products);
    }

    // Paginated response
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { supplier: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    const isApproved = (session.user as any).approved;

    if (role !== "SUPPLIER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (role === "SUPPLIER" && !isApproved) {
      return NextResponse.json(
        { error: "Supplier account is pending approval" },
        { status: 403 }
      );
    }

    const { name, description, price, image, category, stock } = await req.json();

    if (!name || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: "Missing required product fields" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        stock: stock ? parseInt(stock) : 10,
        supplierId: (session.user as any).id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
