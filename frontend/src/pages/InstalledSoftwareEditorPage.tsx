import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InstalledSoftwareForm from "../components/InstalledSoftwareForm";
import {
  getInstalledSoftwareById,
  updateInstalledSoftware,
} from "../api/installedSoftware";
import type { InstalledSoftware } from "../api/installedSoftware";

export default function InstalledSoftwareEditorPage() {
  const { idn } = useParams<{ idn: string }>();
  const [software, setSoftware] = useState<InstalledSoftware | null>(null);

  useEffect(() => {
    if (idn) {
      getInstalledSoftwareById(idn).then(setSoftware);
    }
  }, [idn]);

  const handleSubmit = async (updated: InstalledSoftware) => {
    if (!software) return;
    await updateInstalledSoftware(software.idn, updated);
    alert("Software updated.");
  };

  if (!software) return <p>Loading...</p>;

  return <InstalledSoftwareForm software={software} onSubmit={handleSubmit} />;
}
