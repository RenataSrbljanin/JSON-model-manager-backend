import type { InstalledSoftware } from "../api/installedSoftware";

export function normalizeInstalledSoftware(
  sw: InstalledSoftware
): InstalledSoftware {
  return {
    ...sw,
    person_group_id: sw.person_group_id ?? "",
    hardware_ids: sw.hardware_ids ?? [],
    accepts_credentials: sw.accepts_credentials ?? [],
    network_idn: (sw.network_idn ?? []).map(Number),
    idn_variant: sw.idn_variant ?? "",
    installed_combination: sw.installed_combination ?? [],
    local_dependencies: sw.local_dependencies ?? [],
    network_clients: sw.network_clients ?? [],
    network_servers: sw.network_servers ?? [],
    provides_services: sw.provides_services ?? [],
    provides_user_services: sw.provides_user_services ?? [],
    provides_network_services: sw.provides_network_services ?? [],
  };
}
