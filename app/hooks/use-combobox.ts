'use client';
import {  useEffect, useRef, useState } from 'react';

export interface OptionProps {
	label: string;
	value: string | number | null | undefined;
	image?: string;
}

interface useComboBoxProps {
	options: OptionProps[];
	onSelect?: (value: string | number | null) => void;
	handleLoadMore?: () => void | Promise<void>;
	selectedValue?: string | number | null;
	placeholder?: string | React.ReactNode;
}

export const useComboBox = ({
	options,
	selectedValue,
	onSelect,
	handleLoadMore,
	placeholder
}: useComboBoxProps) => {
	const [highlightedIndex, setHighlightedIndex] =
		useState<number>(-1);

	const [internalSelected, setInternalSelected] =
		useState<React.ReactNode | null>(() => {
			if (selectedValue) {
				const option = options.find(o => o.value === selectedValue);
				return option?.label ?? null;
			}
			if (placeholder && typeof placeholder !== 'string') {
				return placeholder;
			}
			return null;
		});

	const dropdownRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const lastItemRef = useRef<HTMLLIElement | null>(null);
	const lastLoadRef = useRef<number | null>(null);
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (selectedValue !== undefined && selectedValue !== null) {
			const option = options.find(o => o.value === selectedValue);
			setInternalSelected(option?.label ?? null);
		} else if (placeholder && typeof placeholder !== 'string') {
			setInternalSelected(placeholder);
		} else if (selectedValue === null) {
			setInternalSelected(null);
		}
	}, []);

	const filteredOptions = options;

	const handleAddClick = (label: string) => {
		setInternalSelected(label);
		onSelect?.(label);
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		setInternalSelected(null);
		onSelect?.(null);
	};

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLDivElement>
	) => {
		const isFromInput =
			(event.target as HTMLElement)?.tagName === 'INPUT';
		if (isFromInput) return;
		const optionCount = filteredOptions.length;
		switch (event.key) {
			case 'ArrowDown': {
				event.preventDefault();
				if (optionCount === 0) break;
				setHighlightedIndex(prev => {
					const next = prev < 0 ? 0 : (prev + 1) % optionCount;
					return next;
				});
				break;
			}
			case 'ArrowUp': {
				event.preventDefault();
				if (optionCount === 0) break;
				setHighlightedIndex(prev => {
					const next =
						prev < 0
							? optionCount - 1
							: (prev - 1 + optionCount) % optionCount;
					return next;
				});
				break;
			}
			default:
				break;
		}
	};

	useEffect(() => {
		const lastItem = lastItemRef.current;
		if (!lastItem) return;

		const handleHover = () => {
			const lastIndex = filteredOptions.length - 1;
			if (lastLoadRef.current !== lastIndex) {
				handleLoadMore?.();
				lastLoadRef.current = lastIndex;
			}
		};

		lastItem.addEventListener('mouseover', handleHover);

		const lastIndex = filteredOptions.length - 1;
		if (
			highlightedIndex === lastIndex &&
			lastLoadRef.current !== lastIndex
		) {
			handleLoadMore?.();
			lastLoadRef.current = lastIndex;
		}

		return () =>
			lastItem.removeEventListener('mouseover', handleHover);
	}, [filteredOptions, highlightedIndex, handleLoadMore]);

	return {
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
	};
};
