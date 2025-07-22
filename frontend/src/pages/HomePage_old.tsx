import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import { getAllComputers } from "../api/computers";
import type { Computer } from "../types/computer";

export default function HomePage() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [selectedIdn, setSelectedIdn] = useState<string>("");
  const navigate = useNavigate();

  const fetchComputers = async () => {
    try {
      const comps = await getAllComputers();
      setComputers(comps);
    } catch (err) {
      console.error("Greška pri učitavanju računara:", err);
    }
  };

  useEffect(() => {
    fetchComputers();
  }, []);

  const handleSelect = () => {
    if (selectedIdn) {
      navigate(`/computers/${selectedIdn}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Učitaj JSON fajl</h1>
      <FileUpload onUploadSuccess={fetchComputers} />

      <h2 className="text-xl font-semibold">Izaberi računar za izmenu</h2>
      <div className="flex items-center gap-4">
        <select
          className="border px-2 py-1 rounded"
          value={selectedIdn}
          onChange={(e) => setSelectedIdn(e.target.value)}
        >
          <option value="">-- Odaberi računar --</option>
          {computers.map((comp) => (
            <option key={comp.idn} value={comp.idn}>
              {comp.idn}
            </option>
          ))}
        </select>
        <button
          onClick={handleSelect}
          disabled={!selectedIdn}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Izmeni
        </button>
      </div>
    </div>
  );
}
