/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '22ffZ7nxW5tYNu/q263kNA==';
const IV_B64 = 'idxQe6fpNYj7BB0K';
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
