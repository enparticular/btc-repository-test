import React, { useState, useEffect } from "react";
import styles from "../styles/components/FormattedNumberInput.module.scss";

interface FormattedNumberInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	prefix?: string;
}

function FormattedNumberInput({
	value,
	onChange,
	placeholder = "0",
	readOnly = false,
	prefix,
}: FormattedNumberInputProps) {
	// Keep track of the formatted display value
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
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;

		// Remove all non-numeric characters except decimal point
		// This preserves the raw numeric value for calculations
		const numericValue = newValue.replace(/[^\d.]/g, "");

		// Only allow one decimal point
		const parts = numericValue.split(".");
		if (parts.length > 2) {
			parts.splice(2);
		}
		const cleanedValue = parts.join(".");

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
