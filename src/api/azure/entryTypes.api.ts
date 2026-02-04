/**
 * Entry Types API
 * Azure layer for Entry Types data
 */

// Entry Type from API response
export type EntryTypeItem = {
  ocid: number;
  ocisid: number;
  ocname: string;
  ocdescription?: string;
};

export type EntryTypesResponse = {
  left: string[];   // Source System (ocnames)
  right: string[];  // Target System (1 to N numbers)
};

// Environment variables for API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VERSION_PATH = import.meta.env.VITE_VERSION_PATH;
const APIM_SUB_KEY = import.meta.env.VITE_APIM_SUB_KEY;

/**
 * Get all entry types from Azure API
 * Returns raw entry type items with full details
 */
export const getEntryTypeItems = async (): Promise<EntryTypeItem[]> => {
  const url = `${API_BASE_URL}${VERSION_PATH}/migration/entry-types?context=entryType&cusId=test01`;

  console.log("[EntryTypes API] Fetching from:", url);
  console.log("[EntryTypes API] Config:", {
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

  console.log("[EntryTypes API] Response status:", res.status, res.statusText);

  if (!res.ok) {
    throw new Error(`Failed to fetch Entry Types (HTTP ${res.status})`);
  }

  // API returns NDJSON (newline-delimited JSON), not a JSON array
  // Each line is a separate JSON object
  const text = await res.text();
  console.log("[EntryTypes API] Raw text length:", text.length);

  // Parse each line as a separate JSON object
  const lines = text.trim().split('\n').filter(line => line.trim());
  console.log("[EntryTypes API] Lines count:", lines.length);

  const items: EntryTypeItem[] = [];
  for (const line of lines) {
    try {
      const item = JSON.parse(line);
      items.push(item);
    } catch (e) {
      console.warn("[EntryTypes API] Failed to parse line:", line, e);
      // Skip malformed lines
    }
  }

  console.log("[EntryTypes API] Parsed items:", items.length);
  console.log("[EntryTypes API] Sample item:", items[0]);

  return items;
};

/**
 * Get all entry types for Source System and Target System mapping
 * 
 * Source System (left) = list of ocnames
 * Target System (right) = 1 to N numbers (dynamically generated based on source count)
 */
export const getEntryTypes = async (): Promise<EntryTypesResponse> => {
  const items = await getEntryTypeItems();
  
  const ocnames = items.map(item => item.ocname);
  
  // Target System shows 1 to N numbers (one number for each source item)
  const targetNumbers = ocnames.map((_, index) => String(index + 1));
  
  console.log("[EntryTypes API] Extracted ocnames:", ocnames.length, "items");

  return {
    left: ocnames,        // Source System (ocnames)
    right: targetNumbers, // Target System (1, 2, 3... N)
  };
};

/**
 * Get entry types filtered by ocisid
 * @param ocisid - Filter by this ocisid (1, 6, or 9). Default is 1.
 */
export const getEntryTypesByOcisid = async (ocisid: number = 1): Promise<EntryTypeItem[]> => {
  const items = await getEntryTypeItems();
  const filtered = items.filter(item => item.ocisid === ocisid);
  console.log(`[EntryTypes API] Filtered by ocisid=${ocisid}:`, filtered.length, "items");
  return filtered;
};
