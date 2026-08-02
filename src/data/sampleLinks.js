/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '7jlxK/OtAyjUPrJmchMyvw==';
const IV_B64 = 'lZ4JR5UwS24kyGW1';
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
