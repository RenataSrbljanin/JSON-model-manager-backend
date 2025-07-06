import axios from "axios";

export const uploadJsonFile = async (formData: FormData) => {
  const res = await axios.post("http://localhost:5000/upload-json", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
