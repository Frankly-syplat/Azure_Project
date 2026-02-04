/**
 * Entry Type Attributes API
 * Mocked Azure layer for Entry Type Attributes data
 * 
 * This is SEPARATE from Entry Types API.
 * Entry Type Attributes page has its own data source.
 * 
 * TODO: Replace hardcoded data with actual GET method call
 */

export type EntryTypeAttributeItem = {
  id: number;
  name: string;
  description?: string;
};

export type EntryTypeAttributesResponse = {
  left: string[];   // Source System
  right: string[];  // Target System
};

/**
 * HARDCODED DATA - Replace with GET method call
 * 
 * TODO: Uncomment the fetch call below and remove hardcoded data
 * 
 * const response = await fetch('YOUR_API_ENDPOINT/entryTypeAttributes');
 * const data: EntryTypeAttributeItem[] = await response.json();
 * return { left: data.map(item => item.name), right: data.map(item => item.name) };
 */
const HARDCODED_ENTRY_TYPE_ATTRIBUTES: EntryTypeAttributeItem[] = [
  { id: 1, name: "ATTR_NAME", description: "Name attribute" },
  { id: 2, name: "ATTR_DESCRIPTION", description: "Description attribute" },
  { id: 3, name: "ATTR_STATUS", description: "Status attribute" },
  { id: 4, name: "ATTR_TYPE", description: "Type attribute" },
  { id: 5, name: "ATTR_CATEGORY", description: "Category attribute" },
  { id: 6, name: "ATTR_OWNER", description: "Owner attribute" },
  { id: 7, name: "ATTR_CREATED_DATE", description: "Creation date attribute" },
  { id: 8, name: "ATTR_MODIFIED_DATE", description: "Modified date attribute" },
  { id: 9, name: "ATTR_EXPIRY_DATE", description: "Expiry date attribute" },
  { id: 10, name: "ATTR_PRIORITY", description: "Priority attribute" },
];

/**
 * Get all entry type attributes for Source System and Target System mapping
 * 
 * Currently returns hardcoded values.
 * Both Source and Target show the same attribute names (one-to-one mapping).
 * 
 * TODO: Replace with actual API call when ready.
 */
export const getEntryTypeAttributes = async (): Promise<EntryTypeAttributesResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // TODO: Uncomment below to use actual GET method
  // const response = await fetch('YOUR_API_ENDPOINT/entryTypeAttributes');
  // const data: EntryTypeAttributeItem[] = await response.json();
  // const names = data.map(item => item.name);
  // return { left: names, right: names };
  
  // Using hardcoded data for now
  const names = HARDCODED_ENTRY_TYPE_ATTRIBUTES.map(item => item.name);
  
  return Promise.resolve({
    left: names,   // Source System
    right: names,  // Target System
  });
};

/**
 * Get raw entry type attribute items with full details
 */
export const getEntryTypeAttributeItems = async (): Promise<EntryTypeAttributeItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // TODO: Uncomment below to use actual GET method
  // const response = await fetch('YOUR_API_ENDPOINT/entryTypeAttributes');
  // const data: EntryTypeAttributeItem[] = await response.json();
  // return data;
  
  return Promise.resolve([...HARDCODED_ENTRY_TYPE_ATTRIBUTES]);
};
