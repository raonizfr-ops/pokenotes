"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar notas..."
        className="w-full pixel-input pr-10"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-vt323 text-xl">
        Buscar
      </span>
    </div>
  );
}
