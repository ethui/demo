import { Button } from "@ethui/ui/components/shadcn/button";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, PiggyBank } from "lucide-react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { RawError } from "#/components/raw-error";
import { useReadVaultDeposits, useWriteVaultDeposit } from "#/wagmi.generated";

export const Route = createFileRoute("/bugs/allowance")({
  beforeLoad: () => ({ breadcrumb: "Allowance" }),
  component: Allowance,
});

function Allowance() {
  const { address } = useAccount();
  const { data: deposited } = useReadVaultDeposits({
    args: address && [address],
  });
  const { isPending, error, writeContract } = useWriteVaultDeposit();

  return (
    <div className="flex flex-col gap-4">
      <p>
        Should deposit 10 $VLT into the vault. Deposited so far:{" "}
        <code>{deposited === undefined ? "?" : formatEther(deposited)}</code>
      </p>
      <div>
        <Button
          disabled={!address || isPending}
          onClick={() => writeContract({ args: [parseEther("10")] })}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <PiggyBank />
          )}
          Deposit 10 $VLT
        </Button>
      </div>
      <RawError error={error} />
    </div>
  );
}
