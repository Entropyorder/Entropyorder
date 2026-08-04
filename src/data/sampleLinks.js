/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'PJZC8Rw3jJhaJvARCLL/Fw==';
const IV_B64 = 'o2TbgC9UpSRceWcA';
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
