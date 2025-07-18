/**
 * JSONParser.ts
 * ---------------------
 * Sadrži funkciju `parseJSONToGraph` koja pretvara ulazne JSON datoteke
 * u strukturirani graf (čvorovi i veze) za prikaz i uređivanje u grafičkom sučelju.
 * Uključuje pomoćne funkcije za prepoznavanje softvera, korisnika, mreža i servisa.
 * Ključno za pretvaranje modeliranih IT sustava u vizualnu mrežu.
 */
import type { GraphData, NodeType, EdgeType, DetailedData } from "../types";

// ✅ Nova pomoćna funkcija za grupiranje nodova po tipu i id-u
export function getGroupFromNode(id: string, type: string): string {
  if (!type) return "default";
  if (type === "computer") {
    if (id === "None:0:0") return "server-00";
    if (id.startsWith("None:")) return "servers";
    return "users";
  }
  if (type === "user") return "users";
  if (type === "software") return "software";
  if (type === "service") return "services";
  if (type === "user-service") return "user-services";
  return "default";
}

export function getCustomerLabel(binaryLabel: string): string {
  switch (binaryLabel) {
    case "Office":
      return "Office";
    case "Outlook":
      return "EmailClient";
    case "Firefox":
      return "Browser";
    case "Financial App Client":
      return "Finance";
    case "Remote Administration Tools":
      return "Admin";
    case "Visual Studio 2019":
      return "Dev:Windows";
    case "SQL Server 2019":
      return "Database";
    case "Internet Banking Server":
      return "Banking";
    case "Exchange Server":
      return "EmailServer";
    case "Windows Server 2016":
      return "Server:Windows";
    case "Financial App Server":
      return "FinApp";
    default:
      return binaryLabel;
  }
}

export function getBinaryLabel(sw: any): string {
  let name = sw?.name?.trim() || "";
  const cpe = sw?.cpe_idn || "";
  const idn = sw?.idn || "";
  const source = name || cpe || idn;

  const normFull = source.toLowerCase();

  if (
    normFull.includes("windows_server_2016") ||
    normFull.includes("windows server")
  )
    return "Windows Server 2016";
  // ➔ Ako je Exchange Server bilo gdje u stringu, vrati ga odmah
  if (
    normFull.includes("exchange_server") ||
    normFull.includes("exchange server")
  )
    return "Exchange Server";

  let extracted = source.split(/[:\/]/).pop() || source;
  extracted = extracted.split("#")[0];
  let norm = extracted.replace(/_/g, " ").toLowerCase();

  // Prvo provjeri cijeli string za Exchange Server i slične
  if (
    normFull.includes("exchange_server") ||
    normFull.includes("exchange server")
  )
    return "Exchange Server";

  if (
    normFull.includes("sql_server:2019") ||
    normFull.includes("sql server 2019")
  )
    return "SQL Server 2019";

  if (
    normFull.includes("internet_banking_server") ||
    normFull.includes("internet banking")
  )
    return "Internet Banking Server";

  if (
    normFull.includes("windows_server_2016") ||
    normFull.includes("windows server")
  )
    return "Windows Server 2016";

  // ➔ Ako nije pronađen match u full stringu ➔ koristi extracted pristup
  if (
    norm.includes("sql server 2019") ||
    norm.includes("sql_server:2019") ||
    (norm.includes("sql server") && norm.includes("2019"))
  )
    return "SQL Server 2019";
  if (norm.includes("internet banking")) return "Internet Banking Server";
  if (norm.includes("exchange server")) return "Exchange Server";
  if (norm.includes("windows server")) return "Windows Server 2016";
  if (norm.includes("iis")) return "IIS";
  if (norm.includes(".net")) return ".NET Framework";
  if (norm.includes("active directory")) return "Microsoft Active Directory";
  if (norm.includes("remote administration tools"))
    return "Remote Administration Tools";
  if (norm.includes("visual studio 2019")) return "Visual Studio 2019";
  if (norm.includes("fin_app_server")) return "Financial App Server";
  if (norm.includes("windows 10")) return "Windows 10";
  if (norm.includes("windows 11")) return "Windows 11";

  // ➔ Provjeri i cpe
  if (cpe.includes("remote_administration_tools"))
    return "Remote Administration Tools";
  if (cpe.includes("visual_studio_2019")) return "Visual Studio 2019";
  if (cpe.includes("fin_app_server")) return "Financial App Server";
  if (cpe.includes("windows_10")) return "Windows 10";
  if (cpe.includes("windows_11")) return "Windows 11";
  if (cpe.includes("microsoft:office")) return "Office";
  if (cpe.includes("microsoft:outlook")) return "Outlook";
  if (cpe.includes("mozilla:firefox")) return "Firefox";
  if (cpe.includes("fin_app_client")) return "Financial App Client";
  if (cpe.includes("internet_banking_server")) return "Internet Banking Server";
  if (cpe.includes("exchange_server")) return "Exchange Server";
  if (cpe.includes("windows_server_2016")) return "Windows Server 2016";
  if (cpe.includes("sql_server:2019")) return "SQL Server 2019";
  if (cpe.includes("microsoft:active_directory"))
    return "Microsoft Active Directory";

  return extracted || source;
}

