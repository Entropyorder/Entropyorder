/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'kGoxevvt3mKPW92XFmFdjg==';
const IV_B64 = 'GawdQxoSbBoGDBxE';
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
