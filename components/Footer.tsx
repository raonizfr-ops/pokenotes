"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { storageService } from "@/services/storage.service";

export default function Footer() {
  const { notes, agendas } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("Trainer");
  const [totalNotes, setTotalNotes] = useState(0);

  useEffect(() => {
    // Pega o nome do usuário do localStorage ou pede
    const storedName = localStorage.getItem("pokenotes_trainer_name");
    if (storedName) {
      setUserName(storedName);
    } else {
      const name = prompt("Qual seu nome?") || "Trainer";
      setUserName(name);
      localStorage.setItem("pokenotes_trainer_name", name);
    }

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Calculate total notes
    const calculateTotalNotes = async () => {
      let total = 0;
      for (const agenda of agendas) {
        const agendaNotes = await storageService.getNotes(agenda.id);
        total += agendaNotes.length;
      }
      setTotalNotes(total);
    };

    calculateTotalNotes();

    return () => clearInterval(interval);
  }, [agendas, notes]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="h-12 bg-slate-gray border-t-4 border-gameboy-dark flex items-center justify-between px-4 text-white">
      <div className="flex items-center gap-4 font-vt323 text-lg">
        <span>
          <strong className="font-press-start text-xs">TRAINER:</strong> {userName}
        </span>
        <span className="hidden md:inline">
          <strong className="font-press-start text-xs">HORA:</strong> {formatTime(currentTime)}
        </span>
      </div>
      <div className="font-vt323 text-lg">
        <strong className="font-press-start text-xs">NOTAS:</strong> {totalNotes}
      </div>
    </div>
  );
}