export function getDataserviceLabel(dsId: string): string {
  const extracted = dsId.split("#")[0];
  if (extracted.toLowerCase().includes("emails")) return "Emails";
  if (extracted.toLowerCase().includes("financialdata:banking"))
    return "FinancialData:banking";
  if (extracted.toLowerCase().includes("sourcecode:internet_banking"))
    return "SourceCode:internet_banking";
  return extracted;
}

// Nova pomoćna funkcija – je li softver OS bez korisničkih servisa
function isUnwantedOperatingSystem(sw: any): boolean {
  const cpe = sw?.cpe_idn || "";
  const label = getBinaryLabel(sw).toLowerCase();

  // IZNIMKA za Windows Server 2016
  if (label.includes("windows server 2016")) return false;

  const isOS = cpe.startsWith("cpe:/o:");
  const isKnownServer =
    label.includes("server") ||
    label.includes("exchange") ||
    label.includes("banking");
  const hasUserServices = sw?.provides_user_services?.length > 0;

  return isOS && !hasUserServices && !isKnownServer;
}

export function getAvailableNetworksFromJson(
  outputJson: any
): { id: string; label: string }[] {
  if (!outputJson?.network_segments) return [];

  return Object.keys(outputJson.network_segments).map((segmentId) => ({
    id: segmentId,
    label: `Network ${segmentId}`,
  }));
}

export function mapComputerDataWithLinkedSoftware(
  dataIds: string[],
  outputJson: any
): any[] {
  console.log("🔧 mapComputerDataWithLinkedSoftware CALLED");
  console.log("📥 dataIds:", dataIds);
  console.log(
    "📥 outputJson.data keys:",
    outputJson?.data ? Object.keys(outputJson.data) : "NO DATA"
  );
  if (!dataIds || !outputJson?.data) return [];

  const result: DetailedData[] = [];

  for (const dataId of dataIds) {
    console.log("🔎 Looking for dataId:", dataId);
    console.log("📂 Available data keys:", Object.keys(outputJson.data));
    const dataEntry = outputJson.data[dataId];
    if (!dataEntry) console.log("❌ dataEntry not found for", dataId);
    continue;

    console.log("✅ dataEntry found:", dataEntry);

    const linkedSoftware = (dataEntry.linked_software || []).map(
      (lsId: string) => {
        const [compId, softwareId] = lsId.split(">");
        const software = outputJson.software?.[softwareId];

        return {
          computerId: compId,
          softwareId,
          name: software?.name || softwareId,
        };
      }
    );

    result.push({
      idn: dataEntry.idn,
      data_type: dataEntry.data_type,
      protection_level: dataEntry.protection_level,
      person_groups: dataEntry.person_groups,
      linked_software: linkedSoftware,
    });
  }

  console.log("✅ Final detailedData", result);
  return result;
}

export function formatServerId(rawCompId: string): string {
  if (rawCompId.startsWith("None")) {
    const formatted =
      "server." + rawCompId.replace(/^None:/, "").replace(/:/g, ".");
    return formatted;
  }
  const formatted = rawCompId.replace(/:/g, ".");
  return formatted;
}

