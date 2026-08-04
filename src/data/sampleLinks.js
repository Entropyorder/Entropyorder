/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'xJ7TjQmChPOIzogJcuLb9w==';
const IV_B64 = 'ITmeJvoZYhAT5QIK';
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
