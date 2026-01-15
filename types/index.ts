export interface Note {
  id: string;
  agendaId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agenda {
  id: string;
  name: string;
  pokemonId: number;
  pokemonSprite: string;
  createdAt: string;
  updatedAt: string;
}

export interface PokemonMetadata {
  id: number;
  sprite: string;
}

export interface StorageService {
  getAgendas(): Promise<Agenda[]>;
  saveAgenda(agenda: Agenda): Promise<void>;
  deleteAgenda(id: string): Promise<void>;
  getNotes(agendaId: string): Promise<Note[]>;
  saveNote(note: Note): Promise<void>;
  deleteNote(id: string): Promise<void>;
}
