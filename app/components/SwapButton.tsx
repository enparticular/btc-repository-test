import React, { useState } from "react";
import { IoSwapVerticalSharp } from "react-icons/io5";
import styles from "../styles/components/SwapButton.module.scss";

interface SwapButtonProps {
	onClick: () => void;
}

function SwapButton({ onClick }: SwapButtonProps) {
	const [isRotated, setIsRotated] = useState(false);

	const handleClick = () => {
		setIsRotated(!isRotated);
		onClick();
	};

	return (
		<div className={styles.swapButtonContainer}>
			<button
				type="button"
				onClick={handleClick}
				className="btn btn-outline-secondary"
				aria-label="Swap currencies"
			>
				<div
					className={`${styles.iconWrapper} ${isRotated ? styles.rotated : ""}`}
				>
					<IoSwapVerticalSharp size={24} />
				</div>
			</button>
		</div>
	);
}

export default SwapButton;
