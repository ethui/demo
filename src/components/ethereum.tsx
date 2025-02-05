import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { anvil, mainnet, sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";

interface Props {
  children: React.ReactNode;
}

const demoChain = defineChain({
  ...anvil,
  name: "demo",
  id: 31338,
  rpcUrls: {
    default: {
      http: ["https://anvil.demo.ethui.dev"],
      webSocket: ["wss://anvil.demo.ethui.dev"],
    },
  },
});

export const config = getDefaultConfig({
  appName: "ethui demo",
  projectId: "TODO",
  chains: [demoChain, anvil, mainnet, sepolia],
  ssr: true,
});

export function Ethereum({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
