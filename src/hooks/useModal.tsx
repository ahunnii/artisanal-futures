import { useState } from "react";

export const useModal = (initialMode: boolean = false): [boolean, () => void] => {
	const [modalOpen, setModalOpen] = useState(initialMode);
	const toggle = () => setModalOpen(!modalOpen);
	return [modalOpen, toggle];
};

export const useModalWithData = <T,>(
	initialMode: boolean = false,
	initialSelected: T | null = null
): {
	modalOpen: boolean;
	setModalOpen: (state: boolean) => void;
	selected: T | null;
	setSelected: (selected: T | null) => void;
	setModalState: (state: boolean) => void;
} => {
	const [modalOpen, setModalOpen] = useModal(initialMode);
	const [selected, setSelected] = useState<T | null>(initialSelected);
	const setModalState = (state: boolean) => {
		setModalOpen();
		if (state === false) {
			setSelected(null);
		}
	};
	return { modalOpen, setModalOpen, selected, setSelected, setModalState };
};
