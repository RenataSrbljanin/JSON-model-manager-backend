import axios from "axios";

export interface Suggestions {
  person_group_ids: string[];
  compatible_data_types: string[];
  stored_credentials: string[];
  network_ids: number[];
  credential_ids: string[];
  hardware_ids: string[];
  network_idns: number[];
}

const BASE_URL = "http://localhost:5000/api/suggestions";

export const getSuggestions = async (): Promise<Suggestions> => {
  const response = await axios.get<Suggestions>(BASE_URL);
  return response.data;
};
