// Logic Apps Type Definitions

export interface LogicAppSelection {
  id: string;
  name: string;
}

export interface LogicAppPostMessage {
  type: 'LOAD_LOGIC_APP';
  payload: object;
}
