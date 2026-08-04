/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'seJh0yBJflA9Vv4NlL8Fag==';
const IV_B64 = '6qhinQ8S77d+QsKU';
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
