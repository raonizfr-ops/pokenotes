"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import NoteEditor from "./NoteEditor";
import NoteList from "./NoteList";
import SearchBar from "./SearchBar";
import ExportMenu from "./ExportMenu";
import ImportMenu from "./ImportMenu";

export default function MainArea() {
  const {
    selectedAgendaId,
    selectedNoteId,
    searchQuery,
    setSearchQuery,
    getFilteredNotes,
    selectNote,
  } = useAppStore();

  const filteredNotes = getFilteredNotes();

  if (!selectedAgendaId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gameboy-green">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="font-press-start text-2xl text-slate-gray mb-4">
            SELECIONE UMA AGENDA
          </h2>
          <p className="font-vt323 text-xl text-slate-gray">
            Ou crie uma nova no menu lateral
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gameboy-green overflow-hidden">
      <div className="p-4 bg-slate-gray">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-press-start text-lg text-white">
            TRAINER&apos;S NOTEBOOK
          </h2>
          <div className="flex gap-2">
            <ImportMenu />
            <ExportMenu />
          </div>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r-4 border-gameboy-dark overflow-y-auto bg-gameboy-offwhite flex flex-col">
          <div className="p-4 border-b-4 border-gameboy-dark">
            <button
              onClick={() => selectNote(null)}
              className="w-full pixel-button bg-green-600 hover:bg-green-700"
            >
              + NOVA NOTA
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NoteList notes={filteredNotes} />
          </div>
        </div>
        <div className="flex-1">
          <NoteEditor noteId={selectedNoteId} />
        </div>
      </div>
    </div>
  );
}
