import { http, createConfig } from "wagmi";
import { somniaTestnet } from "./chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = "91f167f5889a649b993ea6fddb741d88";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [rainbowWallet, metaMaskWallet, coinbaseWallet],
    },
    {
      groupName: "Others",
      wallets: [walletConnectWallet, injectedWallet],
    },
  ],
  {
    appName: "DeFi Risk Sentinel",
    projectId,
  }
);

export const config = createConfig({
  connectors,
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http(),
  },
  ssr: false,
});
