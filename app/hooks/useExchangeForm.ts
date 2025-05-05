import { useState, useEffect } from "react";
import { useBitcoinPrice } from "./useBitcoinPrice";

// Constants for limits
export const MAX_BTC_AMOUNT = 100000; // 100,000 BTC
export const MAX_USD_AMOUNT = 940000000; // $940 million
export const BTC_MAX_CHARS = 6; // Max 6 digits for BTC
export const USD_MAX_CHARS = 10; // Max 10 digits for USD
export const BTC_DECIMALS = 8;
export const USD_DECIMALS = 2;

export interface FormState {
	inputValue: string;
	outputValue: string;
	isBuying: boolean;
	error: string | null;
	showModal: boolean;
	exceedsMaxAmount: boolean;
}

export function useExchangeForm() {
	const [formState, setFormState] = useState<FormState>({
		inputValue: "",
		outputValue: "",
		isBuying: true,
		error: null,
		showModal: false,
		exceedsMaxAmount: false,
	});

	const bitcoinData = useBitcoinPrice();
	const { price } = bitcoinData;
	const { inputValue, isBuying, exceedsMaxAmount } = formState;

	const updateFormState = (updates: Partial<FormState>) => {
		setFormState((prev) => ({ ...prev, ...updates }));
	};

	const calculateOutput = (input: string) => {
		if (!input || !price) return "";

		const inputNum = parseFloat(input.replace(/,/g, ""));
		if (isNaN(inputNum)) return "";

		const result = isBuying
			? (inputNum / price).toFixed(BTC_DECIMALS)
			: (inputNum * price).toFixed(USD_DECIMALS);

		return result;
	};

	// Check if input exceeds maximum allowed value
	const checkMaxAmount = (value: string) => {
		if (!value) return false;

		const numValue = parseFloat(value);
		if (isNaN(numValue)) return false;

		const maxLimit = isBuying ? MAX_USD_AMOUNT : MAX_BTC_AMOUNT;
		return numValue > maxLimit;
	};

	// Group all handler functions into a single object
	const handlers = {
		swap: () => {
			setFormState((prev) => {
				const newIsBuying = !prev.isBuying;
				const newInputValue = prev.outputValue;

				// Calculate new output based on new input
				let newOutput = "";
				if (newInputValue && price) {
					try {
						const inputNum = parseFloat(newInputValue);
						if (!isNaN(inputNum)) {
							newOutput = newIsBuying
								? (inputNum * price).toFixed(USD_DECIMALS)
								: (inputNum / price).toFixed(BTC_DECIMALS);
						}
					} catch (e) {
						console.error("Error calculating output:", e);
					}
				}

				// Check if the new input exceeds max after swap
				const exceedsMax = checkMaxAmount(newInputValue);

				return {
					...prev,
					isBuying: newIsBuying,
					inputValue: newInputValue,
					outputValue: newOutput,
					error: null,
					exceedsMaxAmount: exceedsMax,
				};
			});
		},

		inputChange: (value: string) => {
			const newOutput = calculateOutput(value);
			const exceedsMax = checkMaxAmount(value);

			updateFormState({
				inputValue: value,
				outputValue: newOutput,
				error: null,
				exceedsMaxAmount: exceedsMax,
			});
		},

		outputChange: (value: string) => {
			if (!price) return;

			updateFormState({ outputValue: value });

			if (!value || parseFloat(value) === 0) {
				updateFormState({ inputValue: "", exceedsMaxAmount: false });
				return;
			}

			try {
				const valueNum = parseFloat(value);
				if (isNaN(valueNum)) return;

				const newInput = isBuying
					? (valueNum * price).toFixed(USD_DECIMALS)
					: (valueNum / price).toFixed(BTC_DECIMALS);

				const exceedsMax = checkMaxAmount(newInput);

				updateFormState({
					inputValue: newInput,
					exceedsMaxAmount: exceedsMax,
				});
			} catch (error) {
				console.error("Calculation error:", error);
				updateFormState({ error: "Invalid calculation" });
			}
		},

		handleExceedMax: (isExceeding: boolean) => {
			updateFormState({ exceedsMaxAmount: isExceeding });
		},

		submit: (e?: React.FormEvent) => {
			if (e) {
				e.preventDefault();
			}

			if (!inputValue || parseFloat(inputValue) <= 0) {
				updateFormState({ error: "Please enter a valid amount" });
				return;
			}

			if (exceedsMaxAmount) {
				updateFormState({ error: "Please enter an amount within the limit" });
				return;
			}

			updateFormState({ showModal: true });
		},

		closeModal: () => updateFormState({ showModal: false }),
	};

	// Recalculate when price changes
	useEffect(() => {
		if (inputValue && price) {
			const newOutput = calculateOutput(inputValue);
			const exceedsMax = checkMaxAmount(inputValue);
			updateFormState({
				outputValue: newOutput,
				exceedsMaxAmount: exceedsMax,
			});
		}
	}, [price, isBuying]);

	// Set up limits based on current mode
	const maxDecimals = isBuying ? USD_DECIMALS : BTC_DECIMALS;
	const receiveMaxDecimals = isBuying ? BTC_DECIMALS : USD_DECIMALS;
	const maxChars = isBuying ? USD_MAX_CHARS : BTC_MAX_CHARS;
	const receiveMaxChars = isBuying ? BTC_MAX_CHARS : USD_MAX_CHARS;
	const maxAmount = isBuying ? MAX_USD_AMOUNT : MAX_BTC_AMOUNT;
	const receiveMaxAmount = isBuying ? MAX_BTC_AMOUNT : MAX_USD_AMOUNT;

	// Calculate disabled status
	const isSubmitDisabled =
		!inputValue || parseFloat(inputValue) <= 0 || exceedsMaxAmount;

	// Return a structured object with all the necessary values
	return {
		// State
		form: formState,
		bitcoin: bitcoinData,

		// Actions
		handlers,

		// Derived state
		isSubmitDisabled,

		// Limits
		limits: {
			maxAmount,
			receiveMaxAmount,
			maxDecimals,
			receiveMaxDecimals,
			maxChars,
			receiveMaxChars,
		},
	};
}
