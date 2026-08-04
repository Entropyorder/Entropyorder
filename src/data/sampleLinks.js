/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'EWJhiSngWE3A9aHiCkrekA==';
const IV_B64 = 'nYEfDfOlBroDelkw';
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
