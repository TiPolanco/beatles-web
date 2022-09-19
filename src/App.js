import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { chain } from "./constants.js";

import NavBar from "./components/NavBar";
import Main from "./components/Main.js";
import Footer from "./components/Footer.js";

import './App.css';

const { chains, provider } = configureChains(
	[chain.ethwMainnet],
	[publicProvider()]
);
const { connectors } = getDefaultWallets({
	appName: "ETHW Genesis",
	chains
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
});

function App() {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains}>
				<div className="app">
					<NavBar />
					<Main />
					<Footer /> 
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default App;