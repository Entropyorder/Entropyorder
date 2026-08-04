/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 's/hnS4Acmk21XJvEOgqA7g==';
const IV_B64 = '0yGlSv9dEhYUYbzK';
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
