function parseJsonMap(input: string | undefined): Record<string, string> {
  if (!input) return {};
  try {
    const parsed = JSON.parse(input) as Record<string, string>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  host: process.env.HOST ?? '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://meridian:meridian@localhost:5432/meridian',
  githubSecret: process.env.GITHUB_WEBHOOK_SECRET ?? 'dev-github-secret',
  gitlabToken: process.env.GITLAB_WEBHOOK_TOKEN ?? 'dev-gitlab-token',
  exportSigningAlgorithm: process.env.EXPORT_SIGNING_ALGORITHM ?? 'ed25519',
  exportSigningKeyId: process.env.EXPORT_SIGNING_KEY_ID ?? 'local-dev-key-v1',
  exportSigningKey: process.env.EXPORT_SIGNING_KEY ?? 'dev-export-signing-key',
  exportPrivateKeyPem: process.env.EXPORT_PRIVATE_KEY_PEM,
  exportPublicKeyPem: process.env.EXPORT_PUBLIC_KEY_PEM,
  keyProvider: process.env.KEY_PROVIDER ?? 'env',
  keyReference: process.env.KEY_REFERENCE ?? 'local://export-signing-key',
  tenantGithubSecrets: parseJsonMap(process.env.TENANT_GITHUB_SECRETS),
  tenantGitlabTokens: parseJsonMap(process.env.TENANT_GITLAB_TOKENS),
  tenantApiKeys: parseJsonMap(process.env.TENANT_API_KEYS)
};
