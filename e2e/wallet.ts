import type { BrowserContext } from "@playwright/test";

export const RPC_URL = "http://127.0.0.1:8545";
export const ALICE = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const CHAIN_ID = "0x7a69";

export async function injectWallet(context: BrowserContext, account = ALICE) {
  await context.addInitScript(
    ({ account, chainId, rpcUrl }) => {
      let id = 0;

      const provider = {
        isMetaMask: true,
        async request({ method, params }: { method: string; params?: never }) {
          if (method === "eth_accounts" || method === "eth_requestAccounts") {
            return [account];
          }
          if (method === "eth_chainId") return chainId;
          if (method === "wallet_switchEthereumChain") return null;

          // without an explicit gas limit the node estimates, and a reverting tx is
          // rejected before it is mined — leaving no hash to debug
          const sendParams =
            method === "eth_sendTransaction" && params
              ? [{ gas: "0x7a1200", ...(params as unknown[])[0] }]
              : params;

          const res = await fetch(rpcUrl, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: ++id,
              method,
              params: sendParams ?? [],
            }),
          });
          const json = await res.json();
          if (json.error)
            throw Object.assign(new Error(json.error.message), json.error);

          if (method === "eth_sendTransaction") {
            const w = window as unknown as { __ethuiTxs?: string[] };
            (w.__ethuiTxs ??= []).push(json.result);
          }

          return json.result;
        },
        on: () => {},
        removeListener: () => {},
      };

      (window as unknown as { ethereum: unknown }).ethereum = provider;

      // wagmi v2 and RainbowKit discover wallets over EIP-6963, not window.ethereum
      const detail = Object.freeze({
        info: {
          uuid: "00000000-0000-0000-0000-00000000e741",
          name: "ethui stack",
          icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=",
          rdns: "dev.ethui.stack",
        },
        provider,
      });
      const announce = () =>
        window.dispatchEvent(
          new CustomEvent("eip6963:announceProvider", { detail }),
        );
      window.addEventListener("eip6963:requestProvider", announce);
      announce();
    },
    { account, chainId: CHAIN_ID, rpcUrl: RPC_URL },
  );
}

async function rpc(method: string, params: unknown[] = []) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

export const snapshot = () => rpc("evm_snapshot") as Promise<string>;
export const revert = (id: string) => rpc("evm_revert", [id]);
