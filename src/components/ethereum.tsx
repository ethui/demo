import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { anvil, mainnet, sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";

interface Props {
  children: React.ReactNode;
}

const localEthuiStacks = defineChain({
  ...anvil,
  name: "local-stacks",
  id: 0xdd7a69,
  rpcUrls: {
    default: {
      http: ["http://demo.stacks.lvh.me:4000"],
    },
  },
  blockExplorerUrls: {},
  subgraphUrl: "http://demo.stacks.lvh.me:4040/subgraphs/name/demo",
});

export const config: ReturnType<typeof getDefaultConfig> = getDefaultConfig({
  appName: "ethui demo",
  projectId: "TODO",
  chains: [anvil, localEthuiStacks, mainnet, sepolia],
  ssr: true,
});

export function Ethereum({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
