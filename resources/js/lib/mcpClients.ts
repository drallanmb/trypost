export type PrimaryMcpClientId = 'claude' | 'chatgpt';

export interface McpClient {
    id: PrimaryMcpClientId;
    label: string;
    settingsUrl: string;
}

/**
 * First-class MCP clients surfaced on workspace MCP settings.
 * `settingsUrl` is the client's connector-management entry point (per the
 * official OpenAI/Anthropic docs), not a deep link into a specific form.
 */
export const mcpClients: McpClient[] = [
    {
        id: 'claude',
        label: 'Claude',
        settingsUrl: 'https://claude.ai/customize/connectors',
    },
    {
        id: 'chatgpt',
        label: 'ChatGPT',
        settingsUrl:
            'https://chatgpt.com/plugins#settings/Connectors?create-connector=true&redirectAfter=%2Fplugins',
    },
];
