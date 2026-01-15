"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import type { Agenda } from "@/types";

export default function Sidebar() {
  const {
    agendas,
    selectedAgendaId,
    loadAgendas,
    createAgenda,
    updateAgenda,
    deleteAgenda,
    selectAgenda,
  } = useAppStore();

  const [newAgendaName, setNewAgendaName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAgendas();
  }, [loadAgendas]);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleCreateAgenda = async () => {
    if (newAgendaName.trim()) {
      await createAgenda(newAgendaName.trim());
      setNewAgendaName("");
    }
  };

  const handleStartEdit = (agenda: Agenda) => {
    setEditingId(agenda.id);
    setEditName(agenda.name);
  };

  const handleSaveEdit = async () => {
    if (editingId && editName.trim()) {
      await updateAgenda(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = async (id: string) => {
    await deleteAgenda(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="w-80 bg-slate-gray text-white flex flex-col pixel-border">
      <div className="p-4 bg-poke-red">
        <h1 className="font-press-start text-lg text-center">POKÉDEX</h1>
        <p className="font-vt323 text-sm text-center mt-2">Agendas Capturadas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {agendas.map((agenda) => (
          <motion.div
            key={agenda.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`pixel-card p-3 cursor-pointer transition-all ${
              selectedAgendaId === agenda.id
                ? "bg-poke-red text-white"
                : "bg-gameboy-offwhite text-slate-gray"
            }`}
            onClick={() => !editingId && selectAgenda(agenda.id)}
          >
            <div className="flex items-center gap-3">
              <Image
                src={agenda.pokemonSprite}
                alt={`Pokémon ${agenda.pokemonId}`}
                width={48}
                height={48}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${agenda.pokemonId}.png`;
                }}
              />
              <div className="flex-1 min-w-0">
                {editingId === agenda.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    className="w-full pixel-input text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <h3
                      className="font-press-start text-xs truncate"
                      onDoubleClick={() => handleStartEdit(agenda)}
                    >
                      {agenda.name}
                    </h3>
                    <p className="font-vt323 text-xs mt-1">
                      {format(new Date(agenda.updatedAt), "dd/MM/yyyy")}
                    </p>
                  </>
                )}
              </div>
              {!editingId && (
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(agenda);
                    }}
                    className="pixel-button text-xs py-1 px-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(agenda.id);
                    }}
                    className="pixel-button text-xs py-1 px-2 bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <div
              className="pixel-card p-6 bg-white text-slate-gray max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-press-start text-sm mb-4">
                Confirmar Exclusão?
              </h3>
              <p className="font-vt323 text-lg mb-4">
                Esta ação não pode ser desfeita!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="pixel-button flex-1 bg-red-600"
                >
                  Sim
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="pixel-button flex-1 bg-gray-600"
                >
                  Não
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t-4 border-gameboy-dark bg-slate-gray">
        <div className="flex gap-2">
          <input
            type="text"
            value={newAgendaName}
            onChange={(e) => setNewAgendaName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateAgenda();
            }}
            placeholder="Nova Agenda..."
            className="flex-1 pixel-input"
          />
          <button
            onClick={handleCreateAgenda}
            className="pixel-button bg-green-600 hover:bg-green-700"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
