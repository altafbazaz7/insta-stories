import { useEffect, useState, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { type Story } from "../../types/story";

interface StoryViewerProps {
  stories: Story[];
  currentIndex: number;
  isLoading: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onMarkViewed: (index: number) => void;
}

export default function StoryViewer({
  stories,
  currentIndex,
  isLoading,
  onClose,
  onNext,
  onPrevious,
  onMarkViewed
}: StoryViewerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds

  const resetProgress = useCallback(() => {
    setProgress(0);
    progressRef.current = 0;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const startProgress = useCallback(() => {
    startTimeRef.current = Date.now();
    const animate = () => {
      if (!startTimeRef.current) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      
      setProgress(newProgress);
      progressRef.current = newProgress;
      
      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onNext();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [onNext]);

  const pauseProgress = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const resumeProgress = useCallback(() => {
    if (progressRef.current < 100) {
      const remainingTime = STORY_DURATION * (1 - progressRef.current / 100);
      startTimeRef.current = Date.now() - (STORY_DURATION - remainingTime);
      
      const animate = () => {
        if (!startTimeRef.current) return;
        
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
        
        setProgress(newProgress);
        progressRef.current = newProgress;
        
        if (newProgress < 100) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          onNext();
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [onNext]);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    resetProgress();
  }, [currentIndex, resetProgress]);

  useEffect(() => {
    if (imageLoaded && !isLoading) {
      startProgress();
      onMarkViewed(currentIndex);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imageLoaded, isLoading, startProgress, onMarkViewed, currentIndex]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          onNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onNext, onPrevious, onClose]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    pauseProgress();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        onNext(); // Swipe left
      } else {
        onPrevious(); // Swipe right
      }
    } else {
      resumeProgress();
    }
    
    setTouchStart(null);
  };

  const handleLeftClick = () => {
    onPrevious();
  };

  const handleRightClick = () => {
    onNext();
  };

  useEffect(() => {
    const viewer = document.getElementById('story-viewer');
    if (!viewer) return;

    viewer.addEventListener('touchstart', handleTouchStart as any);
    viewer.addEventListener('touchend', handleTouchEnd as any);

    return () => {
      viewer.removeEventListener('touchstart', handleTouchStart as any);
      viewer.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [touchStart]);

  if (!currentStory) return null;

  return (
    <div 
      id="story-viewer"
      className="fixed inset-0 bg-black z-50 animate-fade-in"
    >
      {/* Progress Indicators */}
      <div className="absolute top-4 left-4 right-4 z-10 flex space-x-1">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 progress-bar">
            <div 
              className={`progress-fill ${
                index < currentIndex ? 'w-full' : 
                index === currentIndex ? '' : 'w-0'
              }`}
              style={{
                width: index === currentIndex ? `${progress}%` : 
                       index < currentIndex ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Header */}
      <div className="absolute top-16 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
            <img
              src={currentStory.profileImage}
              alt={currentStory.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <p className="text-sm font-semibold">{currentStory.username}</p>
            <p className="text-xs opacity-70">{currentStory.timestamp}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Story Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Loading State */}
        {(isLoading || !imageLoaded) && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        )}

        {/* Error State */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 opacity-50">
                <X className="w-full h-full" />
              </div>
              <p className="text-sm opacity-70">Story unavailable</p>
              <button 
                onClick={() => {
                  setImageError(false);
                  setImageLoaded(false);
                }}
                className="mt-2 text-blue-400 text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Story Image */}
        {!imageError && (
          <img
            src={currentStory.storyImage}
            alt="Story content"
            className={`w-full h-full object-cover animate-slide-in transition-all duration-300 ${
              imageLoaded ? 'loaded' : 'loading-blur'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      {/* Navigation Areas */}
      <div className="absolute inset-0 flex">
        <div 
          className="w-1/2 h-full cursor-pointer" 
          onClick={handleLeftClick}
        />
        <div 
          className="w-1/2 h-full cursor-pointer" 
          onClick={handleRightClick}
        />
      </div>
    </div>
  );
}
