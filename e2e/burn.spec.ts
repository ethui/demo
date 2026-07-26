import { expect, test } from "@playwright/test";
import { ALICE, injectWallet, revert, snapshot } from "./wallet";

let snapshotId: string;

test.beforeEach(async ({ context }) => {
  snapshotId = await snapshot();
  await injectWallet(context, ALICE);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === "passed") {
    await revert(snapshotId);
    return;
  }

  // reverting would erase the failing transaction, which is what gets debugged
  const hashes = await page.evaluate(
    () => (window as unknown as { __ethuiTxs?: string[] }).__ethuiTxs ?? [],
  );
  for (const hash of hashes) console.log(`failing tx: ${hash}`);
});

test("burning 50 TEST leaves 150", async ({ page }) => {
  await page.goto("/#/contracts/erc20");

  // wagmi reconnects to the injected EIP-6963 provider on load, so no connect click
  await expect(page.getByText(ALICE.slice(0, 4), { exact: false })).toBeVisible({
    timeout: 15_000,
  });

  // the deploy script mints to alice twice — she is listed as both alice and carol
  const balance = page.getByTestId("balance");
  await expect(balance).toHaveText("Balances: 200");

  await page.getByTestId("burn-amount").fill("50");
  await page.getByTestId("burn-submit").click();

  await expect(balance).toHaveText("Balances: 150", { timeout: 15_000 });
});
