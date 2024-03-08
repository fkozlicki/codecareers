import { CaretSortIcon, Cross2Icon } from '@radix-ui/react-icons';
import { GroupBase } from 'react-select';
import type {} from 'react-select/base';
import Select, { CreatableProps } from 'react-select/creatable';

const MultiSelect = <
	Option,
	Group extends GroupBase<Option> = GroupBase<Option>
>(
	props: CreatableProps<Option, boolean, Group>
) => {
	return (
		<Select
			{...props}
			isMulti={true}
			components={{
				DropdownIndicator: () => (
					<CaretSortIcon className="h-4 w-4 opacity-50 ml-2" />
				),
				ClearIndicator: (props) => (
					<div {...props.innerProps} className="p-2 opacity-50">
						<Cross2Icon />
					</div>
				),
			}}
			className="text-sm"
			classNames={{
				indicatorsContainer: () => 'pr-3',
				control: () =>
					'!border-input !shadow-sm !cursor-pointer !min-h-[36px] !rounded-md',
				menu: () => 'border !border-input !shadow-md !text-sm',
				placeholder: () => '!text-primary',
				menuList: () => 'p-1',
				option: () =>
					'relative flex w-full cursor-default select-none items-center rounded-sm !py-1.5 !pl-2 !pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 !bg-popover hover:!bg-accent',
				indicatorSeparator: () => '!bg-input',
			}}
		/>
	);
};

export default MultiSelect;
