/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '5WEIgHzcsgu1YqTzzcgG8g==';
const IV_B64 = 'XhmMD2xY4CpCAbro';
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
