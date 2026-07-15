/** Recorta un arreglo ya filtrado a la página actual (uso en Server Components). */
export function paginate<T>(rows: T[], page: string | undefined, perPage = 10): T[] {
  const p = Math.max(1, Number(page ?? '1') || 1)
  return rows.slice((p - 1) * perPage, p * perPage)
}
