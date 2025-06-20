import { type Story } from "../../types/story";

import { useState } from "react";

interface StoryThumbnailProps {
  story: Story;
  onClick: () => void;
}

export default function StoryThumbnail({ story, onClick }: StoryThumbnailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer story-thumbnail"
      onClick={onClick}
    >
      <div className={`p-1 rounded-full ${story.viewed ? 'story-viewed' : 'story-gradient'}`}>
        <div className="bg-background p-1 rounded-full">
          {imageError ? (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">!</span>
            </div>
          ) : (
            <img
              src={story.profileImage}
              alt={`${story.username} story`}
              className={`w-16 h-16 rounded-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${story.viewed ? 'opacity-60' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          {!imageLoaded && !imageError && (
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse"></div>
          )}
        </div>
      </div>
      <span className="text-xs text-foreground font-medium truncate max-w-[4rem]">
        {story.username}
      </span>
    </div>
  );
}
