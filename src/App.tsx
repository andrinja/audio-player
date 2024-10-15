import React, {useState, useRef, useEffect} from 'react';
import YouTube from 'react-youtube';
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
		plsUrl: 'http://d.liveatc.net/kjfk_arinc',
	},
	{
		id: 'KLAX',
		name: 'Los Angeles International Airport',
		plsUrl: 'http://d.liveatc.net/kpoc2_klax_app_east_feeder',
	},
	{
		id: 'EGLL',
		name: 'Tokyo International Airport',
		plsUrl: 'http://d.liveatc.net/rjtt_app_dep',
	},
];

function App() {
	const [isPlaying, setIsPlaying] = useState(false);
	const [selectedAirport, setSelectedAirport] = useState<Airport | undefined>(airports[0]);
	const [youtubeVolume, setYoutubeVolume] = useState(50);
	const [atcVolume, setAtcVolume] = useState(50);
	const youtubePlayer = useRef<any>(null);
	const atcAudio = useRef<HTMLAudioElement | null>(null);

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
			if (selectedAirport) {
				playAtcAudio(selectedAirport);
			}
		}
		setIsPlaying(!isPlaying);
	};

	const handleAirportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const airport = airports.find((a) => a.id === event.target.value);
		console.log('Selected airport:', airport);
		setSelectedAirport(airport);
		playAtcAudio(airport);
	};

	const playAtcAudio = async (airport: Airport | undefined) => {
		if (airport && atcAudio.current) {
			atcAudio.current.pause(); // Pause any currently playing audio
			atcAudio.current.src = airport.plsUrl;
			console.log('Playing audio for airport:', airport);
			if (isPlaying) {
				try {
					await atcAudio.current.play();
				} catch (error) {
					console.error('Error playing ATC audio:', error);
				}
			}
		}
	};

	const onReady = (event: {target: any}) => {
		//event.target.pauseVideo();
		youtubePlayer.current = event.target;
	};

	return (
		<div className='App'>
			<h1>Audio Player</h1>
			<div className='controls'>
				<button onClick={handlePlayPause} className='play-button'>
					{isPlaying ? 'Pause' : 'Play'}
				</button>
				<select onChange={handleAirportChange} value={selectedAirport?.id || ''}>
					<option value='' disabled>
						Select an airport
					</option>
					{airports.map((airport) => (
						<option key={airport.id} value={airport.id}>
							{airport.name}
						</option>
					))}
				</select>
				<div className='volume-control'>
					<label>YouTube Volume:</label>
					<input
						type='range'
						min='0'
						max='100'
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
				<div className='volume-control'>
					<label>ATC Volume:</label>
					<input
						type='range'
						min='0'
						max='100'
						value={atcVolume}
						onChange={(e) => setAtcVolume(parseInt(e.target.value))}
					/>
				</div>
			</div>
			<div style={{display: 'none'}}>
				<YouTube
					videoId='jfKfPfyJRdk'
					opts={{
						playerVars: {
							autoplay: 1,
						},
					}}
					onReady={onReady}
				/>
			</div>

			<audio ref={atcAudio} />
		</div>
	);
}

export default App;
