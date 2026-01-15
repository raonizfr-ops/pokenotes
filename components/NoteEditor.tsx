"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import MarkdownPreview from "./MarkdownPreview";
import { exportNoteToPDF } from "@/services/export.service";

interface NoteEditorProps {
  noteId: string | null;
}

export default function NoteEditor({ noteId }: NoteEditorProps) {
  const { notes, selectedAgendaId, createNote, updateNote, selectNote } =
    useAppStore();

  const note = notes.find((n) => n.id === noteId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSave = async () => {
    if (!selectedAgendaId) return;

    setIsSaving(true);
    
    if (noteId && note) {
      await updateNote(noteId, title, content);
    } else {
      if (title.trim() || content.trim()) {
        await createNote(title.trim() || "Nova Nota", content);
        setTitle("");
        setContent("");
      }
    }

    setIsSaving(false);
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 2000);
  };

  if (!selectedAgendaId) {
    return (
      <div className="h-full flex items-center justify-center bg-gameboy-offwhite">
        <p className="font-vt323 text-xl text-slate-gray">
          Selecione uma agenda
        </p>
      </div>
    );
  }

  if (!noteId) {
    return (
      <div className="h-full flex flex-col bg-gameboy-offwhite">
        <div className="p-4 bg-slate-gray">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-press-start text-sm text-white">
              NOVA NOTA
            </h3>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 pixel-border bg-white p-1">
                <button
                  onClick={() => setViewMode("edit")}
                  className={`px-2 py-1 font-press-start text-xs ${
                    viewMode === "edit"
                      ? "bg-poke-red text-white"
                      : "bg-transparent text-slate-gray"
                  }`}
                >
                  EDIT
                </button>
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-2 py-1 font-press-start text-xs ${
                    viewMode === "preview"
                      ? "bg-poke-red text-white"
                      : "bg-transparent text-slate-gray"
                  }`}
                >
                  PREVIEW
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={`px-2 py-1 font-press-start text-xs ${
                    viewMode === "split"
                      ? "bg-poke-red text-white"
                      : "bg-transparent text-slate-gray"
                  }`}
                >
                  SPLIT
                </button>
              </div>
              <button
                onClick={() => {
                  setTitle("");
                  setContent("");
                  selectNote(null);
                }}
                className="pixel-button bg-blue-600 hover:bg-blue-700"
              >
                NOVA
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || (!title.trim() && !content.trim())}
                className="pixel-button bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? "SALVANDO..." : "SALVAR"}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            <div>
              <label className="font-press-start text-xs text-slate-gray block mb-2">
                TÍTULO
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título..."
                className="w-full pixel-input text-lg"
              />
            </div>
            <div>
              <label className="font-press-start text-xs text-slate-gray block mb-2">
                CONTEÚDO {viewMode !== "edit" && "(Markdown)"}
              </label>
              <div
                className={`${
                  viewMode === "split" ? "grid grid-cols-2 gap-4" : ""
                }`}
              >
                {(viewMode === "edit" || viewMode === "split") && (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Digite sua nota aqui em Markdown..."
                    className="w-full pixel-input text-lg min-h-[400px] resize-none font-mono"
                  />
                )}
                {(viewMode === "preview" || viewMode === "split") && (
                  <div className="pixel-card p-4 min-h-[400px] bg-white overflow-y-auto">
                    {content ? (
                      <MarkdownPreview content={content} />
                    ) : (
                      <p className="font-vt323 text-gray-400">
                        Preview aparecerá aqui
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="pixel-card p-6 bg-poke-red text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <h2 className="font-press-start text-xl mb-2">LEVEL UP!</h2>
                  <p className="font-vt323 text-lg">Nota salva!</p>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                    className="h-2 bg-white mt-4"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gameboy-offwhite">
      <div className="p-4 bg-slate-gray">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-press-start text-sm text-white">
            EDITAR NOTA
          </h3>
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1 pixel-border bg-white p-1">
              <button
                onClick={() => setViewMode("edit")}
                className={`px-2 py-1 font-press-start text-xs ${
                  viewMode === "edit"
                    ? "bg-poke-red text-white"
                    : "bg-transparent text-slate-gray"
                }`}
              >
                EDIT
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`px-2 py-1 font-press-start text-xs ${
                  viewMode === "preview"
                    ? "bg-poke-red text-white"
                    : "bg-transparent text-slate-gray"
                }`}
              >
                PREVIEW
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`px-2 py-1 font-press-start text-xs ${
                  viewMode === "split"
                    ? "bg-poke-red text-white"
                    : "bg-transparent text-slate-gray"
                }`}
              >
                SPLIT
              </button>
            </div>
            <button
              onClick={async () => {
                if (title && content) {
                  await exportNoteToPDF(title, content);
                }
              }}
              disabled={!title || !content}
              className="pixel-button bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs"
            >
              PDF
            </button>
            <button
              onClick={() => {
                setTitle("");
                setContent("");
                selectNote(null);
              }}
              className="pixel-button bg-blue-600 hover:bg-blue-700"
            >
              NOVA
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="pixel-button bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? "SALVANDO..." : "SALVAR"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <label className="font-press-start text-xs text-slate-gray block mb-2">
              TÍTULO
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título..."
              className="w-full pixel-input text-lg"
            />
          </div>

          <div>
            <label className="font-press-start text-xs text-slate-gray block mb-2">
              CONTEÚDO {viewMode !== "edit" && "(Markdown)"}
            </label>
            <div
              className={`${
                viewMode === "split" ? "grid grid-cols-2 gap-4" : ""
              }`}
            >
              {(viewMode === "edit" || viewMode === "split") && (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite sua nota aqui em Markdown..."
                  className="w-full pixel-input text-lg min-h-[400px] resize-none font-mono"
                />
              )}
              {(viewMode === "preview" || viewMode === "split") && (
                <div className="pixel-card p-4 min-h-[400px] bg-white overflow-y-auto">
                  {content ? (
                    <MarkdownPreview content={content} />
                  ) : (
                    <p className="font-vt323 text-gray-400">
                      Preview aparecerá aqui...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="pixel-card p-6 bg-poke-red text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <h2 className="font-press-start text-xl mb-2">LEVEL UP!</h2>
                <p className="font-vt323 text-lg">Nota salva com sucesso!</p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                  className="h-2 bg-white mt-4"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
