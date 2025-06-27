import { Form } from "@ethui/ui/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { type Address, getAddress } from "viem";
import { useWalletClient } from "wagmi";
import { z } from "zod";

export const Route = createFileRoute("/ethui/getContractAbi")({
  component: RouteComponent,
});

const schema = z.object({
  address: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

function RouteComponent() {
  const form = useForm<Schema>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: { address: "" },
  });

  const [current, setCurrent] = useState<Address | null>(null);

  const onSubmit = (data: FieldValues) => {
    setCurrent(getAddress(data.address));
  };

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex w-full gap-2">
        <Form.Text label="address" name="address" className="w-full" />
        <Form.Submit label="Query" />
      </Form>
      {current && <Result address={current} key={current} />}
    </>
  );
}

function Result({ address }: { address: Address }) {
  const { data: abi } = useEthuiGetContracAbi(address);

  return <pre>{JSON.stringify(abi, null, 2)}</pre>;
}

function useEthuiGetContracAbi(address: Address) {
  const { data: client } = useWalletClient();

  return useQuery({
    queryKey: ["ethui_getContractAbi", address],
    queryFn: () =>
      client?.request({
        method: "ethui_getContractAbi",
        params: { address },
      } as any),
    enabled: !!client,
  });
}
