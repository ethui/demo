import { Button } from "@ethui/ui/components/shadcn/button";
import { Input } from "@ethui/ui/components/shadcn/input";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";
import { parseEther } from "viem";
import { RawError } from "#/components/raw-error";
import { useWriteSixDecimalTokenTransfer } from "#/wagmi.generated";

export const Route = createFileRoute("/bugs/decimals")({
  beforeLoad: () => ({ breadcrumb: "Decimals" }),
  component: Decimals,
});

const BOB = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as const;

function Decimals() {
  const [amount, setAmount] = useState("100");
  const [parseError, setParseError] = useState<unknown>(null);
  const { isPending, error, writeContract } = useWriteSixDecimalTokenTransfer();

  const onClick = () => {
    setParseError(null);
    try {
      writeContract({ args: [BOB, parseEther(amount)] });
    } catch (e) {
      setParseError(e);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p>Should transfer $TUSD to bob. The account holds 100 $TUSD.</p>
      <div className="flex gap-2">
        <Input
          className="w-32"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button disabled={isPending} onClick={onClick}>
          {isPending ? <LoaderCircle className="animate-spin" /> : <Send />}
          Transfer
        </Button>
      </div>
      <RawError error={parseError ?? error} />
    </div>
  );
}
