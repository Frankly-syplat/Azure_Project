// Logic Apps API - Returns RAW JSON only
// No parsing, no transformation, no structured rendering

export interface LogicAppItem {
  id: string;
  label: string;
}

/**
 * Get list of Logic Apps
 */
export const getLogicAppsList = async (): Promise<LogicAppItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { id: 'logic-app-1', label: 'LogicApp1' },
    { id: 'logic-app-2', label: 'LogicApp2' },
    { id: 'logic-app-3', label: 'LogicApp3' },
    { id: 'logic-app-4', label: 'LogicApp4' },
    { id: 'logic-app-5', label: 'LogicApp5' },
    { id: 'logic-app-6', label: 'LogicApp6' },
  ];
};

// The raw Logic App definition JSON (same for all for now)
// This is returned EXACTLY as-is - no parsing
const LOGIC_APP_DEFINITION_RAW = {
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "triggers": {
      "Receive_HTTP_Request": {
        "type": "Request",
        "kind": "Http",
        "inputs": {
          "method": "POST",
          "schema": {
            "type": "object",
            "properties": {
              "schemaId": { "type": "string", "minLength": 1 }
            },
            "required": ["schemaId"]
          }
        }
      }
    },
    "actions": {
      "Initialize_CorrelationId": {
        "runAfter": {},
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "correlationId", "type": "string", "value": "@{guid()}" }
          ]
        }
      },
      "Initialize_RequestStartTime": {
        "runAfter": { "Initialize_CorrelationId": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "requestStartTime", "type": "string", "value": "@{formatDateTime(utcNow(), 'yyyy-MM-ddTHH:mm:ss.fff')}" }
          ]
        }
      },
      "Initialize_ClientId": {
        "runAfter": { "Initialize_RequestStartTime": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "clientId", "type": "string", "value": "@{triggerBody()?['authentication']['clientId']}" }
          ]
        }
      },
      "Initialize_ClientSecret": {
        "runAfter": { "Initialize_ClientId": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "clientSecret", "type": "string", "value": "@{triggerBody()?['authentication']['clientSecret']}" }
          ]
        }
      },
      "Initialize_TenantId": {
        "runAfter": { "Initialize_ClientSecret": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "tenantId", "type": "string", "value": "@{triggerBody()?['authentication']?['tenantId']}" }
          ]
        }
      },
      "Initialize_EnableLogging": {
        "runAfter": { "Initialize_TenantId": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "enableLogging", "type": "boolean", "value": "@coalesce(triggerBody()?['logging']['enableLogging'], bool('false'))" }
          ]
        }
      },
      "Initialize_LogAnalyticsWorkspaceId": {
        "runAfter": { "Initialize_EnableLogging": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "logAnalyticsWorkspaceId", "type": "string", "value": "@{coalesce(triggerBody()?['logging']['logAnalyticsWorkspaceId'], '')}" }
          ]
        }
      },
      "Initialize_LogAnalyticsSharedKey": {
        "runAfter": { "Initialize_LogAnalyticsWorkspaceId": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "logAnalyticsSharedKey", "type": "string", "value": "@{coalesce(triggerBody()?['logging']['logAnalyticsSharedKey'], '')}" }
          ]
        }
      },
      "Initialize_UseKeyVault": {
        "runAfter": { "Initialize_LogAnalyticsSharedKey": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "useKeyVault", "type": "boolean", "value": "@equals(coalesce(triggerBody()?['useKeyVault'], false), true)" }
          ]
        }
      },
      "Initialize_MaxRetryAttempts": {
        "runAfter": { "Initialize_UseKeyVault": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "maxRetryAttempts", "type": "integer", "value": "@coalesce(triggerBody()?['maxRetryAttempts'], 3)" }
          ]
        }
      },
      "Initialize_RequestStatus": {
        "runAfter": { "Initialize_MaxRetryAttempts": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "requestStatus", "type": "string", "value": "Processing" }
          ]
        }
      },
      "Initialize_RetryInterval": {
        "runAfter": { "Initialize_RequestStatus": ["Succeeded"] },
        "type": "InitializeVariable",
        "inputs": {
          "variables": [
            { "name": "retryInterval", "type": "integer", "value": "@coalesce(triggerBody()?['retryInterval'], 30)" }
          ]
        }
      },
      "Log_Request_Received": {
        "actions": {
          "Send_Request_Received_Log": {
            "runAfter": {},
            "type": "Http",
            "inputs": {
              "method": "POST",
              "uri": "@{coalesce(triggerBody()?['logAnalyticsUri'], 'https://[workspace-id].ods.opinsights.azure.com/api/logs?api-version=2016-04-01')}",
              "headers": {
                "Log-Type": "EntraIDSchemaExtension",
                "x-api-key": "@{coalesce(triggerBody()?['logAnalyticsKey'], '')}"
              },
              "body": [
                {
                  "CorrelationId": "@{variables('correlationId')}",
                  "Timestamp": "@{utcNow()}",
                  "EventType": "RequestReceived",
                  "Status": "@{variables('requestStatus')}",
                  "RequestBody": "@{string(triggerBody())}"
                }
              ]
            }
          }
        },
        "runAfter": { "Initialize_RetryInterval": ["Succeeded"] },
        "expression": {
          "and": [
            { "equals": ["@variables('enableLogging')", true] }
          ]
        },
        "type": "If"
      },
      "Call_GetEntraOAuthToken": {
        "runAfter": { "Log_Request_Received": ["Succeeded"] },
        "type": "Workflow",
        "inputs": {
          "host": {
            "workflow": {
              "id": "/subscriptions/43077d03-a9e5-4dd1-912a-a04281d5098d/resourceGroups/logic_apps/providers/Microsoft.Logic/workflows/GetEntraOAuthToken"
            },
            "triggerName": "Receive_HTTP_Request"
          },
          "body": {
            "authentication": {
              "clientId": "@variables('clientId')",
              "clientSecret": "@variables('clientSecret')",
              "tenantId": "@variables('tenantId')",
              "scope": "https://graph.microsoft.com/.default"
            }
          }
        }
      },
      "Handle_OAuth_Response": {
        "actions": {
          "Check_OAuth_Success": {
            "actions": {
              "Create_Schema_Extension": {
                "runAfter": {},
                "type": "Http",
                "inputs": {
                  "method": "POST",
                  "uri": "https://graph.microsoft.com/v1.0/schemaExtensions",
                  "headers": {
                    "Authorization": "Bearer @{body('Call_GetEntraOAuthToken')['data']['access_token']}",
                    "Content-Type": "application/json",
                    "x-correlation-id": "@{variables('correlationId')}"
                  },
                  "body": "@triggerBody()?['schemaExtension']",
                  "retryPolicy": {
                    "type": "fixed",
                    "count": "@variables('maxRetryAttempts')",
                    "interval": "PT@{variables('retryInterval')}S"
                  }
                }
              },
              "Return_Success_Response": {
                "runAfter": { "Create_Schema_Extension": ["Succeeded"] },
                "type": "Response",
                "kind": "Http",
                "inputs": {
                  "statusCode": 200,
                  "headers": {
                    "Content-Type": "application/json",
                    "x-correlation-id": "@{variables('correlationId')}",
                    "x-request-duration": "@{div(sub(ticks(formatDateTime(utcNow(), 'yyyy-MM-ddTHH:mm:ss.fff')), ticks(variables('requestStartTime'))), 10000000)}"
                  },
                  "body": ""
                }
              }
            },
            "else": {
              "actions": {
                "Return_OAuth_Error": {
                  "type": "Response",
                  "kind": "Http",
                  "inputs": {
                    "statusCode": "@outputs('Call_GetEntraOAuthToken')['statusCode']",
                    "headers": {
                      "Content-Type": "application/json",
                      "x-correlation-id": "@{variables('correlationId')}",
                      "x-request-duration": "@{div(sub(ticks(formatDateTime(utcNow(), 'yyyy-MM-ddTHH:mm:ss.fff')), ticks(variables('requestStartTime'))), 10000000)}"
                    },
                    "body": {
                      "status": "error",
                      "correlationId": "@{variables('correlationId')}",
                      "error": "@body('Call_GetEntraOAuthToken')['error']",
                      "timestamp": "@{formatDateTime(utcNow(), 'yyyy-MM-ddTHH:mm:ss.fffZ')}"
                    }
                  }
                }
              }
            },
            "expression": { "equals": ["@outputs('Call_GetEntraOAuthToken')['statusCode']", 200] },
            "type": "If"
          }
        },
        "runAfter": { "Call_GetEntraOAuthToken": ["Succeeded", "Failed"] },
        "type": "Scope"
      }
    },
    "outputs": {},
    "parameters": {
      "$connections": { "type": "Object", "defaultValue": {} }
    }
  },
  "parameters": {
    "$connections": { "type": "Object", "value": {} }
  }
};

/**
 * Get Logic App definition by ID
 * Returns RAW JSON - no parsing, no transformation
 * Architecture note: logicAppId is accepted for future differentiation
 */
export const getLogicAppDefinition = async (logicAppId: string): Promise<unknown> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // For now, all logic apps return the same raw definition
  // Future: map logicAppId to different API endpoints
  console.log(`[LogicApps API] Fetching raw definition for: ${logicAppId}`);
  
  // Return RAW JSON - the designer engine consumes this directly
  return LOGIC_APP_DEFINITION_RAW;
};
