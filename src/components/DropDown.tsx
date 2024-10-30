import {Select, SelectContent, SelectTrigger, SelectValue} from '@/components/ui/select';
import {ReactNode} from 'react';

type Props = {
	onChange: (value: string) => void;
	children: ReactNode;
	value: string;
};

export default function DropDown({onChange, children, value}: Props) {
	return (
		<Select onValueChange={onChange} value={value}>
			<SelectTrigger className='w-[300px]'>
				<SelectValue placeholder='Select an airport' />
			</SelectTrigger>
			<SelectContent>{children}</SelectContent>
		</Select>
	);
}
