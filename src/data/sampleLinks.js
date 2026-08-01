/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'elzerEtS+x5SAlGlHXxjfg==';
const IV_B64 = 'OvaQrnzAErOJdQLR';
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
