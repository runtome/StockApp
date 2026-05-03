"use client";
import { useEffect, useState } from "react";

const KEY = "thai-stock-watchlist";

export function useWatchlist() {
  const [symbols, setSymbols] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(stored)) setSymbols(stored);
    } catch {}
  }, []);

  const save = (next: string[]) => {
    setSymbols(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const add = (sym: string) => {
    if (!symbols.includes(sym)) save([...symbols, sym]);
  };

  const remove = (sym: string) => save(symbols.filter((s) => s !== sym));

  const toggle = (sym: string) => (symbols.includes(sym) ? remove(sym) : add(sym));

  return { symbols, add, remove, toggle, isWatching: (sym: string) => symbols.includes(sym) };
}
