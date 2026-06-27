"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadReceipts, mergeReceipts, saveReceipt } from "@/lib/receipt-storage";
import type { Receipt } from "@/types/receipt";

interface ReceiptsContextValue {
  receipts: Receipt[];
  loading: boolean;
  addReceipt: (receipt: Receipt) => Promise<void>;
  refresh: () => Promise<void>;
}

const ReceiptsContext = createContext<ReceiptsContextValue | null>(null);

export function ReceiptsProvider({ children }: { children: React.ReactNode }) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const local = loadReceipts();
    try {
      const res = await fetch("/api/receipts");
      if (res.ok) {
        const data = (await res.json()) as { receipts?: Receipt[] };
        setReceipts(mergeReceipts(local, data.receipts ?? []));
        return;
      }
    } catch {
      // Supabase not configured or offline — localStorage is enough
    }
    setReceipts(local);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const addReceipt = useCallback(
    async (receipt: Receipt) => {
      saveReceipt(receipt);
      setReceipts(loadReceipts());
      try {
        await fetch("/api/receipts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(receipt),
        });
      } catch {
        // local save already succeeded
      }
    },
    []
  );

  const value = useMemo(
    () => ({ receipts, loading, addReceipt, refresh }),
    [receipts, loading, addReceipt, refresh]
  );

  return (
    <ReceiptsContext.Provider value={value}>{children}</ReceiptsContext.Provider>
  );
}

export function useReceipts() {
  const ctx = useContext(ReceiptsContext);
  if (!ctx) {
    throw new Error("useReceipts must be used within ReceiptsProvider");
  }
  return ctx;
}
