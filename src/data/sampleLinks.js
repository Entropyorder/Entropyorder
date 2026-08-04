/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'yhRglk9jp7pSJeo90BZjtA==';
const IV_B64 = '/qntKx5D0lfSN/tc';
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
