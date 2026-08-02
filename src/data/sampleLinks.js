/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'qMnS4gqb0BgngchBq5QAlw==';
const IV_B64 = 'CxlfQeJ7NZNDuNoY';
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
