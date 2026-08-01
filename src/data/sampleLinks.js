/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'ndw03ycabC3QTm3FkpI8Mg==';
const IV_B64 = '1GLAZ8S6wnqG/oiA';
const PAYLOAD_B64 =
  'Y3DMimJp2SGPkMg1+VVm0l0wvlHxOs/5A660oYrgivhjD4utrbu87Ynvhcrjx1FbpIInQ2FAiOYHcpRZD5ZDda6Hi4M+aTLyAryUogGYreUh9iMmf43e+1BuH1XPO/CjPdFGG/TInqKgtzxviGkLhiBLMxPbrLJLuzOiGI+ayMRvUlVg9x1Dke6d5coXdzZ0G1iMmO/YYoNv0c4gK7nhFyAd91fo3Gqat3mi4wubSIqhfkQs3T+sjuHefIZhH5AepYZ2ODMDIuUJRREd/B4vVz2nnpR+9a0ZICVHr19tkSMhzySN+aqWqdhnqAsZbqUFXgAsSE9AexlTz5yFFyoPLBReKPHLJul01O5Qjru1vFOn/KxvD9ICdMsVg1AVjnHqSoicmWZoyIo9Zhw8uaRXRQof5UD0FLj3k5OsWdnwz+ZTSIxeFpH9n2YLveHnhddcQwsk43Tpo86Je9Rj3sSC2h+RSBrPJcQ0NV7WQ/ZJXm1jpOOJfRcqZR+HsnbRTsV1uv4RBPsXhaJHA3ZUCKns2lMBwoXEanZdFYiKZOBZ1ny22LdYmfiWr4zTX0tzN2GoiESU+khnGLEsAZJ+2zATbP7ezyC9DCtqLhtVw8+4QVvUQ6oCTHQN63Yoai7+t27wjbSyoA67WbzyjgWT457vgbYNVxZD8rzUVYniL3o0iESHTDmPiiwMdWjgMWad122Pzzq8QwHamwOSE7ChJjo7ZsHZeS380S74T75tJFRLRWU9Fspap8Ex2caD/8Rzyqz8d3Czd72Cp/FQyY3q2eGCUpTbB17KlDFNFtNpy1mWqyOSIM4zG2+v1PRspHO88fi/qbLCZwmRMnIVkMM3sJ7exWVKKsv6enGVb3kOm6LvBS/uDWdeQOABtBoVguyeRIHuyGFVx5KbF2M5zMYhsbf5G+5eJ4KxQaRmYTBBet70YwKqhaza292zxy2XnAGgY5h+wzkcu2AGSTVufggQBmvkD0R1HL2GMXZ/mdLBXzT1L3rhpsOgj0CtqwAaZ0kYsGrHn2oWNR0akYZjZG3Jxw3X7THYW+WTyNW/sIuLf7k25KI37TZFXJeQODZs17L0GzXKlC/6QkBOZGNl0MX/+dnzJ7RKMwqWoz0KK960uwmLCiG2atcHcKwuwoEB9F2WKcxaHHs3eB+LWN/vmLjMWZIJMvjNNB2bGZLFPEB7r3C4kOgWJXITMeUQdg9GD2FygpU61dPP7U+BHw9A++CdR3hozdYVIhFXpheWA+iu5u0Fbu5Ot8F0B1KRB0gtJjiEYJfUvnxJaGmnkCzhqBTkZ24NHgk/OSaKXtfYzllrKsvkOP/eixe8gyFxwdUTyquD/LVgJBqyuiMIBmUfOD+Bq+6NybRZL0SK1Wot8KsSL2cz3SkhavXz30Aqj6iKrLiGGMqihkvwqmC+KRQkc/BGTp+rbmVCcf8WYzQFSf6tCvfoljvvYEUyfT4eDHv1qGnLvhsaSWVoBn4keQzRo9bGZtM+wBZs1ZtRVdr4CJ8+5SB6XayM1ILV8nb770eVGK4oeRqSCbZd02Nm3wc3po7S/cyAWTtVJrQ7pmn9bgoiL7CWNsgzV1Gte1iWFMM9xoSBEP5Fx2dwTp1LN/mzoLQbbkOJtSBTy4NCTF9L4WES0MV1RtsCZLWLkxXXnRSv3/aegGnvefz8AOgJ3SpflDJpcFtrJ5/AamyNjgG/iGzarZeOHaCs0xZdsPMVulJl0POUbiEw2ebj6wY+igdf6lMnOhHtdf0GUtTGW44vYeeH/2lU9Q9OaQ1HFw2QxloV7PKyxo3b4DTP1WUS//j9DGUNGJECWdMFLNnbFtNgmGND/LcjdCneb2hrVjSAYYKnHDRCwe9Xb4G/5zVP1fnpth5oCnKS31dC4CDtfc6R8EaCmiLItPFM8HaaG3yAq4uJ5c5XWosBxPEEaLHcg2izNaCl6vFGjOMic3v2vCVznKI478Mkwecc5wu+aQzWupRLnt3WwFIZTZd7R4uIkAxf3SsOZpZfCuV7LkWRUANovi1PHz70rbEOn06nQClTqSQpz2ScmRS+1TdNDRu7693PGoaCoN5uCddESAgwbdHMoWZ4cMatDJ57wC2LIrq69XFPAqBX/xbtbWyn5kMebMcj/pqrwpcKKT7xomSCtuD6elLGtB4SXVwtL9PMdQXB8dSRGshinwc2msS6qlYc7Tha73wD2T70IiUwMHO/qFFD2QlgeY4jfFr11aP9yzi6FTDHfTZKAiO8DFxEObKA6CeYa1tg8fopFPNHawEgl3NlWZo7cJKX31Q/jV4MWqWq8RPXOqV0caHhcq/dIWA3RQfHFcnD5TBYegySJZKN72iyGj4GlUbqIjs31d70B7M7ZMHUDtieYDUPkbo9px7tzBUZMgh79IQ4Wxv5zITjgLmkbgbrfKeKDQpGdJEVsrvhdL86M7L7TERKxzhrH09E+LZvxER+g9f80ji341EPZ/gOtB1X/VGtFaSKvV5/tOtRsCL8hQ/zYNt5qWrHyfVaf1ZHWTCh6IJ8euZftqw0+U2bTBkn5QemaQQsJ3mS7/lEXfEaCboHkSPDes2AfJYsA1PC+kTAW9Aw7XBO+MM8iiexrJReY8QV16rejKPRRHY8F3gWN3uM29+D8Cmtfj2T+Gntty+PDZHpHo0rgmljVgxuAuhJ5KcSO/R/EouMlJnkZEas1W0fpYneUZl8jLY79NLr2C8UtMmqSxMuAsviOw9sueSAEfmz2xKd7D67+DfOiTjy/w89Gnrz4Hq/KcJZ8iUXz2QgeOjKNierOzXRLkmAqxSqqLCouw+93u9Rbwb06tECPHrPo88S93zfjtVVXOYZIPMiZ7R5XkZUhDyotajW9k9w8LkiLXTwjx2N+0eaKHe/rsVOFuq1pY4MArM+WsKgQDzqfA+HDagI+HKhXdLP4WB52HzMIqJchLRZuh2ncRmUlxP0PEmfIfyxgc/arq0fmIvv4pozadTcXWpwptsgj9o/6S9Tmg1Jmr7d7TxgCA3tydpT8DMsTWCPXlRaEHh5S/GIcRPTdYb0Cb+uaJ90cpu60/kGU6ZD+PgnyeoiwSXZIPO8QzTvA35kiWUE3nsu45GG9baVD6KG2tSdyZG9YyXYINT3DGVfcONmmGmBzm5NyedrId2bqaSi7g7ztC2GAepIEqwndJmS0fkJfk8lVqcti8e+k+yvjxmYmMmwIC/W4YXfIIFL0F3mhMvWKS5BaEPfaMIJ0qL8FdjC+EwIAbsIBtwk92KDYN/aIXhHdVQ4DyLfOXoaQ9PBNh5c01is88681FR/0njH861QTWuBi+kz2rMGggO8ZJGmzVTXaIly3V/+0rqa/mfXFrZlyjXQ036E/5QbCjjxWZahzpdFgeN/0RxivAnJDivwV4+FLq97QDQUgrbi+RodFtUqZeJEaT+U5ATGRECKQ78PK5egiiqtiNhHUy4NjYUnresD4M1+I8fc3rxO/2v7kxhU58x+K0kS2AWJ1HSiRbWRvrfG1UmU7DqhCN+5qhPtc+Iq5hrVaO+UKjRW+LlGxfpspMXD3hx4oXCEigi83RAnJVjfcBU+V0GJzXyPzkSZraS3I3dvaDqb6JIK43c5CBaklUl7EDNQ/vct4+8+RGIqusuMz/BmExWB7A5XI92v2SUmPbGNJZlKktfA+KHq/K+XsduZI48aPR9Wg3JPa4YzYXO7GvfM+7V7C1OHNKwC2PJswiHH5SlyvgpSDQEKa0r7o4b+2mNRoDLMTvpte/g7ZMQ=';

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
