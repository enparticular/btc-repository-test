import { useState, useEffect } from "react";

interface BinancePriceData {
	symbol: string;
	price: string;
}

export const useBitcoinPrice = () => {
	const [price, setPrice] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				const response = await fetch(
					"https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch Bitcoin price");
				}

				const data: BinancePriceData = await response.json();
				setPrice(parseFloat(data.price));
				setLoading(false);
			} catch (err) {
				setError((err as Error).message);
				setLoading(false);
			}
		};

		fetchPrice();
	}, []);

	return { price, loading, error };
};
