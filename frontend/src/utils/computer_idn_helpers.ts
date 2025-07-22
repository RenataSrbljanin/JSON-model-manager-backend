// Tip za parsiranje
export type ParsedComputerIdn = {
  labelLevels: string[]; // npr. ["finance", "internal"]
  deviceIndex: number; // broj koji dolazi odmah posle labela
  networkIdn: number; // poslednja cifra
  suffix?: string; // opcionalni deo posle #, npr. "3"
};

// Funkcija koja parsira idn
export function parseComputerIdn(idn: string): ParsedComputerIdn {
  const [main, suffix] = idn.split("#");
  const parts = main.split(":");

  if (parts.length < 3) {
    throw new Error(`IDN format nije validan: ${idn}`);
  }

  const labelLevels = parts.slice(0, parts.length - 2);
  const deviceIndex = parseInt(parts[parts.length - 2], 10);
  const networkIdn = parseInt(parts[parts.length - 1], 10);

  return {
    labelLevels,
    deviceIndex: deviceIndex,
    networkIdn,
    suffix,
  };
}

// Funkcija koja generiše idn iz delova
export function generateComputerIdn(labelLevels: string[], deviceIndex: number, networkIdn: number, suffix?: string): string {
  if (deviceIndex == null) alert("deviceIndex je prazan!");
  if (networkIdn == null) alert("networkIdn je prazan!");

  const filteredLabels = labelLevels.filter((l) => l !== ""); // uklanja prazne
  const main = [...filteredLabels, deviceIndex.toString(), networkIdn.toString()].join(":");
  return suffix ? `${main}#${suffix}` : main;
}

