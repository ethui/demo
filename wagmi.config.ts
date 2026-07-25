import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

const config: ReturnType<typeof defineConfig> = defineConfig({
  out: "src/wagmi.generated.ts",
  plugins: [
    foundry({
      project: "./",
      deployments: {
        NFT: {
          31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          31338: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        },
        Token: {
          31337: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
          31338: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
        },
        TestCalls: {
          31337: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          31338: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        },
        OwnedRegistry: {
          31337: "0x3347B4d90ebe72BeFb30444C9966B2B990aE9FcB",
          31338: "0x3347B4d90ebe72BeFb30444C9966B2B990aE9FcB",
        },
        SixDecimalToken: {
          31337: "0xaca81583840B1bf2dDF6CDe824ada250C1936B4D",
          31338: "0xaca81583840B1bf2dDF6CDe824ada250C1936B4D",
        },
        VaultToken: {
          31337: "0xd3FFD73C53F139cEBB80b6A524bE280955b3f4db",
          31338: "0xd3FFD73C53F139cEBB80b6A524bE280955b3f4db",
        },
        Vault: {
          31337: "0xCBBe2A5c3A22BE749D5DDF24e9534f98951983e2",
          31338: "0xCBBe2A5c3A22BE749D5DDF24e9534f98951983e2",
        },
      },
    }),
    react({
      // Default naming (`use${Type}${ContractName}${ItemName ?? ""}`) collides
      // here: Vault's `token()` getter and VaultToken's own base read hook both
      // resolve to `useReadVaultToken`. Disambiguate only that one case; every
      // other hook keeps the default name.
      getHookName: ({ type, contractName, itemName }) => {
        if (
          type === "read" &&
          contractName === "Vault" &&
          itemName === "Token"
        ) {
          return "useReadVaultTokenAddress";
        }
        const typePascal = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
        const hookName: `use${string}` = `use${typePascal}${contractName}${itemName ?? ""}`;
        return type === "watch" ? `${hookName}Event` : hookName;
      },
    }),
  ],
});

export default config;
