import React from "react";
import axios from "axios";

type Props = {
  data: Record<string, any>; // JSON podaci koje želiš da pošalješ
};

const ComputerSaveButton: React.FC<Props> = ({ data }) => {
  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:5000/save", data);
      alert("Uspešno sačuvano: " + response.data.filename);
    } catch (error: any) {
      console.error("Greška pri čuvanju:", error);
      alert("Greška pri čuvanju!");
    }
  };

  return (
    <button
      onClick={handleSave}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Sačuvaj izmene
    </button>
  );
};

export default ComputerSaveButton;
