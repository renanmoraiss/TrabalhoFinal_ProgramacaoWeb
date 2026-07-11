import { Player } from "@prisma/client";

/** Tamanho padrão de um pacote (quantas figurinhas vêm por abertura). */
export const DEFAULT_PACK_SIZE = 5;

/**
 * sorteio do pacotinho
 * recebe uma lista de jogadores e um N, devolve N figurinhas sorteadas.
 * com repetida
 */
export function drawPack(
  players: Player[],
  count: number = DEFAULT_PACK_SIZE,
): Player[] {
  if (count <= 0) {
    return [];
  }

  if (players.length === 0) {
    throw new Error("Não há jogadores disponíveis para sortear.");
  }

  const drawn: Player[] = [];

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * players.length);
    drawn.push(players[index]);
  }

  return drawn;
}