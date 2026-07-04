interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, { className: string; label: string }> = {
  PENDING: { className: "badge-pending", label: "Pending" },
  PROCESSING: { className: "badge-processing", label: "Processing" },
  SHIPPED: { className: "badge-shipped", label: "Shipped" },
  DELIVERED: { className: "badge-delivered", label: "Delivered" },
  CANCELLED: { className: "badge-cancelled", label: "Cancelled" },
  FLAGGED: { className: "badge-flagged", label: "Flagged" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || {
    className: "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-50 text-stone-600 border border-stone-200/50",
    label: status,
  };

  return <span className={config.className}>{config.label}</span>;
}
