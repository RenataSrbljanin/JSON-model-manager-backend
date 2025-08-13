import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InstalledSoftwareForm from "../components/InstalledSoftwareForm";
import {
  getInstalledSoftwareById,
  updateInstalledSoftware_with_constant_computerIDN,
} from "../api/installedSoftware";
import type { Software } from "../types/software";

export default function InstalledSoftwareEditorPage() {
  const { idn } = useParams<{ idn: string }>();
  const [software, setSoftware] = useState<Software | null>(null);

  useEffect(() => {
    if (idn) {
      getInstalledSoftwareById(idn).then(setSoftware);
    }
  }, [idn]);

  const handleSubmit = async (updated: Software) => {
    if (!software) return;
    await updateInstalledSoftware_with_constant_computerIDN(software.idn, updated);
    alert("Software updated.");
  };

  if (!software) return <p>Loading...</p>;

  return <InstalledSoftwareForm software={software} onSubmit={handleSubmit} />;
}
