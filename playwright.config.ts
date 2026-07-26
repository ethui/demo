import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // one worker per stack: a revert in one worker throws away another's snapshot
  workers: 1,
  use: { baseURL: "http://localhost:5173", trace: "retain-on-failure" },
  webServer: [
    {
      command: "node e2e/proxy.mjs",
      url: "http://127.0.0.1:8545",
      // never reuse: a stray local anvil on 8545 would silently replace the stack
      reuseExistingServer: false,
      stdout: "pipe",
    },
    {
      command: "yarn dev",
      url: "http://localhost:5173",
      reuseExistingServer: true,
    },
  ],
});
