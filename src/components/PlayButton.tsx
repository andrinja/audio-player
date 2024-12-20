import {Button} from './ui/button';
import {PauseIcon, PlayIcon} from '@radix-ui/react-icons';

type Props = {
	isPlaying: boolean;
	onClick: () => void;
};

export default function PlayButton({onClick, isPlaying}: Props) {
	return (
		<Button
			variant='ghost'
			className='!bg-white w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mr-10'
			onClick={onClick}
		>
			{isPlaying ? (
				<PauseIcon className='!text-black h-8 w-8 text-white' />
			) : (
				<PlayIcon className='!text-black h-8 w-8 text-white' />
			)}
		</Button>
	);
}
