import { createFileRoute } from "@tanstack/react-router";
import { useReadContract } from "wagmi";
import { RawError } from "#/components/raw-error";
import { testCallsAbi } from "#/wagmi.generated";

export const Route = createFileRoute("/bugs/stale-address")({
  beforeLoad: () => ({ breadcrumb: "Stale address" }),
  component: StaleAddress,
});

const STALE_ADDRESS = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720" as const;

function StaleAddress() {
  const { data, error } = useReadContract({
    address: STALE_ADDRESS,
    abi: testCallsAbi,
    functionName: "length_uintArry",
  });

  return (
    <div className="flex flex-col gap-4">
      <p>
        Should read <code>length_uintArry()</code> from TestCalls at{" "}
        <code>{STALE_ADDRESS}</code> and print 10.
      </p>
      {data !== undefined && <p>Value: {String(data)}</p>}
      <RawError error={error} />
    </div>
  );
}
