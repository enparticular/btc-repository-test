import React, { useState, useEffect } from "react";

import styles from "../styles/components/ExchangeForm.module.scss";
import buttonstyles from "../styles/components/Button.module.scss";

import SwapButton from "./SwapButton";
import FormattedNumberInput from "./FormattedNumberInput";
import ConfirmationScreen from "./ConfirmationScreen";
import { useExchangeForm } from "../hooks/useExchangeForm";

function ExchangeForm() {
	const { form, bitcoin, handlers, isSubmitDisabled } = useExchangeForm();
	const [animate, setAnimate] = useState(false);

	const { inputValue, outputValue, isBuying, error, showModal } = form;
	const { price, loading, error: priceError } = bitcoin;

	useEffect(() => {
		setTimeout(() => {
			setAnimate(true);
		}, 100);
	}, []);

	if (loading) {
		return <div className="text-center">Loading exchange rates...</div>;
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
				<h1 className={styles.title}>Buy or Sell BTC now</h1>

				{/* Input section */}
				<div className={styles.inputGroup}>
					<label className={styles.label}>
						{isBuying ? "YOU PAY (in USD)" : "YOU PAY (in BTC)"}
					</label>
					<FormattedNumberInput
						value={inputValue}
						onChange={handlers.inputChange}
						placeholder="50,000"
					/>
				</div>

				<div className={styles.swapButtonContainer}>
					<SwapButton onClick={handlers.swap} />
				</div>

				{/* Output section */}
				<div className={`${styles.inputGroup} ${styles.inputGroupReceive}`}>
					<label className={styles.label}>
						{isBuying ? "YOU RECEIVE (in BTC)" : "YOU RECEIVE (in USD)"}
					</label>
					<FormattedNumberInput
						value={outputValue}
						onChange={handlers.outputChange}
						placeholder="0.52 BTC"
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

				{/* Price display */}
				<p className={styles.currentPriceParagraph}>
					Current BTC price:{" "}
					<span className={styles.currentPriceNumber}>
						{price
							? price.toLocaleString("en-US", {
									style: "currency",
									currency: "USD",
							  })
							: "N/A"}
					</span>
				</p>
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
