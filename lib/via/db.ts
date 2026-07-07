import pool from "@/lib/db";
import { QueryResultRow } from "pg";

export async function queryVia<T extends QueryResultRow = any>(text: string, params?: unknown[]) {
  const result = await pool.query<T>(text, params);
  return result;
}

export default queryVia;
