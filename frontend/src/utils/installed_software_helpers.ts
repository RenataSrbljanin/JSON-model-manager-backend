import type { InstalledSoftware } from "../api/installedSoftware";



 // Parsira UUID iz starog idn stringa
function extractUUIDFromIdn(idn: string): string {
  const match = idn.match(/#([a-f0-9\-]+)$/i);
  return match ? match[1] : crypto.randomUUID(); // fallback ako ne postoji
}
 // Generiše novi IDN na osnovu trenutnog softverskog objekta
export function generateInstalledSoftwareIdn(software: InstalledSoftware): string
{
  const uuid = extractUUIDFromIdn(software.idn);
  const base = software.computer_idn;
  const cpe = software.cpe_idn;

  return `${base}>${cpe}#${uuid}`;
}

 // Parsira index iz idn_variant (npr. "cpe:/a:microsoft...#1" -> 1)
function extractIndexFromVariant(variant: string): number
{
  const match = variant.match(/#(\d+)$/);
  return match ? parseInt(match[1]) : 0;
}
// Generiše novi idn_variant (koristi cpe_idn i index)
export function generateInstalledSoftwareVariant(software: InstalledSoftware): string
{
  const index = extractIndexFromVariant(software.idn_variant);
  return `${software.cpe_idn}#${index}`;
}



