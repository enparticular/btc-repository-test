import "./styles/globals.scss";
import "./styles/bootstrap-overrides.scss";

import styles from "./styles/components/Main.module.scss";

import type { Metadata } from "next";
import Logo from "../public/logo.png";
import Image from "next/image";

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
					<Image src={Logo} alt="Logo" className={styles.logo} width={150} />
				</div>
				{children}
			</body>
		</html>
	);
}
