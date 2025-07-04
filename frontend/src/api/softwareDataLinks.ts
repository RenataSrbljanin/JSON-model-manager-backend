import axios from "axios";

export async function getDataLinksBySoftwareId(software_idn: string) {
  const res = await axios.get(
    `http://localhost:5000/software-data-links/by-software/${software_idn}`
  );
  return res.data; // returns array of { software_idn, data_type_id }
}
