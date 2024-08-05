import crypto from 'crypto';
const iv = crypto.randomBytes(16);
const key = crypto.randomBytes(32);
export const CRYPTO = {
    ALGO: "aes-256-cbc",
    KEY: "sgdhetfyehetrhdyetrydetryfh12345",
    IV: "5dgjfh8urjfr9ehr",
}