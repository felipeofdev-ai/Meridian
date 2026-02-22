#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';

function canonicalize(input) {
  if (input === null || typeof input !== 'object') return JSON.stringify(input);
  if (Array.isArray(input)) return `[${input.map((v) => canonicalize(v)).join(',')}]`;
  const keys = Object.keys(input).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(input[k])}`).join(',')}}`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function hmacSha256(value, key) {
  return crypto.createHmac('sha256', key).update(value).digest('hex');
}

function usage() {
  console.log('Usage: meridian verify --bundle <path> [--key <signing_key>] [--public-key <pem_path>]');
}

const args = process.argv.slice(2);
if (args[0] !== 'verify') {
  usage();
  process.exit(1);
}

const bundleFlag = args.indexOf('--bundle');
if (bundleFlag === -1 || !args[bundleFlag + 1]) {
  usage();
  process.exit(1);
}

const path = args[bundleFlag + 1];
const keyFlag = args.indexOf('--key');
const publicKeyFlag = args.indexOf('--public-key');
const key = (keyFlag !== -1 ? args[keyFlag + 1] : undefined) || process.env.EXPORT_SIGNING_KEY || 'dev-export-signing-key';
const publicKeyPath = publicKeyFlag !== -1 ? args[publicKeyFlag + 1] : undefined;

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const { bundle_hash, signature, signature_algorithm, key_id, key_provider, key_reference, public_key, ...unsignedBundle } = data;
const recomputedHash = sha256(canonicalize(unsignedBundle));
const hashValid = recomputedHash === bundle_hash;

let signatureValid = false;
if ((signature_algorithm ?? '').toUpperCase() === 'ED25519') {
  const providedPublic = publicKeyPath ? fs.readFileSync(publicKeyPath, 'utf8') : undefined;
  const publicKey = providedPublic || data.public_key || process.env.EXPORT_PUBLIC_KEY_PEM;
  if (publicKey) {
    signatureValid = crypto.verify(null, Buffer.from(recomputedHash), publicKey, Buffer.from(signature, 'base64'));
  }
} else {
  signatureValid = hmacSha256(recomputedHash, key) === signature;
}

console.log(JSON.stringify({
  format_version: data.format_version,
  key_id,
  hash_valid: hashValid,
  signature_valid: signatureValid,
  signature_algorithm: signature_algorithm ?? 'HMAC-SHA256'
}, null, 2));

if (!hashValid || !signatureValid) process.exit(2);
