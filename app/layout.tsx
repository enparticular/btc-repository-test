import "./styles/globals.scss";
import "./styles/bootstrap-overrides.scss";

import styles from "./styles/components/Main.module.scss";

import type { Metadata } from "next";
import Logo from "../public/logo.svg";

export const metadata: Metadata = {
	title: "USD <> BTC Exchange",
	description: "Simple Bitcoin exchange application",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<div className={styles.header}>
					<Logo
						className={styles.logo}
						width={200}
						height={60}
						aria-label="Xapo Logo"
					/>
				</div>
				{children}
			</body>
		</html>
	);
}
