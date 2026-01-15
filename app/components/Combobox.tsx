import { RotateCcw, Plus } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent } from 'react';
import { OptionProps, useComboBox } from '../hooks/use-combobox';

interface ComboBoxProps {
	tabIndex?: number;
	options: OptionProps[];
	onSelect?: (value: string | number | null) => void;
	onClearSearch?: () => void;
	placeholder?: string | React.ReactNode;
	inputValue?: string;
	handleSearch?: (e: ChangeEvent<HTMLInputElement>) => void;
	handleLoadMore?: () => void | Promise<void>;
	selectedValue?: string | number | null;
	disabled?: boolean;
}

const ComboBox = ({
	tabIndex,
	options,
	onSelect,
	onClearSearch,
	placeholder = 'Select an option',
	inputValue,
	handleSearch,
	handleLoadMore,
	selectedValue,
	disabled
}: ComboBoxProps) => {
	const {
		highlightedIndex,
		setHighlightedIndex,
		handleKeyDown,
		internalSelected,
		dropdownRef,
		listRef,
		searchRef,
		lastItemRef,
		filteredOptions,
		handleAddClick,
		handleClear
	} = useComboBox({
		options,
		selectedValue,
		onSelect,
		handleLoadMore,
		placeholder
	});

	return (
		<div
			className='relative w-full rounded-xl focus:outline-0 focus:ring focus:ring-gray-400'
			ref={dropdownRef}
			tabIndex={tabIndex}
			onKeyDown={disabled ? undefined : handleKeyDown}
		>
			<div className='relative'>
				<input
					ref={searchRef}
					type='text'
					placeholder={typeof placeholder === 'string' ? placeholder : 'Search...'}
					value={(internalSelected as string) || inputValue || ''}
					onChange={handleSearch}
					disabled={disabled}
					className={`w-full h-11 px-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none dark:bg-gray-800/50 dark:text-white bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 ${
						disabled ? 'cursor-not-allowed opacity-60' : ''
					}`}
				/>
				{internalSelected && !disabled && (
					<button
						type='button'
						onClick={(e) => {
							handleClear(e);
							onClearSearch?.();
						}}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'
						aria-label='Clear selection'
					>
						<RotateCcw size={16} />
					</button>
				)}
			</div>

			<div
				className={`absolute w-full mt-1 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none dark:bg-gray-800/50 dark:text-white bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-0 overflow-hidden ${
					inputValue && !internalSelected
						? 'max-h-60 opacity-100 z-50'
						: 'max-h-0 opacity-0 -z-40'
				}`}
			>
				<ul ref={listRef} className='max-h-60 overflow-y-auto p-3'>
					{filteredOptions.length > 0 ? (
						filteredOptions.map((option, index) => (
							<li
								key={`${option.value}-${index}`}
								ref={index === filteredOptions.length - 1 ? lastItemRef : null}
								data-index={index}
								onMouseEnter={() => setHighlightedIndex(index)}
								className={`flex items-center justify-between p-2 mb-2 rounded cursor-pointer ${
									index === highlightedIndex
										? 'bg-gray-200 dark:bg-gray-700'
										: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
								}`}
							>
								<span className='text-white flex items-center flex-1'>
									{option?.image && (
										<Image
											src={option.image}
											alt=''
											width={24}
											height={24}
											className='inline mr-2 w-10 h-10 rounded-full'
										/>
									)}
									{option.label}
								</span>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleAddClick(option.label);
									}}
									disabled={disabled}
									className='ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
								>
									<Plus size={14} />

								</button>
							</li>
						))
					) : (
						<li className='px-3 py-2 text-center text-gray-400'>
							No results found
						</li>
					)}
				</ul>
			</div>
		</div>
	);
};

export default ComboBox;