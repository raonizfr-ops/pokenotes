"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { storageService } from "@/services/storage.service";
import { exportNotesToJSON, exportAllNotesToPDF } from "@/services/export.service";
import type { Note } from "@/types";

export default function ExportMenu() {
  const { agendas } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const getAllNotes = async (): Promise<Note[]> => {
    const allNotes: Note[] = [];
    for (const agenda of agendas) {
      const notes = await storageService.getNotes(agenda.id);
      allNotes.push(...notes);
    }
    return allNotes;
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const allNotes = await getAllNotes();
      exportNotesToJSON(allNotes, agendas);
    } catch (error) {
      console.error("Erro ao exportar JSON:", error);
      alert("Erro ao exportar JSON. Tente novamente.");
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const allNotes = await getAllNotes();
      await exportAllNotesToPDF(allNotes, agendas);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF. Tente novamente.");
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pixel-button bg-yellow-600 hover:bg-yellow-700"
      >
        EXPORTAR
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 z-50 pixel-card p-4 bg-white min-w-[200px]"
            >
              <h3 className="font-press-start text-xs text-slate-gray mb-3">
                EXPORTAR DADOS
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleExportJSON}
                  disabled={isExporting}
                  className="w-full pixel-button bg-blue-600 hover:bg-blue-700 text-xs disabled:opacity-50"
                >
                  {isExporting ? "Exportando..." : "JSON"}
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full pixel-button bg-red-600 hover:bg-red-700 text-xs disabled:opacity-50"
                >
                  {isExporting ? "Gerando..." : "PDF"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
