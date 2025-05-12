import { Button } from "@ethui/ui/components/shadcn/button";
import { createFileRoute } from "@tanstack/react-router";
import { Check, LoaderCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { useReadNftTokenUri, useWriteNftMint } from "#/wagmi.generated";
import {
  useReadNftListTokensByAddress,
  useWatchNftTransferEvent,
} from "#/wagmi.generated";

import { getBuiltGraphSDK } from "../../../.graphclient/";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../__root";

const sdk = getBuiltGraphSDK();

export const Route = createFileRoute("/contracts/erc721")({
  beforeLoad: () => ({ breadcrumb: "ERC721" }),
  component: ERC721,
});

function ERC721() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-bold text-2xl">Mint</h2>
        <Mint />
      </div>
      <div>
        <h2 className="font-bold text-2xl">Owned</h2>
        <Owned />
      </div>
      <div>
        <h2 className="font-bold text-2xl">All</h2>
        <All />
      </div>
    </div>
  );
}

function Mint() {
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteNftMint();

  const onClick = async () => {
    if (!address) return;
    writeContract({ args: [address] });
    queryClient.invalidateQueries(["AllPokemon"]);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button disabled={!address || isPending} onClick={onClick}>
          {isPending ? <LoaderCircle className="animate-spin" /> : <Check />}
          Mint Pokemon
        </Button>
      </div>
    </>
  );
}

function Owned() {
  const { address } = useAccount();
  const { data: owned, refetch } = useReadNftListTokensByAddress({
    args: [address ?? "0x0"],
  });

  useWatchNftTransferEvent({
    pollingInterval: 100,
    onLogs: () => {
      refetch().catch(console.error);
    },
  });

  if (!owned) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {owned.map((id) => (
        <Single key={id} id={id.toString()} />
      ))}
    </div>
  );
}

function All() {
  const { data } = useQuery({
    queryKey: ["AllPokemon"],
    queryFn: () => sdk.AllPokemon(),
  });

  if (!data) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {data.pokemons.map(({ id }) => (
        <Single key={id} id={id} />
      ))}
    </div>
  );
}

function Single({ id }: { id: string }) {
  const { data: uri } = useReadNftTokenUri({ args: [id.toString()] });
  const metadata = decodeMetadata(uri);

  if (!metadata) return null;

  return (
    <img
      key={metadata.image}
      alt={metadata.name}
      src={metadata.image}
      srcSet={metadata.image}
      width={50}
    />
  );
}

export interface Metadata {
  name: string;
  image: string;
}

export function decodeMetadata(encoded?: string): Metadata {
  return (
    encoded &&
    JSON.parse(
      window.atob(encoded.replace("data:application/json;base64,", "")),
    )
  );
}
