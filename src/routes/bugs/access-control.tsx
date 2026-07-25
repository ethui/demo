import { Button } from "@ethui/ui/components/shadcn/button";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, Play } from "lucide-react";
import { RawError } from "#/components/raw-error";
import {
  useReadOwnedRegistryValue,
  useWriteOwnedRegistrySetValue,
} from "#/wagmi.generated";

export const Route = createFileRoute("/bugs/access-control")({
  beforeLoad: () => ({ breadcrumb: "Access control" }),
  component: AccessControl,
});

function AccessControl() {
  const { data: value } = useReadOwnedRegistryValue();
  const { isPending, error, writeContract } = useWriteOwnedRegistrySetValue();

  return (
    <div className="flex flex-col gap-4">
      <p>
        Should set the registry value to 42. Current on-chain value:{" "}
        <code>{value === undefined ? "?" : String(value)}</code>
      </p>
      <div>
        <Button
          disabled={isPending}
          onClick={() => writeContract({ args: [42n] })}
        >
          {isPending ? <LoaderCircle className="animate-spin" /> : <Play />}
          Set value to 42
        </Button>
      </div>
      <RawError error={error} />
    </div>
  );
}