export function parseJSONToGraph(
  json: any,
  inputJson?: any,
  showOperatingSystems = false
): GraphData {
  if (!json?.computers || typeof json.computers !== "object") {
    return { nodes: [], edges: [] };
  }

  const nodes: NodeType[] = [];
  const edges: EdgeType[] = [];
  const nodeIndex: Record<string, NodeType> = {};

  const globalDependencyIds = new Set<string>();
  for (const comp of Object.values(json.computers) as any[]) {
    if (
      !comp?.installed_software ||
      typeof comp.installed_software !== "object"
    )
      continue;
    for (const sw of Object.values(comp.installed_software) as any[]) {
      for (const depId of sw?.local_dependencies || []) {
        globalDependencyIds.add(depId);
      }
    }
  }

  const referencedServices = new Set<string>();
  if (inputJson?.data_collections) {
    for (const dc of inputJson.data_collections) {
      for (const srv of dc.services || []) {
        referencedServices.add(srv.toLowerCase());
      }
    }
  }

  const roles = new Set<string>();
  if (inputJson?.employee_groups) {
    for (const group of Object.values(inputJson.employee_groups) as any[]) {
      for (const role of Object.keys(group)) {
        roles.add(role);
      }
    }
  }

  for (const role of roles) {
    const roleId = `user-${role}`;
    if (!nodeIndex[roleId]) {
      nodeIndex[roleId] = {
        id: roleId,
        label: role,
        fullName: roleId,
        type: "user",
        icon: "/icons/user.png",
        group: getGroupFromNode(roleId, "user"),
        meta: {
          originalUser: roleId,
        },
      };
      nodes.push(nodeIndex[roleId]);
    }
  }

  for (const [rawCompId, comp] of Object.entries(json.computers) as [
    string,
    any
  ][]) {
    if (!comp || typeof comp !== "object") continue;

    let personId: string | undefined;
    let validSoftwareIds: string[] = [];

    if (
      comp.installed_software &&
      typeof comp.installed_software === "object"
    ) {
      for (const [swId, sw] of Object.entries(comp.installed_software) as [
        string,
        any
      ][]) {
        if (!sw || typeof sw !== "object") continue;
        const isUserMachineSoftware = sw.person_index === 0;
        const isNetworkSoftware = sw.provides_network_services?.length > 0;
        if (isUserMachineSoftware || isNetworkSoftware) {
          validSoftwareIds.push(swId);
          if (isUserMachineSoftware && !personId && sw.person_group_id) {
            personId = sw.person_group_id;
          }
        }
      }
    }

    const hasPerson = !!personId;
    const isServer = !hasPerson && comp.provides_network_services?.length > 0;
    const compId = isServer ? formatServerId(rawCompId) : rawCompId;
    const compLabel = compId.replace(/^None/, "server").replace(/:/g, ".");

    const rawNetworkIds = comp.network_idn;
    const networkIds = Array.isArray(rawNetworkIds)
      ? rawNetworkIds
      : rawNetworkIds !== undefined
      ? [rawNetworkIds]
      : [];
    const networkGroup =
      networkIds.length > 0
        ? `network.internal.${networkIds.join("_")}`
        : "no-network";

    if (!hasPerson && validSoftwareIds.length === 0 && !isServer) continue;

    if (!nodeIndex[compId]) {
      nodeIndex[compId] = {
        id: compId,
        label: compLabel,
        fullName: compId,
        type: "computer",
        icon: "/icons/computer.png",
        group: networkGroup,
        meta: {
          network_ids: comp.network_idn || [],
          originalComputer: comp,
        },
      };
      nodes.push(nodeIndex[compId]);
    }

    if (hasPerson && personId) {
      const userNodeId = `user-${personId}`;
      // 🔹 Uvijek stvaraj vezu između računala i korisničkog čvora (role)
      if (nodeIndex[userNodeId]) {
        nodeIndex[userNodeId].group = networkGroup;
        edges.push({
          id: `edge-${userNodeId}-${compId}`,
          source: userNodeId,
          target: compId,
          type: "user-computer",
        });
      } else {
        // Fallback ako rola nije definirana u employee_groups - kreiraj user node
        nodeIndex[userNodeId] = {
          id: userNodeId,
          label: personId,
          fullName: `User role: ${personId}`,
          type: "user",
          icon: "/icons/user.png",
          group: networkGroup,
          meta: {
            originalUser: personId,
            computer_idn: compId,
            network_group: networkGroup,
          },
        };
        nodes.push(nodeIndex[userNodeId]);
        edges.push({
          id: `edge-${userNodeId}-${compId}`,
          source: userNodeId,
          target: compId,
          type: "user-computer",
        });
      }
    }

    for (const swId of validSoftwareIds) {
      const sw = comp.installed_software[swId];
      if (!sw || typeof sw !== "object") continue;
      if (!showOperatingSystems && isUnwantedOperatingSystem(sw)) continue;

      const binaryLabel = getBinaryLabel(sw);
      const binaryFullName = sw.name || sw.idn || sw.cpe_idn || swId;
      const binaryLabelLower = binaryLabel.toLowerCase();

      // SKIPAJ Internet_connection software u Landscape i Firewalls
      if (binaryLabelLower === "internet_connection") continue;
      /* if (!binaryLabel || binaryLabelLower === 'internet_connection') continue; */
      if (!binaryLabel) continue;

      const providesValidService = (sw.provides_network_services || []).some(
        (srv: string) => {
          const norm = srv.trim().toLowerCase();
          return (
            norm.length > 0 &&
            isNaN(Number(norm)) &&
            !norm.includes("connection")
          );
        }
      );
      const isReferenced = referencedServices.has(binaryLabelLower);

      const isDotNetFramework =
        binaryLabelLower.includes(".net framework") ||
        binaryLabelLower.includes("4.8");

      let shouldIncludeSoftwareNode = isDotNetFramework
        ? providesValidService || isReferenced
        : hasPerson || providesValidService || isReferenced;
      if (!shouldIncludeSoftwareNode) continue;

      if (!nodeIndex[swId]) {
        nodeIndex[swId] = {
          id: swId,
          label: binaryLabel,
          fullName: binaryFullName,
          type: "software",
          icon: "/icons/binary.png",
          group: networkGroup,
          provides_services: sw.provides_services || [],
          provides_network_services: sw.provides_network_services || [],
          meta: {
            computer_idn: rawCompId,
            network_ids: sw.network_idn || [],
            cpe: sw.cpe_idn || "N/A",
            version: sw.version || "N/A",
            person_index: sw.person_index ?? null,
            originalSoftware: sw,
          },
        };
        nodes.push(nodeIndex[swId]);
      }

      edges.push({
        id: `edge-${compId}-${swId}`,
        source: compId,
        target: swId,
        type: "computer-software",
      });
      // Provjeri je li software izložen Internetu
      const isExposedToInternet = inputJson?.provided_external_services?.some(
        (svc: string) =>
          binaryLabel.toLowerCase().includes(svc.toLowerCase()) ||
          (sw.provides_network_services || []).some((srv: string) =>
            srv.toLowerCase().includes(svc.toLowerCase())
          )
      );
      if (hasPerson) {
        const customerLabel = getCustomerLabel(binaryLabel);
        const customerId = `${customerLabel}-${swId}`;
        if (!nodeIndex[customerId]) {
          nodeIndex[customerId] = {
            id: customerId,
            label: customerLabel,
            fullName: customerId,
            type: "user-service",
            icon: "/icons/customer.png",
            group: networkGroup,
          };
          nodes.push(nodeIndex[customerId]);
        }
        edges.push({
          id: `edge-${swId}-${customerId}`,
          source: swId,
          target: customerId,
          type: "software-user-service",
        });
      }

      for (const serviceName of sw.provides_network_services || []) {
        if (serviceName.toLowerCase() === "internet") continue; // SKIPAJ Internet service za Landscape i Firewalls
        const serviceId = `${serviceName}-${swId}`;
        if (!nodeIndex[serviceId]) {
          nodeIndex[serviceId] = {
            id: serviceId,
            label: serviceName,
            fullName: serviceId,
            type: "service",
            icon: "/icons/service.png",
            group: networkGroup,
            meta: {
              originalService: inputJson.services?.[serviceId] || null,
            },
          };
          nodes.push(nodeIndex[serviceId]);
        }
        edges.push({
          id: `edge-${swId}-${serviceId}`,
          source: swId,
          target: serviceId,
          type: "software-service",
        });
      }
    }

    if (
      isServer &&
      (!comp.installed_software || validSoftwareIds.length === 0)
    ) {
      for (const serviceName of comp.provides_network_services || []) {
        const serviceId = `${serviceName}-${compId}`;
        if (!nodeIndex[serviceId]) {
          nodeIndex[serviceId] = {
            id: serviceId,
            label: serviceName,
            fullName: `${serviceName}-${compId}`,
            type: "service",
            icon: "/icons/service.png",
            group: networkGroup,
          };
          nodes.push(nodeIndex[serviceId]);
        }
        edges.push({
          id: `edge-${compId}-${serviceId}`,
          source: compId,
          target: serviceId,
          type: "computer-service",
        });
      }
    }
  }

  const uniqueGroups = [...new Set(nodes.map((node) => node.group))];
  const groupCount = uniqueGroups.length;
  const groupCoordinates = new Map<string, { x: number; y: number }>();
  const radius = 800 * groupCount;

  uniqueGroups.forEach((group, index) => {
    if (!group) return;
    const angle = (index / groupCount) * 2 * Math.PI;
    groupCoordinates.set(group, {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  });

  const nodesWithCoordinates = nodes.map((node) => {
    const coords = node.group ? groupCoordinates.get(node.group) : undefined;
    const updatedNode = coords
      ? {
          ...node,
          x: coords.x + (Math.random() * 200 - 100),
          y: coords.y + (Math.random() * 200 - 100),
        }
      : node;

    // 🔹 Dodaj fallback za fullName unutar mapiranja
    if (!updatedNode.fullName) {
      updatedNode.fullName = updatedNode.id;
    }

    return updatedNode;
  });

  return { nodes: nodesWithCoordinates, edges };
}
