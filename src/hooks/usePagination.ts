/**
 * @module hooks/usePagination
 * @description Хук пагінації для списків.
 */
import { useMemo, useState } from "react";

interface UsePaginationOptions {
  pageSize?: number;
}

export function usePagination<T>(items: T[], { pageSize = 6 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  const resetPage = () => setPage(1);

  return { items: paginatedItems, page: safePage, totalPages, goToPage, resetPage, total: items.length };
}
