import {useState, useRef, useEffect} from 'react';
import YouTube from 'react-youtube';
import './App.css';
import DropDown from './components/DropDown';
import {SelectItem} from '@/components/ui/select';
import PlayButton from './components/PlayButton';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, EffectFade} from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface Airport {
	id: string;
	name: string;
	plsUrl: string;
	city: string;
}

const airports: Airport[] = [
	{
		id: 'VHHH',
		name: 'Hong Kong Airport',
		plsUrl: 'http://d.liveatc.net/vhhh5',
		city: 'Hong Kong',
	},
	{
		id: '	LSZH',
		name: 'Zurich Airport',
		plsUrl: 'http://d.liveatc.net/lszh1_app_east',
		city: 'Zurich',
	},
	{
		id: 'EGLL',
		name: 'Tokyo Airport',
		plsUrl: 'http://d.liveatc.net/rjtt_app_dep',
		city: 'Tokyo',
	},
];

function App() {
	const [isPlaying, setIsPlaying] = useState(false);
	const [selectedAirport, setSelectedAirport] = useState<Airport | undefined>(airports[0]);
	const [airportImages, setAirportImages] = useState<string[]>([]);
	const [youtubeVolume, setYoutubeVolume] = useState(50);
	const [atcVolume, setAtcVolume] = useState(50);
	const youtubePlayer = useRef<any>(null);
	const atcAudio = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (selectedAirport) {
			fetchPexelsImages(selectedAirport.city);
		}
	}, [selectedAirport]);

	useEffect(() => {
		if (atcAudio.current) {
			atcAudio.current.volume = atcVolume / 100;
		}
	}, [atcVolume]);

	console.log('Pexels API Key:', import.meta.env.VITE_PEXELS_API_KEY);

	const fetchPexelsImages = async (city: string) => {
		try {
			const params = new URLSearchParams({
				query: city,
				per_page: '3',
			}).toString();
			const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
				headers: {
					Authorization: import.meta.env.VITE_PEXELS_API_KEY,
				},
			});
			const data = await response.json();
			console.log(data);
			const images = data.photos.map((photo: any) => photo.src.large);
			console.log(response);
			setAirportImages(images);
		} catch (error) {
			console.error('Error fetching images from Pexels:', error);
		}
	};

	useEffect(() => {
		fetchPexelsImages(airports[0].city);
	}, []);

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

	const handleAirportChange = (value: string) => {
		const airport = airports.find((a) => a.id === value);
		if (airport) {
			console.log('Selected airport:', airport);
			setSelectedAirport(airport);
			playAtcAudio(airport);
			fetchPexelsImages(airport.city);
		} else {
			console.error('Airport not found!');
		}
	};

	const playAtcAudio = async (airport: Airport | undefined) => {
		if (airport && atcAudio.current) {
			//atcAudio.current.pause(); // Pause any currently playing audio
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
		youtubePlayer.current = event.target;
	};

	return (
		<div className='relative h-screen w-screen overflow-hidden dark'>
			<Swiper
				spaceBetween={0}
				slidesPerView={1}
				effect='fade'
				autoplay={{delay: 3000}}
				modules={[Autoplay, EffectFade]}
				className='absolute top-0 left-0 h-full w-full z-0'
			>
				{airportImages.map((image, index) => (
					<SwiperSlide key={index}>
						<img
							src={image}
							alt={`Airport image ${index + 1}`}
							className='object-cover h-full w-full'
						/>
					</SwiperSlide>
				))}
			</Swiper>
			<div className='absolute top-0 left-0 w-full h-full bg-black opacity-70 z-5'></div>
			<div className='relative text-white z-10 flex flex-col items-center justify-center h-full'>
				<div className='flex-grow flex justify-center items-center'>
					<PlayButton onClick={handlePlayPause} isPlaying={isPlaying} />
					<DropDown onChange={handleAirportChange} value={selectedAirport?.id || ''}>
						{airports.map((airport) => (
							<SelectItem
								className={`
							bg-gray-900 text-white cursor-pointer
							data-[state=checked]:bg-gray-900 data-[state=checked]:text-white
							data-[highlighted]:bg-gray-700 data-[highlighted]:text-white
						`}
								key={airport.id}
								value={airport.id}
							>
								{airport.name}
							</SelectItem>
						))}
					</DropDown>
				</div>
				<div className='flex w-full items-center justify-between'>
					<div className='absolute bottom-0 right-0 mb-4 mr-4 flex flex-row items-end space-y-4'>
						<div className='volume-control flex items-center space-x-2 ml-4 flex-row'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='1.5'
								stroke='currentColor'
								className='h-6 w-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z'
								/>
							</svg>
							<input
								type='range'
								min='0'
								max='100'
								className='w-32 cursor-pointer'
								value={atcVolume}
								onChange={(e) => setAtcVolume(parseInt(e.target.value))}
							/>
						</div>
						<div className='volume-control flex items-center space-x-2 ml-4 flex-row'>
							<div>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth={1.5}
									stroke='currentColor'
									className='h-6 w-6'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z'
									/>
								</svg>
							</div>
							<input
								type='range'
								min='0'
								max='100'
								className='w-32 cursor-pointer'
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
					</div>
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
