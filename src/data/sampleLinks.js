/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '1gxaBLX9NSSl3BQWTaRMRA==';
const IV_B64 = 'NnjCB6EFSixGCjr8';
const PAYLOAD_B64 =
  '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';

const SESSION_KEY = 'eo.sample.key';
const FAIL_KEY = 'eo.sample.fail';
const MAX_FAILS = 10;
const LOCK_MS = 10 * 60 * 1000;

const b64ToBuf = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const bufToB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

let cachedLinks = null;

async function deriveKey(password, salt) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt']
  );
}

async function decryptWithKey(key) {
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToBuf(IV_B64) },
    key,
    b64ToBuf(PAYLOAD_B64)
  );
  return JSON.parse(new TextDecoder().decode(pt));
}

function failState() {
  try {
    return JSON.parse(sessionStorage.getItem(FAIL_KEY)) || { count: 0, lockedUntil: 0 };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function recordFail() {
  const s = failState();
  const count = s.count + 1;
  const lockedUntil = count >= MAX_FAILS ? Date.now() + LOCK_MS : 0;
  sessionStorage.setItem(FAIL_KEY, JSON.stringify({ count, lockedUntil }));
  return { count, lockedUntil };
}

export function unlockLockRemaining() {
  const s = failState();
  return Math.max(0, s.lockedUntil - Date.now());
}

/** 是否已在本次会话解锁 */
export async function isUnlocked() {
  if (cachedLinks) return true;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    const key = await crypto.subtle.importKey(
      'raw', b64ToBuf(raw), { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    cachedLinks = await decryptWithKey(key);
    return true;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return false;
  }
}

/**
 * 用密码解锁。成功返回 true；密码错误抛 Error('wrong')；被锁定抛 Error('locked')。
 */
export async function unlock(password) {
  const remaining = unlockLockRemaining();
  if (remaining > 0) throw new Error('locked');

  const key = await deriveKey(password, b64ToBuf(SALT_B64));
  try {
    cachedLinks = await decryptWithKey(key);
  } catch {
    recordFail();
    // 指数退避：第 n 次失败等待 2^min(n,5) * 250ms
    const { count } = failState();
    await new Promise((r) => setTimeout(r, Math.min(count, 5) ** 2 * 250));
    throw new Error('wrong');
  }

  const exported = await crypto.subtle.exportKey('raw', key);
  sessionStorage.setItem(SESSION_KEY, bufToB64(exported));
  sessionStorage.removeItem(FAIL_KEY);
  return true;
}

/** 取某个数据集的样例链接；未解锁或不存在返回 null */
export function getSampleLink(datasetId) {
  return cachedLinks?.[datasetId] ?? null;
}
