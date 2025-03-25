# List Project Entrypoints

This action retrieves a list of entrypoints from a specified project in the Bright Security platform.

### Build Secure Apps & APIs. Fast.

[Bright](https://www.brightsec.com) is a powerful dynamic application & API security testing (DAST) platform that security teams trust and developers love.

### Automatically Tests Every Aspect of Your Apps & APIs

Scans any target, whether Web Apps, APIs (REST. & SOAP, GraphQL & more), Web sockets or mobile, providing actionable reports

### Seamlessly integrates with the Tools and Workflows You Already Use

Bright works with your existing CI/CD pipelines – trigger scans on every commit, pull request or build with unit testing.

### Spin-Up, Configure and Control Scans with Code

One file. One command. One scan. No UI needed.

More information is available on Bright's:

- [Website](https://www.brightsec.com/)
- [Knowledge base](https://docs.brightsec.com/docs/quickstart)
- [YouTube channel](https://www.youtube.com/channel/UCoIC0T1pmozq3eKLsUR2uUw)
- [GitHub Actions](https://github.com/marketplace?query=neuralegion+)

# Inputs

### `api_token`

**Required**. Your Bright API authorization token (key). You can generate it in the **Organization** section in [the Bright app](https://app.brightsec.com/login). Find more information [here](https://docs.brightsec.com/docs/manage-your-organization#manage-organization-apicli-authentication-tokens).

### `hostname`

**Optional**. The hostname where your Bright app is deployed. Default is `app.brightsec.com`.

### `project_id`

**Required**. The ID of the project from which to list entrypoints.

### `connectivity`

**Optional**. One or more connectivity statuses as a comma-separated list. Available values: `ok`, `unreachable`, `problem`, `skipped`, `unauthorized`, `unavailable`.

### `status`

**Optional**. One or more security statuses as a comma-separated list. Available values: `new`, `changed`, `tested`, `vulnerable`.

### `limit`

**Optional**. Maximum number of entrypoints to retrieve. Default is `100`.

# Outputs

### `projectId`

The ID of the project from which entrypoints were retrieved.

### `entrypoints`

A JSON-formatted list of entrypoints from the specified project.

# Example Usage

```yaml
steps:
  - name: List Project Entrypoints
    uses: NeuraLegion/bright-github-actions/list-entrypoints@release
    with:
      api_token: ${{ secrets.BRIGHT_TOKEN }}
      project_id: ${{ secrets.PROJECT_ID }}
      limit: 50
      connectivity: ok,unreachable
      status: new,vulnerable
    id: entrypoints

  - name: Use Entrypoints
    run: |
      echo "Project ID: ${{ steps.entrypoints.outputs.projectId }}"
      echo "Entrypoints: ${{ steps.entrypoints.outputs.entrypoints }}"
```
