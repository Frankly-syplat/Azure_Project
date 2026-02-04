/**
 * Master ID API
 * Azure layer for Master ID data and persistence
 */

export type MasterIdOption = {
  id: string;
  label: string;
  ocisid: number; // Maps to Entry Types filter
};

// Response type from the API
export type MasterIdApiResponse = {
  idNames: string[];
};

// Master ID to ocisid mapping (1, 6, or 9 - default 1)
const MASTER_ID_TO_OCISID: Record<string, number> = {
  // First Master ID maps to ocisid 1
  // Second Master ID maps to ocisid 6
  // Third Master ID maps to ocisid 9
  // Others default to 1
};

// In-memory state for selected Master ID (simulates backend persistence)
let selectedMasterId: string | null = null;

// Environment variables for API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VERSION_PATH = import.meta.env.VITE_VERSION_PATH;
const APIM_SUB_KEY = import.meta.env.VITE_APIM_SUB_KEY;

/**
 * Get ocisid for a given Master ID index
 * First 3 Master IDs map to 1, 6, 9 respectively, others default to 1
 */
const getOcisidForIndex = (index: number): number => {
  const ocisidMap = [1, 6, 9];
  return index < ocisidMap.length ? ocisidMap[index] : 1;
};

/**
 * Get all available Master ID options from Azure API
 */
export const getMasterIds = async (): Promise<MasterIdOption[]> => {
  const url = `${API_BASE_URL}${VERSION_PATH}/migration/master-ids?context=mid&cusId=test01`;

  console.log("[MasterIds API] Fetching from:", url);
  console.log("[MasterIds API] Config:", {
    API_BASE_URL,
    VERSION_PATH,
    hasSubKey: !!APIM_SUB_KEY,
  });

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Ocp-Apim-Subscription-Key": APIM_SUB_KEY,
    },
  });

  console.log("[MasterIds API] Response status:", res.status, res.statusText);

  if (!res.ok) {
    throw new Error(`Failed to fetch Master IDs (HTTP ${res.status})`);
  }

  const data = await res.json();
  console.log("[MasterIds API] Raw response:", data);
  console.log("[MasterIds API] Response keys:", Object.keys(data || {}));

  // Handle different response structures
  let idNames: string[] = [];

  if (Array.isArray(data)) {
    // Direct array response
    idNames = data;
  } else if (data?.idNames && Array.isArray(data.idNames)) {
    // { idNames: [...] } structure
    idNames = data.idNames;
  } else if (data?.data && Array.isArray(data.data)) {
    // { data: [...] } structure
    idNames = data.data;
  }

  console.log("[MasterIds API] Extracted idNames:", idNames);

  // Map to options with ocisid
  const options = idNames.map((name, index) => ({
    id: name,
    label: name,
    ocisid: getOcisidForIndex(index),
  }));

  console.log("[MasterIds API] Final options with ocisid:", options);

  return options;
};

/**
 * Save the selected Master ID
 * Persists via API (mocked as in-memory state)
 */
export const saveSelectedMasterId = async (masterId: string): Promise<void> => {
  selectedMasterId = masterId;
  console.log("[API] Master ID saved:", masterId);
  return Promise.resolve();
};

/**
 * Get the currently selected Master ID
 */
export const getSelectedMasterId = async (): Promise<string | null> => {
  return Promise.resolve(selectedMasterId);
};
