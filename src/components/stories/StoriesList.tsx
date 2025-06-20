import { type Story } from "../../types/story";

import StoryThumbnail from "./StoryThumbnail";

interface StoriesListProps {
  stories: Story[];
  isLoading: boolean;
  onStoryClick: (index: number) => void;
}

export default function StoriesList({ stories, isLoading, onStoryClick }: StoriesListProps) {
  if (isLoading) {
    return (
      <div className="bg-background border-b border-border p-4">
        <div className="story-list flex space-x-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-muted rounded-full animate-pulse"></div>
              <div className="w-12 h-3 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border-b border-border p-4">
      <div className="story-list flex space-x-4 overflow-x-auto pb-2">
        {stories.map((story, index) => (
          <StoryThumbnail
            key={story.id}
            story={story}
            onClick={() => onStoryClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
