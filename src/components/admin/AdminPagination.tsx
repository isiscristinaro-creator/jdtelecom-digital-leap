import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const AdminPagination = ({ currentPage, totalPages, totalItems, perPage, onPageChange }: AdminPaginationProps) => {
  if (totalPages <= 1) return null;

  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * perPage + 1;
  const end = Math.min(safePage * perPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dark-section-border))]">
      <p className="text-xs text-[hsl(var(--dark-section-muted))]">
        {start}–{end} de {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(safePage - 1)} disabled={safePage === 1}
          className="p-1.5 rounded-lg text-[hsl(var(--dark-section-muted))] hover:bg-[hsl(var(--dark-section))]/50 disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPageNumbers().map((pg, i) =>
          pg === "..." ? (
            <span key={`e${i}`} className="px-2 text-xs text-[hsl(var(--dark-section-muted))]">…</span>
          ) : (
            <button key={pg} onClick={() => onPageChange(pg as number)}
              className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-all ${
                safePage === pg ? "bg-primary text-primary-foreground" : "text-[hsl(var(--dark-section-muted))] hover:bg-[hsl(var(--dark-section))]/50"
              }`}>{pg}</button>
          )
        )}
        <button onClick={() => onPageChange(safePage + 1)} disabled={safePage === totalPages}
          className="p-1.5 rounded-lg text-[hsl(var(--dark-section-muted))] hover:bg-[hsl(var(--dark-section))]/50 disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;