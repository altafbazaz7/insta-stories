export interface Story {
  id: number;
  username: string;
  profileImage: string;
  storyImage: string;
  timestamp: string;
  viewed: boolean;
}

export interface StoryViewerState {
  isOpen: boolean;
  currentIndex: number;
  isLoading: boolean;
  autoAdvanceTimer: any | null;
}
