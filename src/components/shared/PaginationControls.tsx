/**
 * @module components/shared/PaginationControls
 * @description Компонент пагінації зі стрілками.
 */
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <button
            onClick={() => page > 1 && onPageChange(page - 1)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors ${page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
            aria-label="Попередня"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </PaginationItem>
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)} className="cursor-pointer">1</PaginationLink>
            </PaginationItem>
            {start > 2 && <PaginationItem><span className="px-2 text-muted-foreground">…</span></PaginationItem>}
          </>
        )}
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === page}
              onClick={() => onPageChange(p)}
              className="cursor-pointer"
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <PaginationItem><span className="px-2 text-muted-foreground">…</span></PaginationItem>}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)} className="cursor-pointer">{totalPages}</PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <button
            onClick={() => page < totalPages && onPageChange(page + 1)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors ${page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
            aria-label="Наступна"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
