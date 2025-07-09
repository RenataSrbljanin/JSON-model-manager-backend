import React, { useState } from "react";
import { uploadJsonFile } from "../api/upload";

type Props = {
  onUploadSuccess?: () => void;
};

export default function FileUpload({ onUploadSuccess }: Props) {
  const [status, setStatus] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadJsonFile(formData);
      console.log("Upload response:", res);

      // ✅ Prikaži poruku iz backend-a
      setStatus(`✅ ${res.message}`);

      // 🔁 Osveži prikaz računara u aplikaciji
      if (onUploadSuccess) await onUploadSuccess();
    } catch (err) {
      console.error("Greška pri uploadu:", err);
      setStatus("❌ Greška pri uploadu fajla.");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        type="file"
        accept=".json"
        onChange={handleUpload}
        className="border px-2 py-1 rounded w-fit"
      />
      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  );
}
