import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "../styles/components/Modal.module.scss";

// Add this interface at the top of your file
interface TransactionModalProps {
	show: boolean;
	onHide: () => void;
	amount: string;
	bitcoinAmount: string;
	isBuying: boolean;
	price: number | null;
}

function TransactionModal({
	show,
	onHide,
	amount,
	bitcoinAmount,
	isBuying,
	price,
}: TransactionModalProps) {
	const [showConfetti, setShowConfetti] = useState(false);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		if (show) {
			setShowConfetti(true);
			// Small delay to trigger animation after modal is visible
			setTimeout(() => setAnimate(true), 100);
		} else {
			setShowConfetti(false);
			setAnimate(false);
		}
	}, [show]);

	const formatUSD = (value: string) => {
		if (!value) return "$0";
		return parseFloat(value).toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
	};

	return (
		<>
			<BitcoinConfetti show={showConfetti} />
			<Modal
				show={show}
				onHide={onHide}
				centered
				backdrop={true}
				contentClassName={styles.modalContent}
				className={`${styles.modalWrapper} ${show ? styles.modalShow : ""}`}
			>
				<Modal.Header className={styles.modalHeader}>
					<Modal.Title className={styles.modalTitle}>
						Transaction Complete
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className={styles.modalBody}>
					<h3 className={styles.congratsText}>Congratulations!</h3>
					<p className={styles.successMessage}>
						Your transaction has been processed successfully.
					</p>

					<div className={styles.transactionDetails}>
						<div className={styles.detailsHeader}>
							<h4>Transaction Details</h4>
						</div>

						<div className={styles.detailsCard}>
							{isBuying ? (
								<p>
									Purchased{" "}
									<span className={styles.amountHighlight}>
										{bitcoinAmount} BTC
									</span>{" "}
									for{" "}
									<span className={styles.amountHighlight}>
										{formatUSD(amount)}
									</span>
								</p>
							) : (
								<p>
									Sold{" "}
									<span className={styles.amountHighlight}>{amount} BTC</span>{" "}
									for{" "}
									<span className={styles.amountHighlight}>
										{formatUSD(bitcoinAmount)}
									</span>
								</p>
							)}

							<div className={styles.priceBadge}>
								<p>
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
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className={styles.modalFooter}>
					<Button className={styles.modalButton} onClick={onHide} size="lg">
						Go back
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default TransactionModal;
