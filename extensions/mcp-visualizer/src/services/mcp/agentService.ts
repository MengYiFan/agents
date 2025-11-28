import { McpDocEntry } from '../../types';

interface Agent {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: {
    provider: string;
    name: string;
    toolChoice: string;
  };
}

export class AgentService {
  private baseUrl = 'http://localhost:4111';

  public async getAgents(): Promise<McpDocEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/agents`);
      if (!response.ok) {
        console.error(`Failed to fetch agents: ${response.statusText}`);
        return [];
      }

      const agents = (await response.json()) as Agent[];

      return agents.map((agent) => ({
        id: agent.id,
        title: agent.name,
        description: agent.description,
        defaultLanguage: 'en-US', // Default to English as API doesn't specify
        variants: [
          {
            language: 'en-US',
            label: 'English',
            filePath: '', // No file path for API-sourced agents
            content: `
              <h1>${agent.name}</h1>
              <p>${agent.description}</p>
              <h2>Instructions</h2>
              <pre>${agent.instructions}</pre>
              <h2>Model Info</h2>
              <ul>
                <li>Provider: ${agent.model.provider}</li>
                <li>Model: ${agent.model.name}</li>
                <li>Tool Choice: ${agent.model.toolChoice}</li>
              </ul>
            `
          }
        ]
      }));
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  }
}
