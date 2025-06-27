import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useWalletClient } from "wagmi";

export const Route = createFileRoute("/ethui/getProviderState")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: providerState } = useEthuiProviderState();

  return (
    <div className="flex flex-col gap-2">
      <h2>ethui_getProviderState:</h2>
      <pre>{JSON.stringify(providerState, null, 2)}</pre>
    </div>
  );
}

function useEthuiProviderState() {
  const { data: client } = useWalletClient();

  return useQuery({
    queryKey: ["ethui_getProviderState", client?.key],
    queryFn: () => client?.request({ method: "ethui_getProviderState" } as any),
    enabled: !!client,
  });
}
