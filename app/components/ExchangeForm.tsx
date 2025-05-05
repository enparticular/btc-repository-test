import React, { useState, useEffect } from "react";
import styles from "../styles/components/ExchangeForm.module.scss";
import buttonstyles from "../styles/components/Button.module.scss";

import SwapButton from "./SwapButton";
import FormattedNumberInput from "./FormattedNumberInput";
import ConfirmationScreen from "./ConfirmationScreen";
import {
	useExchangeForm,
	MAX_BTC_AMOUNT,
	MAX_USD_AMOUNT,
} from "../hooks/useExchangeForm";

function ExchangeForm() {
	const { form, bitcoin, handlers, isSubmitDisabled, limits } =
		useExchangeForm();
	const [animate, setAnimate] = useState(false);

	const {
		inputValue,
		outputValue,
		isBuying,
		error,
		showModal,
		exceedsMaxAmount,
	} = form;
	const { price, loading, error: priceError } = bitcoin;

	useEffect(() => {
		setTimeout(() => {
			setAnimate(true);
		}, 100);
	}, []);

	if (loading) {
		return <div className={styles.loading}>Loading exchange rates...</div>;
	}

	if (priceError) {
		return <div className="text-center text-danger">Error: {priceError}</div>;
	}

	return (
		<>
			<form
				onSubmit={handlers.submit}
				className={`${styles.container} ${animate ? styles.animated : ""}`}
			>
				<h1 className={styles.title}>Buy or Sell BTC Instantly</h1>
				<p className={styles.subtitle}>
					{isBuying
						? "Buy Bitcoin  at the current market rate."
						: "Sell Bitcoin  at the current market rate."}
				</p>
				{/* Price display */}
				<p className={styles.currentPriceParagraph}>
					(Current BTC price:{" "}
					<span className={styles.currentPriceNumber}>
						{price
							? price.toLocaleString("en-US", {
									style: "currency",
									currency: "USD",
							  })
							: "N/A"}
					</span>
					)
				</p>

				{/* Input section */}
				<div className={styles.inputGroup}>
					<label className={styles.label}>
						{isBuying ? "You pay (in USD)" : "You pay (in BTC)"}
					</label>
					<FormattedNumberInput
						value={inputValue}
						onChange={handlers.inputChange}
						placeholder={isBuying ? "$0" : "0.00BTC"}
						maxDecimals={limits.maxDecimals}
						maxValue={isBuying ? MAX_USD_AMOUNT : MAX_BTC_AMOUNT}
						maxChars={limits.maxChars}
						onExceedMaxValue={handlers.handleExceedMax}
					/>
				</div>

				<div className={styles.swapButtonContainer}>
					<SwapButton onClick={handlers.swap} />
				</div>

				{/* Output section */}
				<div className={`${styles.inputGroup} ${styles.inputGroupReceive}`}>
					<label className={styles.label}>
						{isBuying ? "You receive (in BTC)" : "You receive (in USD)"}
					</label>
					<FormattedNumberInput
						value={outputValue}
						onChange={handlers.outputChange}
						placeholder={isBuying ? "0.00BTC" : "$0"}
						maxDecimals={limits.receiveMaxDecimals}
						maxValue={isBuying ? MAX_BTC_AMOUNT : MAX_USD_AMOUNT}
						maxChars={limits.receiveMaxChars}
						onExceedMaxValue={handlers.handleExceedMax}
					/>
				</div>

				{/* Error message */}
				{error && <div className={styles.errorMessage}>{error}</div>}

				{/* CTA Button */}
				<div className={buttonstyles.ctaButtonContainer}>
					<button
						type="submit"
						className={buttonstyles.ctaButton}
						disabled={isSubmitDisabled}
					>
						{isBuying
							? `BUY ${outputValue || "0"} BTC NOW`
							: `SELL ${inputValue || "0"} BTC NOW`}
					</button>
				</div>

				{/* Max amount alert */}
				{exceedsMaxAmount && (
					<p className={styles.maxAmountAlert}>
						Amount exceeds the maximum limit of{" "}
						{isBuying
							? `$${MAX_USD_AMOUNT.toLocaleString()}`
							: `${MAX_BTC_AMOUNT.toLocaleString()} BTC`}
					</p>
				)}
			</form>

			<ConfirmationScreen
				show={showModal}
				onDone={handlers.closeModal}
				amount={inputValue}
				bitcoinAmount={outputValue}
				isBuying={isBuying}
				price={price}
			/>
		</>
	);
}

export default ExchangeForm;
