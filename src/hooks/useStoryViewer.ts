// @ts-nocheck
import { useState, useCallback, useRef } from "react";

export function useStoryViewer(stories: Story[]) {
  const [viewerState, setViewerState] = useState<StoryViewerState>({
    isOpen: false,
    currentIndex: 0,
    isLoading: false,
    autoAdvanceTimer: null,
  });
  
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());

  const openViewer = useCallback((index: number) => {
    setViewerState(prev => ({
      ...prev,
      isOpen: true,
      currentIndex: index,
      isLoading: true,
    }));
    
    // Simulate loading state
    setTimeout(() => {
      setViewerState(prev => ({ ...prev, isLoading: false }));
    }, 300);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerState(prev => ({
      ...prev,
      isOpen: false,
      currentIndex: 0,
      isLoading: false,
    }));
  }, []);

  const nextStory = useCallback(() => {
    if (viewerState.currentIndex < stories.length - 1) {
      setViewerState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        isLoading: true,
      }));
      
      setTimeout(() => {
        setViewerState(prev => ({ ...prev, isLoading: false }));
      }, 200);
    } else {
      closeViewer();
    }
  }, [viewerState.currentIndex, stories.length, closeViewer]);

  const previousStory = useCallback(() => {
    if (viewerState.currentIndex > 0) {
      setViewerState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        isLoading: true,
      }));
      
      setTimeout(() => {
        setViewerState(prev => ({ ...prev, isLoading: false }));
      }, 200);
    }
  }, [viewerState.currentIndex]);

  const markAsViewed = useCallback((index: number) => {
    setViewedStories(prev => new Set(prev).add(index));
  }, []);

  // Update stories with viewed status
  const storiesWithViewedStatus = stories.map((story, index) => ({
    ...story,
    viewed: viewedStories.has(index),
  }));

  return {
    viewerState,
    openViewer,
    closeViewer,
    nextStory,
    previousStory,
    markAsViewed,
    stories: storiesWithViewedStatus,
  };
}
