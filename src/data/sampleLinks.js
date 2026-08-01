/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '1sRBPvzw6KQdkOfyJMk1ZA==';
const IV_B64 = 'mePNumpaGzwqcH+a';
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
