// @ts-nocheck
import { useState, useEffect } from "react";
import { storiesData } from "../data/stories";

export function useStories() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stories, setStories] = useState<any>([]);


  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setStories(storiesData);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return {
    data: stories,
    isLoading,
    error
  };
}
