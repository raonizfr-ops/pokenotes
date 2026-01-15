import type { Note, Agenda } from "@/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportNotesToJSON = (notes: Note[], agendas: Agenda[]): void => {
  const data = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    agendas,
    notes,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pokenotes-export-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportNoteToPDF = async (
  title: string,
  content: string
): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  // Add title
  pdf.setFontSize(18);
  pdf.text(title, margin, margin + 10);

  // Add content (simple text for now)
  pdf.setFontSize(12);
  const lines = pdf.splitTextToSize(content, maxWidth);
  let y = margin + 20;

  lines.forEach((line: string) => {
    if (y > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, margin, y);
    y += 7;
  });

  pdf.save(`${title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
};

export const exportAllNotesToPDF = async (
  notes: Note[],
  agendas: Agenda[]
): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  let y = margin;

  agendas.forEach((agenda) => {
    const agendaNotes = notes.filter((n) => n.agendaId === agenda.id);
    
    if (agendaNotes.length === 0) return;

    // Add agenda header
    if (y > pageHeight - 40) {
      pdf.addPage();
      y = margin;
    }

    pdf.setFontSize(16);
    pdf.setTextColor(255, 0, 0); // Red
    pdf.text(agenda.name, margin, y);
    y += 10;

    agendaNotes.forEach((note) => {
      // Check if we need a new page
      if (y > pageHeight - 60) {
        pdf.addPage();
        y = margin;
      }

      // Note title
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text(note.title, margin + 5, y);
      y += 8;

      // Note content
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(note.content, maxWidth - 10);
      lines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin + 5, y);
        y += 5;
      });

      y += 5; // Space between notes
    });

    y += 10; // Space between agendas
  });

  pdf.save(`pokenotes-all-${new Date().toISOString().split("T")[0]}.pdf`);
};
