import crypto from 'node:crypto';
import { config } from './config.js';

export type SignatureInfo = {
  signature: string;
  signature_algorithm: 'HMAC-SHA256' | 'ED25519';
  key_id: string;
  key_provider: string;
  key_reference: string;
  public_key?: string;
};

function signWithHmac(bundleHash: string): SignatureInfo {
  const signature = crypto.createHmac('sha256', config.exportSigningKey).update(bundleHash).digest('hex');
  return {
    signature,
    signature_algorithm: 'HMAC-SHA256',
    key_id: config.exportSigningKeyId,
    key_provider: config.keyProvider,
    key_reference: config.keyReference
  };
}

function signWithEd25519(bundleHash: string): SignatureInfo {
  if (!config.exportPrivateKeyPem) {
    return signWithHmac(bundleHash);
  }

  const signature = crypto.sign(null, Buffer.from(bundleHash), config.exportPrivateKeyPem).toString('base64');
  return {
    signature,
    signature_algorithm: 'ED25519',
    key_id: config.exportSigningKeyId,
    key_provider: config.keyProvider,
    key_reference: config.keyReference,
    public_key: config.exportPublicKeyPem
  };
}

export function signBundleHash(bundleHash: string): SignatureInfo {
  if (config.exportSigningAlgorithm.toLowerCase() === 'hmac-sha256') {
    return signWithHmac(bundleHash);
  }

  return signWithEd25519(bundleHash);
}
