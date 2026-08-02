/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'pAJmHrUcuB5y3vE0RBEOHw==';
const IV_B64 = 'YBRVhaNnFLsCmM2i';
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
