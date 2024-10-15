import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Airport {
  id: string;
  name: string;
  plsUrl: string;
}

const airports: Airport[] = [
  {
    id: 'KJFK',
    name: 'John F. Kennedy International Airport',
    plsUrl: 'https://www.liveatc.net/hlisten.php?mount=kjfk_gnd&icao=kjfk',
  },
  {
    id: 'KLAX',
    name: 'Los Angeles International Airport',
    plsUrl: 'https://www.liveatc.net/hlisten.php?mount=klax4&icao=klax',
  },
  {
    id: 'EGLL',
    name: 'Tokyo International Airport',
    plsUrl: 'https://www.liveatc.net/hlisten.php?mount=rjtt_control&icao=rjtt',
  },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [youtubeVolume, setYoutubeVolume] = useState(50);
  const [atcVolume, setAtcVolume] = useState(50);
  const youtubePlayer = useRef<YT.Player | null>(null);
  const atcAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      youtubePlayer.current = new YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: 'jfKfPfyJRdk',
        playerVars: {
          autoplay: 0,
          controls: 1,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(youtubeVolume);
          },
        },
      });
    };

    return () => {
      // Clean up
      if (youtubePlayer.current) {
        youtubePlayer.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (atcAudio.current) {
      atcAudio.current.volume = atcVolume / 100;
    }
  }, [atcVolume]);

  const handlePlayPause = () => {
    if (isPlaying) {
      youtubePlayer.current?.pauseVideo();
      atcAudio.current?.pause();
    } else {
      youtubePlayer.current?.playVideo();
      playAtcAudio();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAirportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const airport = airports.find((a) => a.id === event.target.value);
    setSelectedAirport(airport || null);
  };

  const playAtcAudio = async () => {
    if (selectedAirport && atcAudio.current) {
      try {
        const response = await axios.get(selectedAirport.plsUrl);
        const audioUrl = extractAudioUrlFromPls(response.data);
        atcAudio.current.src = audioUrl;
        atcAudio.current.play();
      } catch (error) {
        console.error('Error loading ATC audio:', error);
      }
    }
  };

  const extractAudioUrlFromPls = (plsContent: string): string => {
    const lines = plsContent.split('\n');
    const fileLines = lines.filter((line) => line.startsWith('File1='));
    return fileLines.length > 0 ? fileLines[0].split('=')[1] : '';
  };

  return (
    <div className="App">
      <h1>Audio Player</h1>
      <div className="controls">
        <button onClick={handlePlayPause} className="play-button">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <select
          onChange={handleAirportChange}
          value={selectedAirport?.id || ''}
        >
          <option value="">Select an airport</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.id}>
              {airport.name}
            </option>
          ))}
        </select>
        <div className="volume-control">
          <label>YouTube Volume:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={youtubeVolume}
            onChange={(e) => {
              const volume = parseInt(e.target.value);
              setYoutubeVolume(volume);
              if (youtubePlayer.current) {
                youtubePlayer.current.setVolume(volume);
              }
            }}
          />
        </div>
        <div className="volume-control">
          <label>ATC Volume:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={atcVolume}
            onChange={(e) => setAtcVolume(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div id="youtube-player"></div>
      <audio ref={atcAudio} style={{ display: 'none' }} />
    </div>
  );
}

export default App;