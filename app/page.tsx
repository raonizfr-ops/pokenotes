"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import MainArea from "@/components/MainArea";
import Footer from "@/components/Footer";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const loadAgendas = useAppStore((state) => state.loadAgendas);

  useEffect(() => {
    loadAgendas();
  }, [loadAgendas]);

  return (
    <div className="flex flex-col h-screen bg-gameboy-green overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainArea />
      </div>
      <Footer />
    </div>
  );
}
