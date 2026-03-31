import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
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

const ethuiStack = defineChain({
  ...anvil,
  name: "local-stacks",
  id: 15597603,
  rpcUrls: {
    default: {
      http: [
        "https://hello-world.stacks.ethui.dev/FonXHADNhx3vSzQECV6uz4vNxndkdk36c",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "ethui explorer",
      url: "https://explorer.ethui.dev/rpc/d3NzOi8vaGVsbG8td29ybGQuc3RhY2tzLmV0aHVpLmRldi9Gb25YSEFETmh4M3ZTelFFQ1Y2dXo0dk54bmRrZGszNmM=",
    },
  },
});

export const config: ReturnType<typeof getDefaultConfig> = getDefaultConfig({
  appName: "ethui demo",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [anvil, ethuiStack, mainnet, sepolia],
  ssr: true,
});

export function Ethereum({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
