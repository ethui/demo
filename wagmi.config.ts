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
        DepositToken: {
          31337: "0x2BB8B93F585B43b06F3d523bf30C203d3B6d4BD4",
          31338: "0x2BB8B93F585B43b06F3d523bf30C203d3B6d4BD4",
        },
        Vault: {
          31337: "0x2d13826359803522cCe7a4Cfa2c1b582303DD0B4",
          31338: "0x2d13826359803522cCe7a4Cfa2c1b582303DD0B4",
        },
      },
    }),
    react(),
  ],
});

export default config;
