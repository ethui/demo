import { Form } from "@ethui/ui/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { z } from "zod";

export const Route = createFileRoute("/signatures/plume")({
  component: Basic,
});

const schema = z.object({
  message: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

function Basic() {
  const { data: client } = useWalletClient();
  const { address } = useAccount();
  const [data, setData] = useState<any>();

  const form = useForm<Schema>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });

  console.log(data);

  if (!address || !client) return null;

  const onSubmit = (data: FieldValues) => {
    client
      .request({
        method: "eth_signPlume" as any,
        params: [address, data.message],
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((r) => console.log(r));
  };

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex w-full gap-2">
        <h2>Sign String</h2>
        <Form.Textarea label="Message" name="message" className="w-full" />
        <Form.Submit label="Sign Message" />
      </Form>
      <p>{JSON.stringify(data)}</p>
    </>
  );
}
