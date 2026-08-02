/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'Aj8hnIyxch6j9Vh/zZWzhA==';
const IV_B64 = 'g6H9feHfz5L2B9NQ';
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
