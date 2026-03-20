"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AppCountsContextType = {
  favoriteCount: number;
  compareCount: number;
  refreshFavoriteCount: () => Promise<void>;
  refreshCompareCount: () => void;
  setCompareCountFromIds: (ids: number[]) => void;
};

const AppCountsContext = createContext<AppCountsContextType | undefined>(
  undefined
);

export function AppCountsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);

  const refreshFavoriteCount = useCallback(async () => {
    try {
      const resp = await fetch("/api/favoritos", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!resp.ok) {
        setFavoriteCount(0);
        return;
      }

      const data = await resp.json();
      setFavoriteCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setFavoriteCount(0);
    }
  }, []);

  const refreshCompareCount = useCallback(() => {
    try {
      const current = localStorage.getItem("compare_autos");
      const ids: number[] = current ? JSON.parse(current) : [];
      setCompareCount(ids.length);
    } catch {
      setCompareCount(0);
    }
  }, []);

  const setCompareCountFromIds = useCallback((ids: number[]) => {
    setCompareCount(ids.length);
  }, []);

  useEffect(() => {
    refreshFavoriteCount();
    refreshCompareCount();

    const onStorage = (event: StorageEvent) => {
      if (event.key === "compare_autos") {
        refreshCompareCount();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshFavoriteCount, refreshCompareCount]);

  const value = useMemo(
    () => ({
      favoriteCount,
      compareCount,
      refreshFavoriteCount,
      refreshCompareCount,
      setCompareCountFromIds,
    }),
    [
      favoriteCount,
      compareCount,
      refreshFavoriteCount,
      refreshCompareCount,
      setCompareCountFromIds,
    ]
  );

  return (
    <AppCountsContext.Provider value={value}>
      {children}
    </AppCountsContext.Provider>
  );
}

export function useAppCounts() {
  const context = useContext(AppCountsContext);

  if (!context) {
    throw new Error("useAppCounts debe usarse dentro de AppCountsProvider");
  }

  return context;
}