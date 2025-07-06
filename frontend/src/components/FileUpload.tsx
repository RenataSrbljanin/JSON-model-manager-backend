import React, { useState } from "react";
import { uploadJsonFile } from "../api/upload";

export default function FileUpload() {
  const [status, setStatus] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadJsonFile(formData);
      setStatus(`Uploaded: ${Object.keys(res.data).length} computers`);
    } catch (err) {
      setStatus("Error uploading file.");
    }
  };

  return (
    <div>
      <input type="file" data-testid="file-input" onChange={handleUpload} />
      <p data-testid="upload-status">{status}</p>
    </div>
  );
}
