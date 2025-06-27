import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { anvil, mainnet, sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";

interface Props {
  children: React.ReactNode;
}

const WALLETCONNECT_PROJECT_ID =
  import.meta.env.MODE === "development"
    ? "eacdee41b7fa8ba5ea1e037b1f9f4366"
    : "";

export const config: ReturnType<typeof getDefaultConfig> = getDefaultConfig({
  appName: "ethui demo",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [anvil, mainnet, sepolia],
  ssr: true,
});

export function Ethereum({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
