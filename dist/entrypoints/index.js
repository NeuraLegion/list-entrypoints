"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const http_client_1 = require("@actions/http-client");
async function run() {
    try {
        const apiToken = (0, core_1.getInput)('api_token', { required: true });
        const hostname = (0, core_1.getInput)('hostname');
        const projectId = (0, core_1.getInput)('project_id', { required: true });
        const limit = (0, core_1.getInput)('limit');
        const connectivity = (0, core_1.getInput)('connectivity');
        const status = (0, core_1.getInput)('status');
        const baseUrl = hostname || 'https://app.brightsec.com';
        const client = new http_client_1.HttpClient('GitHub Actions', undefined, {
            headers: {
                Authorization: `api-key ${apiToken}`,
                /* eslint-disable @typescript-eslint/naming-convention */
                'Content-Type': 'application/json'
            }
        });
        const entrypoints = [];
        let nextId;
        let nextCreatedAt;
        do {
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
            const response = await client.get(`${baseUrl}/api/v2/projects/${projectId}/entry-points${params.toString() ? `?${params.toString()}` : ''}`);
            const responseBody = await response.readBody();
            const data = JSON.parse(responseBody);
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
        (0, core_1.setOutput)('entrypoints', JSON.stringify(entrypoints));
        (0, core_1.setOutput)('projectId', projectId);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, core_1.setFailed)(error.message);
        }
        else {
            (0, core_1.setFailed)('An unknown error occurred');
        }
    }
}
void run();
