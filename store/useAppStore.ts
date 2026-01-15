import { create } from "zustand";
import type { Agenda, Note } from "@/types";
import { storageService } from "@/services/storage.service";
import { getRandomPokemon } from "@/services/pokemon.service";
import { format } from "date-fns";

interface AppState {
  agendas: Agenda[];
  notes: Note[];
  selectedAgendaId: string | null;
  selectedNoteId: string | null;
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  loadAgendas: () => Promise<void>;
  loadNotes: (agendaId: string) => Promise<void>;
  createAgenda: (name: string) => Promise<void>;
  updateAgenda: (id: string, name: string) => Promise<void>;
  deleteAgenda: (id: string) => Promise<void>;
  selectAgenda: (id: string | null) => void;
  createNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  selectNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Computed
  getFilteredNotes: () => Note[];
  getTotalNotesCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  agendas: [],
  notes: [],
  selectedAgendaId: null,
  selectedNoteId: null,
  searchQuery: "",
  isLoading: false,

  loadAgendas: async () => {
    set({ isLoading: true });
    try {
      const agendas = await storageService.getAgendas();
      set({ agendas, isLoading: false });
    } catch (error) {
      console.error("Error loading agendas:", error);
      set({ isLoading: false });
    }
  },

  loadNotes: async (agendaId: string) => {
    set({ isLoading: true });
    try {
      const notes = await storageService.getNotes(agendaId);
      set({ notes, isLoading: false });
    } catch (error) {
      console.error("Error loading notes:", error);
      set({ isLoading: false });
    }
  },

  createAgenda: async (name: string) => {
    const pokemon = getRandomPokemon();
    const now = new Date().toISOString();
    const agenda: Agenda = {
      id: `agenda-${Date.now()}`,
      name,
      pokemonId: pokemon.id,
      pokemonSprite: pokemon.sprite,
      createdAt: now,
      updatedAt: now,
    };
    
    await storageService.saveAgenda(agenda);
    const agendas = await storageService.getAgendas();
    set({ agendas });
  },

  updateAgenda: async (id: string, name: string) => {
    const agendas = get().agendas;
    const agenda = agendas.find((a) => a.id === id);
    if (!agenda) return;

    const updated: Agenda = {
      ...agenda,
      name,
      updatedAt: new Date().toISOString(),
    };

    await storageService.saveAgenda(updated);
    const updatedAgendas = await storageService.getAgendas();
    set({ agendas: updatedAgendas });
  },

  deleteAgenda: async (id: string) => {
    await storageService.deleteAgenda(id);
    const agendas = await storageService.getAgendas();
    const selectedAgendaId = get().selectedAgendaId;
    
    set({
      agendas,
      selectedAgendaId: selectedAgendaId === id ? null : selectedAgendaId,
      notes: [],
      selectedNoteId: null,
    });
  },

  selectAgenda: async (id: string | null) => {
    set({ selectedAgendaId: id, selectedNoteId: null, notes: [] });
    if (id) {
      await get().loadNotes(id);
    }
  },

  createNote: async (title: string, content: string) => {
    const agendaId = get().selectedAgendaId;
    if (!agendaId) return;

    const now = new Date().toISOString();
    const note: Note = {
      id: `note-${Date.now()}`,
      agendaId,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    await storageService.saveNote(note);
    await get().loadNotes(agendaId);
  },

  updateNote: async (id: string, title: string, content: string) => {
    const notes = get().notes;
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    const updated: Note = {
      ...note,
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    await storageService.saveNote(updated);
    const agendaId = get().selectedAgendaId;
    if (agendaId) {
      await get().loadNotes(agendaId);
    }
  },

  deleteNote: async (id: string) => {
    await storageService.deleteNote(id);
    const agendaId = get().selectedAgendaId;
    if (agendaId) {
      await get().loadNotes(agendaId);
    }
    set({ selectedNoteId: null });
  },

  selectNote: (id: string | null) => {
    set({ selectedNoteId: id });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getFilteredNotes: () => {
    const { notes, searchQuery } = get();
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  },

  getTotalNotesCount: () => {
    return get().notes.length;
  },
}));
