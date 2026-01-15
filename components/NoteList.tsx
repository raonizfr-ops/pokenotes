"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useAppStore } from "@/store/useAppStore";
import type { Note } from "@/types";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const { selectedNoteId, selectNote, deleteNote } = useAppStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm === id) {
      await deleteNote(id);
      setShowDeleteConfirm(null);
    } else {
      setShowDeleteConfirm(id);
      setTimeout(() => setShowDeleteConfirm(null), 3000);
    }
  };

  if (notes.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="font-vt323 text-lg text-slate-gray">
          Nenhuma nota encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {notes.map((note) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`pixel-card p-3 cursor-pointer transition-all ${
            selectedNoteId === note.id
              ? "bg-poke-red text-white"
              : "bg-gameboy-offwhite text-slate-gray hover:bg-yellow-50"
          }`}
          onClick={() => selectNote(note.id)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-press-start text-xs truncate mb-1">
                {note.title || "Sem título"}
              </h3>
              <p className="font-vt323 text-sm line-clamp-2 text-gray-600">
                {note.content}
              </p>
              <p className="font-vt323 text-xs mt-2 text-gray-500">
                {format(new Date(note.updatedAt), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(note.id, e)}
              className={`pixel-button text-xs py-1 px-2 ${
                showDeleteConfirm === note.id
                  ? "bg-red-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {showDeleteConfirm === note.id ? "Confirmar" : "Excluir"}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
