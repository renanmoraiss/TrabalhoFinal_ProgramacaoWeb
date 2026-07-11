export interface Player {
  id: string;
  name: string;
  team: string;
  photo: string | null;
  position: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSticker {
  id: string;
  userId: string;
  playerId: string;
  quantity: number;
  player: Player;
}

export interface Collection {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { items: number };
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  userStickerId: string;
  userSticker: UserSticker;
}

export interface CollectionDetail extends Collection {
  items: CollectionItem[];
}

export interface AlbumPosicao {
  player: Player;
  possuiNoInventario: boolean;
  userSticker: UserSticker | null;
}

export interface AlbumBrasil {
  team: string;
  totalPlayers: number;
  totalInventario: number;
  totalFaltando: number;
  porcentagem: number;
  posicoes: AlbumPosicao[];
}