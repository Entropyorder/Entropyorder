/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'ZACA6ESKlI/malJNg/tJKw==';
const IV_B64 = 'aJA6+Wi8ORC0AUaq';
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
