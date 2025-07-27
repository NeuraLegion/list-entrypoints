import { getInput, setOutput, setFailed } from '@actions/core';
import { HttpClient } from '@actions/http-client';

interface EntrypointResponse {
  nextId?: string;
  nextCreatedAt?: string;
  items: Array<{
    id: string;
    name: string;
    url: string;
    status?: string;
    connectivity?: string;
  }>;
}

async function run(): Promise<void> {
  try {
    const apiToken = getInput('api_token', { required: true });
    const hostname = getInput('hostname');
    const projectId = getInput('project_id', { required: true });
    const limit = getInput('limit');
    const connectivity = getInput('connectivity');
    const status = getInput('status');
    const idsOnly = getInput('ids_only') === 'true';

    const baseUrl = hostname || 'https://app.brightsec.com';
    const client = new HttpClient('GitHub Actions', undefined, {
      headers: {
        Authorization: `api-key ${apiToken}`,
        /* eslint-disable @typescript-eslint/naming-convention */
        'Content-Type': 'application/json'
      }
    });

    const entrypoints: Array<{
      id: string;
      name: string;
      url: string;
      status?: string;
      connectivity?: string;
    }> = [];

    let nextId: string | undefined;
    let nextCreatedAt: string | undefined;

    do {
      const params = buildUrlParams(limit, nextId, nextCreatedAt, connectivity, status);

      const response = await client.get(
        `${baseUrl}/api/v2/projects/${projectId}/entry-points${params.toString() ? `?${params.toString()}` : ''}`
      );

      const responseBody = await response.readBody();
      const data = JSON.parse(responseBody) as EntrypointResponse;

      entrypoints.push(...data.items.map(item => ({
        id: item.id,
        name: item.name,
        url: item.url,
        status: item.status,
        connectivity: item.connectivity
      })));

      nextId = data.nextId;
      nextCreatedAt = data.nextCreatedAt;
    } while (nextId && nextCreatedAt);

    setOutput('entrypoints', JSON.stringify(idsOnly ? entrypoints.map(item => item.id) : entrypoints));
    setOutput('projectId', projectId);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed('An unknown error occurred');
    }
  }
}

function buildUrlParams(
  limit: string, 
  nextId: string | undefined, 
  nextCreatedAt: string | undefined, 
  connectivity: string, 
  status: string
): URLSearchParams {
  const params = new URLSearchParams();
  if (limit) {
    params.append('limit', limit);
  }
  if (nextId) {
    params.append('nextId', nextId);
  }
  if (nextCreatedAt) {
    params.append('nextCreatedAt', nextCreatedAt);
  }
  if (connectivity) {
    connectivity.split(',').map(value => value.trim()).forEach(value => {
      params.append('connectivity[]', value);
    });
  }
  if (status) {
    status.split(',').map(value => value.trim()).forEach(value => {
      params.append('status[]', value);
    });
  }
  
  return params;
}

void run();
