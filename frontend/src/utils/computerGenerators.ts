// src/utils/computerGenerators.ts !!!!! ONLY FOR TESTING  !!!

import { v4 as uuidv4 } from "uuid";

export function generateComputerIdn(networkIndex = 0, ordinal = 0): string {
  return `None:${networkIndex}:${ordinal}`;
}

export function generateComputerId(  // koristim ga samo u testu
  location: string,
  rack: number,
  position: number
): string {
  return `${location}:${rack}:${position}`;
}

export function generateUuid(): string {
  return uuidv4();
}
export function generateSoftwareDataLinks(
  softwareToDataTypes: Record<string, string[]>,
  allDataIds: string[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [softwareId, types] of Object.entries(softwareToDataTypes)) {
    result[softwareId] = [];

    for (const dataType of types) {
      const matches = allDataIds.filter((id) => id.startsWith(`${dataType}:`));
      for (const match of matches) {
        result[softwareId].push(`${match}#${uuidv4()}`);
      }
    }
  }
  return result;
}

export function generateStoredCredentials(
  userPrefixes: string[],
  countPerPrefix = 1
): string[] {
  const credentials: string[] = [];

  for (const prefix of userPrefixes) {
    for (let i = 0; i < countPerPrefix; i++) {
      credentials.push(`${prefix}.${uuidv4()}`);
    }
  }
  return credentials;
}

export function generateSoftwareIdnMapping(
  installedSoftware: Record<string, any>
): Record<string, string> {
  const mapping: Record<string, string> = {};

  for (const fullIdn of Object.keys(installedSoftware)) {
    const shortIdn = fullIdn.split(">")[1]; // "cpe:/...#uuid"
    mapping[shortIdn] = fullIdn;
  }
  return mapping;
}
