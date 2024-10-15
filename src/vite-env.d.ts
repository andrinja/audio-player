/// <reference types="vite/client" />

interface Window {
  onYouTubeIframeAPIReady: () => void;
}

declare namespace YT {
  class Player {
    constructor(elementId: string, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    setVolume(volume: number): void;
    destroy(): void;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: Events;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    [key: string]: any;
  }

  interface Events {
    onReady?: (event: { target: Player }) => void;
    [key: string]: any;
  }
}