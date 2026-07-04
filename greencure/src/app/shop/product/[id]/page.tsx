import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      supplier: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding this product, limit to 3)
  const relatedProducts = await db.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 3,
  });

  return (
    <ProductDetailClient
      product={product}
      related={relatedProducts}
    />
  );
}