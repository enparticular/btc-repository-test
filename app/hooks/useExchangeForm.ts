import { useState, useEffect } from "react";
import { useBitcoinPrice } from "./useBitcoinPrice";

export interface FormState {
	inputValue: string;
	outputValue: string;
	isBuying: boolean;
	error: string | null;
	showModal: boolean;
}

export function useExchangeForm() {
	const [formState, setFormState] = useState<FormState>({
		inputValue: "",
		outputValue: "",
		isBuying: true,
		error: null,
		showModal: false,
	});

	const bitcoinData = useBitcoinPrice();
	const { price } = bitcoinData;
	const { inputValue, isBuying } = formState;

	const updateFormState = (updates: Partial<FormState>) => {
		setFormState((prev) => ({ ...prev, ...updates }));
	};

	const calculateOutput = (input: string) => {
		if (!input || !price) return "";

		const inputNum = parseFloat(input.replace(/,/g, ""));
		if (isNaN(inputNum)) return "";

		return isBuying
			? (inputNum / price).toFixed(8) // USD to BTC
			: (inputNum * price).toFixed(2); // BTC to USD
	};

	// Group all handler functions into a single object
	const handlers = {
		swap: () => {
			setFormState((prev) => ({
				...prev,
				isBuying: !prev.isBuying,
				inputValue: prev.outputValue,
				outputValue: prev.inputValue,
				error: null,
			}));
		},

		inputChange: (value: string) => {
			if (!/^(\d*\.?\d*)$/.test(value) && value !== "") return;

			const newOutput = calculateOutput(value);
			updateFormState({
				inputValue: value,
				outputValue: newOutput,
				error: null,
			});
		},

		outputChange: (value: string) => {
			if (!price) return;

			updateFormState({ outputValue: value });

			if (!value || parseFloat(value) === 0) {
				updateFormState({ inputValue: "" });
				return;
			}

			try {
				const newInput = isBuying
					? (parseFloat(value) * price).toFixed(2) // BTC to USD
					: (parseFloat(value) / price).toFixed(8); // USD to BTC

				updateFormState({ inputValue: newInput });
			} catch (error) {
				console.error("Calculation error:", error);
				updateFormState({ error: "Invalid calculation" });
			}
		},

		submit: (e?: React.FormEvent) => {
			if (e) {
				e.preventDefault();
			}

			if (!inputValue || parseFloat(inputValue) <= 0) {
				updateFormState({ error: "Please enter a valid amount" });
				return;
			}

			updateFormState({ showModal: true });
		},

		closeModal: () => updateFormState({ showModal: false }),
	};

	// Recalculate when price or buying state changes
	useEffect(() => {
		if (inputValue) {
			const newOutput = calculateOutput(inputValue);
			updateFormState({ outputValue: newOutput });
		}
	}, [price, isBuying]);

	const isSubmitDisabled = !inputValue || parseFloat(inputValue) <= 0;

	// Return a structured object with logical groupings
	return {
		// Data
		form: formState,
		bitcoin: bitcoinData,

		// Actions
		handlers,

		// Derived state
		isSubmitDisabled,
	};
}
