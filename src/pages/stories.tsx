import StoriesList from "../components/stories/StoriesList";
import StoryViewer from "../components/stories/StoryViewer";
import { useStories } from "../hooks/useStories";
import { useStoryViewer } from "../hooks/useStoryViewer";

export default function Stories() {
  const { data: stories, isLoading, error } = useStories();
  const {
    viewerState,
    openViewer,
    closeViewer,
    nextStory,
    previousStory,
    markAsViewed
  } = useStoryViewer(stories || []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Failed to load stories
          </h2>
          <p className="text-muted-foreground">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMKf3kfBtWETtA4_SbBXJqmCH830YAL0iWHw&s" className="w-[150px] m-[12px]"/>
        <StoriesList 
          stories={stories || []}
          isLoading={isLoading}
          onStoryClick={openViewer}
        />
        {viewerState.isOpen && stories && (
          <StoryViewer
            stories={stories}
            currentIndex={viewerState.currentIndex}
            isLoading={viewerState.isLoading}
            onClose={closeViewer}
            onNext={nextStory}
            onPrevious={previousStory}
            onMarkViewed={markAsViewed}
          />
        )}
      </div>
    </div>
  );
}
