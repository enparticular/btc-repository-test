import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import styles from "../styles/components/ConfirmationScreen.module.scss";

interface ConfirmationScreenProps {
	show: boolean;
	onDone: () => void;
	amount: string;
	bitcoinAmount: string;
	isBuying: boolean;
	price: number | null;
}

function ConfirmationScreen({
	show,
	onDone,
	amount,
	bitcoinAmount,
	isBuying,
}: ConfirmationScreenProps) {
	const [animationStage, setAnimationStage] = useState<
		"hidden" | "flash" | "content" | "exit"
	>("hidden");

	useEffect(() => {
		if (show) {
			// Start the animation sequence
			setAnimationStage("flash");

			// Show the flash briefly, then transition to content
			setTimeout(() => {
				setAnimationStage("content");
			}, 900);
		} else {
			setAnimationStage("hidden");
		}
	}, [show]);

	const handleDone = () => {
		// Start exit animation
		setAnimationStage("exit");

		// Call onDone after exit animation completes
		setTimeout(onDone, 500);
	};

	const formatUSD = (value: string) => {
		if (!value) return "$0";
		return parseFloat(value).toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
	};

	if (!show && animationStage === "hidden") {
		return null;
	}

	return (
		<div className={`${styles.overlay} ${styles[animationStage]}`}>
			<div className={styles.flashLayer}></div>

			<div className={styles.confirmationContainer}>
				<div className={styles.confirmationContent}>
					<div className={styles.iconContainer}>
						<FaCheckCircle
							key={animationStage}
							size={60}
							className={styles.successIcon}
						/>
					</div>

					<h2 className={styles.title}>Transaction Complete</h2>

					<div className={styles.details}>
						<p className={styles.description}>
							Success! Your transaction has been processed correctly.
						</p>

						<div className={styles.transactionDetails}>
							<h4>Transaction Details</h4>

							{isBuying ? (
								<p>
									Amount purchased:{" "}
									<span className={styles.highlight}>{bitcoinAmount} BTC</span>
									<br />
									Amount paid (USD):{" "}
									<span className={styles.highlight}>{formatUSD(amount)}</span>
								</p>
							) : (
								<p>
									Amount purchased{" "}
									<span className={styles.highlight}>
										{formatUSD(bitcoinAmount)} USD
									</span>
									<br />
									Amount paid (BTC):{" "}
									<span className={styles.highlight}>{amount}</span>
								</p>
							)}
						</div>
					</div>

					<button onClick={handleDone} className={styles.doneButton}>
						Go Back
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmationScreen;
