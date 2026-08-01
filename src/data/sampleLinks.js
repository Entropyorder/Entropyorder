/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'PeDcrKogHHqq6YGWDTdnEA==';
const IV_B64 = '3aYbMuEc5/M0R7A8';
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
