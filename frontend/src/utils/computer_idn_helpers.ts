// Tip za parsiranje
export type ParsedComputerIdn = {
  labelLevels: string[]; // npr. ["finance", "internal"]
  deviceOrPersonIndex: number; // broj koji dolazi odmah posle labela
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
  const deviceOrPersonIndex = parseInt(parts[parts.length - 2], 10);
  const networkIdn = parseInt(parts[parts.length - 1], 10);

  return {
    labelLevels,
    deviceOrPersonIndex,
    networkIdn,
    suffix,
  };
}

// Funkcija koja generiše idn iz delova
export function generateComputerIdn(labelLevels: string[], deviceOrPersonIndex: number, networkIdn: number, suffix?: string): string {
  const main = [...labelLevels, deviceOrPersonIndex.toString(), networkIdn.toString()].join(":");
  return suffix ? `${main}#${suffix}` : main;
}
