import { Address, store } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/NFT/NFT";
import { Pokemon } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let id = event.params.tokenId.toString();

  // burn
  if (event.params.to.equals(Address.zero())) {
    store.remove("Pokemon", id);
    return;
  }

  let pokemon: Pokemon | null;

  if (event.params.from.equals(Address.zero())) {
    // mint
    pokemon = new Pokemon(id);
  } else {
    // existing pokemon
    pokemon = Pokemon.load(id);
  }

  if (!pokemon) {
    throw new Error("Pokemon not found");
  }

  pokemon.owner = event.params.to;
  pokemon.save();
}
