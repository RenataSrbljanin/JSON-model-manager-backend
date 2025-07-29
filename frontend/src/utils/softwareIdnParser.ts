// src/utils/softwareIdnParser.ts

import type { SoftwareIdnComponents } from "../types/software";

/**
 * Parsira kompleksni IDN softvera u njegove komponente:
 * computerIdn, cpeIdn i UUID.
 * Format: <computerIdn> > <cpeIdn> # <UUID>
 *
 * @param softwareIdn Kompletan IDN string softvera.
 * @returns Objekt s komponentama IDN-a ili null ako parsiranje ne uspije.
 */
export function parseSoftwareIdn(softwareIdn: string): SoftwareIdnComponents | null {
  // Regularni izraz za parsiranje IDN-a
  // Grupe hvatanja:
  // 1: computerIdn (sve prije prvog '>')
  // 2: cpeIdn (sve između '>' i '#')
  // 3: UUID (sve poslije '#')
  const regex = /^([^>]+)>(.*?)#([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i;

  const match = softwareIdn.match(regex);

  if (match && match.length === 4) {
    // match[0] je cijeli podudarni string
    // match[1] je prva grupa hvatanja (computerIdn)
    // match[2] je druga grupa hvatanja (cpeIdn)
    // match[3] je treća grupa hvatanja (UUID)
    return {
      computerIdn: match[1],
      cpeIdn: match[2],
      uuid: match[3],
    };
  }
  return null; // Parsiranje nije uspjelo
}

/**
 * Generira validan IDN string softvera na temelju poznatih atributa.
 *
 * @param components Objekt koji sadrži computerIdn, cpeIdn i UUID.
 * @returns Generirani IDN string softvera.
 */
export function generateSoftwareIdn(components: SoftwareIdnComponents): string {
  const { computerIdn, cpeIdn, uuid } = components;

  // Osnovna validacija da su svi potrebni dijelovi prisutni
  if (!computerIdn || !cpeIdn || !uuid) {
    throw new Error("Sve komponente (computerIdn, cpeIdn, uuid) su obavezne za generiranje IDN-a.");
  }

  // Možeš dodati i regex validaciju za pojedine komponente ako želiš strože provjere
  // Npr. provjeriti je li UUID validan UUID format

  return `${computerIdn}>${cpeIdn}#${uuid}`;
}

// Primjeri upotrebe (za testiranje)
// const exampleIdn = "None:0:2#1>CUSTOM:/a:.net:fin_app_server#879866c9-805f-4a5e-ba8c-faa264efe803";
// const parsed = parseSoftwareIdn(exampleIdn);
// console.log("Parsed IDN:", parsed);

// if (parsed) {
//     const generated = generateSoftwareIdn(parsed);
//     console.log("Generated IDN:", generated);
// }

// const invalidIdn = "SomeInvalidIdnString";
// const invalidParsed = parseSoftwareIdn(invalidIdn);
// console.log("Parsed invalid IDN:", invalidParsed);
