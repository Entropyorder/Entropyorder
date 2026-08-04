/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'KW8h/4oo6cDj2M5j9cIZGw==';
const IV_B64 = 'VhcgWWq17saw1x9h';
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
