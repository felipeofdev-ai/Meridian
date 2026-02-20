# npm Registry 403 Troubleshooting

If `npm install` returns `403 Forbidden`, validate in this order:

1. **Registry source**
   - Confirm `.npmrc` points to `https://registry.npmjs.org/` (or your approved internal mirror).
2. **Proxy settings**
   - Check `npm config get proxy` and `npm config get https-proxy`.
   - Remove stale/invalid proxy config if not required.
3. **Network egress policy**
   - Verify environment/firewall allows outbound access to npm registry.
4. **Internal mirror policy**
   - If using Artifactory/Nexus, confirm requested package versions are allowed.
5. **Lockfile strategy**
   - Run `npm install` locally in a network-enabled environment.
   - Commit `package-lock.json` and use `npm ci` in CI.

## Quick checks

```bash
npm config get registry
npm ping
npm view fastify version
```
