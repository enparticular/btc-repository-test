import React, { useState, useEffect } from "react";
import styles from "../styles/components/FormattedNumberInput.module.scss";

interface FormattedNumberInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	prefix?: string;
	maxDecimals?: number;
	maxValue?: number;
	maxChars?: number;
	onExceedMaxValue?: (isExceeding: boolean) => void;
}

function FormattedNumberInput({
	value,
	onChange,
	placeholder = "0",
	readOnly = false,
	prefix,
	maxDecimals = 8,
	maxValue,
	maxChars,
	onExceedMaxValue,
}: FormattedNumberInputProps) {
	const [displayValue, setDisplayValue] = useState<string>("");

	// Format the number for display (with commas)
	useEffect(() => {
		if (value === "") {
			setDisplayValue("");
			return;
		}

		const numericValue = value;

		// Format with US-style commas
		const parts = numericValue.split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		const formattedValue = parts.join(".");
		setDisplayValue(formattedValue);

		// Remove maxValue and onExceedMaxValue from dependencies to avoid loops
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;

		// Remove all non-numeric characters except decimal point
		const numericValue = newValue.replace(/[^\d.]/g, "");

		// Only allow one decimal point
		const parts = numericValue.split(".");
		if (parts.length > 2) {
			parts.splice(2);
		}

		// Apply decimal limit
		if (parts.length > 1 && parts[1].length > maxDecimals) {
			parts[1] = parts[1].substring(0, maxDecimals);
		}

		const cleanedValue = parts.join(".");

		// Apply character limit if specified (without counting decimal point)
		if (maxChars && cleanedValue.replace(/\./g, "").length > maxChars) {
			return; // Don't update if exceeding max chars
		}

		// Check value limits
		if (maxValue !== undefined && cleanedValue !== "") {
			const numValue = parseFloat(cleanedValue);

			// Check if the value exceeds maximum
			if (!isNaN(numValue) && numValue > maxValue) {
				if (onExceedMaxValue) {
					onExceedMaxValue(true);
				}
			} else if (onExceedMaxValue) {
				onExceedMaxValue(false);
			}
		}

		// Pass the cleaned numeric value to the parent component
		onChange(cleanedValue);
	};

	return (
		<div className={styles.formattedInputContainer}>
			{prefix && <span className={styles.inputPrefix}>{prefix}</span>}
			<input
				type="text"
				className={styles.input}
				placeholder={placeholder}
				value={displayValue}
				onChange={handleChange}
				readOnly={readOnly}
				inputMode="decimal"
			/>
		</div>
	);
}

export default FormattedNumberInput;
