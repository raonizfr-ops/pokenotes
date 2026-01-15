"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { storageService } from "@/services/storage.service";
import type { Note, Agenda } from "@/types";

export default function ImportMenu() {
  const { loadAgendas } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.agendas || !data.notes) {
        throw new Error("Formato de arquivo inválido");
      }

      // Import agendas
      for (const agenda of data.agendas as Agenda[]) {
        await storageService.saveAgenda(agenda);
      }

      // Import notes
      for (const note of data.notes as Note[]) {
        await storageService.saveNote(note);
      }

      await loadAgendas();
      alert("Dados importados com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao importar:", error);
      alert("Erro ao importar dados. Verifique se o arquivo está no formato correto.");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          fileInputRef.current?.click();
        }}
        disabled={isImporting}
        className="pixel-button bg-green-600 hover:bg-green-700 disabled:opacity-50"
      >
        {isImporting ? "Importando..." : "IMPORTAR"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
