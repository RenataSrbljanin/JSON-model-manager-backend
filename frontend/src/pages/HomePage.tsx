import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllComputers } from "../api/computers";
import type { Computer } from "../api/computers";

export default function HomePage() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllComputers()
      .then((data) => {
        setComputers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju računara:", err);
        setError("Greška pri učitavanju računara.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Učitavanje računara...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Izaberi računar za uređivanje</h1>
      <select
        onChange={(e) => {
          const selectedIdn = e.target.value;
          if (selectedIdn) navigate(`/computers/${selectedIdn}`);
        }}
        defaultValue=""
        className="border p-2 rounded"
      >
        <option value="">-- Izaberi računar --</option>
        {computers.map((comp) => (
          <option key={comp.idn} value={comp.idn}>
            {comp.name} ({comp.idn})
          </option>
        ))}
      </select>
    </div>
  );
}
