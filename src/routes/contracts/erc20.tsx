import { Button } from "@ethui/ui/components/shadcn/button";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import {
  useReadTokenBalanceOf,
  useWatchTokenTransferEvent,
  useWriteTokenBurn,
  useWriteTokenMint,
} from "#/wagmi.generated";

export const Route = createFileRoute("/contracts/erc20")({
  beforeLoad: () => ({ breadcrumb: "ERC20" }),
  component: ERC20,
});

function ERC20() {
  return (
    <>
      <Mint />
      <Burn />
      <Balance />
    </>
  );
}

function Mint() {
  const { address } = useAccount();
  const { isPending, writeContract } = useWriteTokenMint();

  const onClick = async () => {
    if (!address) return;
    writeContract({ args: [address, BigInt(1e18)] });
  };

  return (
    <div className="flex gap-2">
      <Button disabled={!address || isPending} onClick={onClick}>
        {isPending ? <LoaderCircle className="animate-spin" /> : <Check />}
        Mint $TEST
      </Button>
    </div>
  );
}

function Burn() {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const { isPending, writeContract } = useWriteTokenBurn();

  const onClick = async () => {
    if (!address || !amount) return;
    writeContract({
      args: [address, parseEther(amount)],
    });
  };

  return (
    <div className="flex gap-2">
      <input
        className="rounded border px-2"
        data-testid="burn-amount"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="amount"
        value={amount}
      />
      <Button
        data-testid="burn-submit"
        disabled={!address || !amount || isPending}
        onClick={onClick}
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : <Flame />}
        Burn $TEST
      </Button>
    </div>
  );
}

function Balance() {
  const { address } = useAccount();
  const { data: balance, refetch } = useReadTokenBalanceOf({
    args: address && [address ?? "0x0"],
  });

  useWatchTokenTransferEvent({
    pollingInterval: 100,
    onLogs: () => {
      refetch().catch(console.error);
    },
  });

  if (!balance) return null;

  return <p data-testid="balance">Balances: {formatEther(balance)}</p>;
}
