/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '6bR8xIYrx+AntHg9Sl1WmA==';
const IV_B64 = 'wxil6nqKP+IXWVxL';
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
