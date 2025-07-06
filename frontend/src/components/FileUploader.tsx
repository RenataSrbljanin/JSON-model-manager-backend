// src/components/FileUploader.tsx
import { useState } from "react";
import axios from "axios";

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:5000/upload-json", formData);
    console.log("Server response:", res.data);
    // TODO: Prikaz rezultata, prosledi state roditelju
  };

  return (
    <div>
      <input
        type="file"
        accept=".json"
        onChange={(e) => {
          if (e.target.files) setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>Upload JSON</button>
    </div>
  );
}
