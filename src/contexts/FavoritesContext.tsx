import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Get user ID from localStorage
  const userId = localStorage.getItem("userId");
  
  // Fetch favorites from API if user is logged in
  const { data: apiFavorites } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => {
      if (userId) {
        return userApi.getUserProfile(userId).then(res => res.data.favorites);
      }
      return [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Use API favorites if available, otherwise fall back to localStorage
  useEffect(() => {
    if (apiFavorites) {
      setFavorites(apiFavorites);
    } else {
      // Fallback to localStorage for non-logged in users
      const saved = localStorage.getItem("serveeny-favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  }, [apiFavorites]);
  
  // Mutation for adding/removing favorites
  const addToFavoritesMutation = useMutation({
    mutationFn: (providerId: string) => {
      if (userId) {
        return userApi.addToFavorites({ userId, providerId });
      }
      // Fallback for non-logged in users
      const currentFavorites = JSON.parse(localStorage.getItem("serveeny-favorites") || "[]");
      const newFavorites = [...currentFavorites, providerId];
      localStorage.setItem("serveeny-favorites", JSON.stringify(newFavorites));
      return Promise.resolve(newFavorites);
    },
    onSuccess: (response) => {
      setFavorites(response as string[]);
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });
  
  const removeFromFavoritesMutation = useMutation({
    mutationFn: (providerId: string) => {
      if (userId) {
        return userApi.removeFromFavorites({ userId, providerId });
      }
      // Fallback for non-logged in users
      const currentFavorites = JSON.parse(localStorage.getItem("serveeny-favorites") || "[]");
      const newFavorites = currentFavorites.filter((id: string) => id !== providerId);
      localStorage.setItem("serveeny-favorites", JSON.stringify(newFavorites));
      return Promise.resolve(newFavorites);
    },
    onSuccess: (response) => {
      setFavorites(response as string[]);
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });
  
  const toggleFavorite = async (id: string) => {
    if (favorites.includes(id)) {
      await removeFromFavoritesMutation.mutateAsync(id);
    } else {
      await addToFavoritesMutation.mutateAsync(id);
    }
  };
  
  const isFavorite = (id: string) => favorites.includes(id);
  
  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
