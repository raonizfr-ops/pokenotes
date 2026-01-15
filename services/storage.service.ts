import type { Agenda, Note, StorageService } from "@/types";

class LocalStorageService implements StorageService {
  private readonly AGENDAS_KEY = "pokenotes_agendas";
  private readonly NOTES_KEY = "pokenotes_notes";

  async getAgendas(): Promise<Agenda[]> {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.AGENDAS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async saveAgenda(agenda: Agenda): Promise<void> {
    if (typeof window === "undefined") return;
    const agendas = await this.getAgendas();
    const index = agendas.findIndex((a) => a.id === agenda.id);
    if (index >= 0) {
      agendas[index] = agenda;
    } else {
      agendas.push(agenda);
    }
    localStorage.setItem(this.AGENDAS_KEY, JSON.stringify(agendas));
  }

  async deleteAgenda(id: string): Promise<void> {
    if (typeof window === "undefined") return;
    const agendas = await this.getAgendas();
    const filtered = agendas.filter((a) => a.id !== id);
    localStorage.setItem(this.AGENDAS_KEY, JSON.stringify(filtered));
    
    // Delete all notes from this agenda
    const notes = await this.getAllNotes();
    const filteredNotes = notes.filter((n) => n.agendaId !== id);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(filteredNotes));
  }

  private async getAllNotes(): Promise<Note[]> {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.NOTES_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getNotes(agendaId: string): Promise<Note[]> {
    const allNotes = await this.getAllNotes();
    return allNotes.filter((n) => n.agendaId === agendaId);
  }

  async saveNote(note: Note): Promise<void> {
    if (typeof window === "undefined") return;
    const notes = await this.getAllNotes();
    const index = notes.findIndex((n) => n.id === note.id);
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.push(note);
    }
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  }

  async deleteNote(id: string): Promise<void> {
    if (typeof window === "undefined") return;
    const notes = await this.getAllNotes();
    const filtered = notes.filter((n) => n.id !== id);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(filtered));
  }
}

export const storageService = new LocalStorageService();
