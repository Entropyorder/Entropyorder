/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'UEo21NxMQLtE7oZeKK7rZQ==';
const IV_B64 = 'GUfafOyMP7YXXuss';
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
