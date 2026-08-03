/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '6Z3RdXZEdjoG0uF7tPJYLw==';
const IV_B64 = 'bJRdCB42595Npnjz';
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
