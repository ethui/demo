import { Button } from "@ethui/ui/components/shadcn/button";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, Send } from "lucide-react";
import { encodeFunctionData } from "viem";
import { useChainId } from "wagmi";
import { RawError } from "#/components/raw-error";
import {
  ownedRegistryAbi,
  ownedRegistryAddress,
  useReadOwnedRegistryValue,
  useWriteForwarderForward,
} from "#/wagmi.generated";

export const Route = createFileRoute("/bugs/silent-failure")({
  beforeLoad: () => ({ breadcrumb: "Silent failure" }),
  component: SilentFailure,
});

function SilentFailure() {
  const chainId = useChainId();
  const { data: value, refetch } = useReadOwnedRegistryValue();
  const {
    data: hash,
    isPending,
    error,
    writeContract,
  } = useWriteForwarderForward();

  const registry =
    ownedRegistryAddress[chainId as keyof typeof ownedRegistryAddress];

  const onClick = () => {
    if (!registry) return;
    writeContract(
      {
        args: [
          registry,
          encodeFunctionData({
            abi: ownedRegistryAbi,
            functionName: "setValue",
            args: [42n],
          }),
        ],
      },
      { onSuccess: () => void refetch() },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <p>
        Should set the registry value to 42 by forwarding the call. Current
        on-chain value: <code>{value === undefined ? "?" : String(value)}</code>
      </p>
      <div>
        <Button disabled={!registry || isPending} onClick={onClick}>
          {isPending ? <LoaderCircle className="animate-spin" /> : <Send />}
          Forward setValue(42)
        </Button>
      </div>
      {hash && (
        <p className="text-sm">
          Transaction sent: <code>{hash}</code>
        </p>
      )}
      <RawError error={error} />
    </div>
  );
}
