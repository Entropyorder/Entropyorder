/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = '4gBdtAjU+7mnQE3flP0/RA==';
const IV_B64 = 'Loaho233gQL/Pf3x';
const PAYLOAD_B64 =
  'vQbDAohzUgHMTLViQBz2xejVjt2nmqsNkpotsc2VK/JtrljYnLtoL5pb9NHPKT9dBuamAABgl/L3mcCGOcFtG4QyPBL2YWM753UzzWPJRiHYidEAkmADcvRiqxqG0bK6FOBrJH/vaCl054iIxnVw31ysT5Uo4CKmOk9jvIQ0luJxJGkawgp6pw0DXV8S8oRdmT4GAx78bvDQs81wJIm1RJAS82AQWLdH8I8VtKReKQOxYlizyhjNrpBmQ1ZoDbyOYOLalEPw9/noME/n9Z9GZJLxYsKRSC7lMpSkbnnPFl1aouwKghtWLxe1GyReBeXuWeCyxvJsoPA1Zfi43Y4x/o2vqJ9PmXuvZ56xi8Fiv988YBsKh2TLAQDjoxtRb+o7AP5C7BPI3GFEuINMAGd7rWYRVXPQ0Qy5sR00+mI9J/cZyhfxtYiFEgnDfl5G9Cb9XW9La3UrVD5p1HmgxKUdvauR8UevTJuaVOcTfssUlUdV7K5fmHiqtIBQcoDLjlEL1gYuZjoVuHohFOzKlJSYc40nlWeIxtnImUudxxeCf68csvktzlVmYWVB9WfJ/lloJ/xyfiI+y9cUdKKQUzTbVYoqB8b5SRNuTTe1+Puv1CUEWVmQK8c0i4mpTBFY0VcTLIN5tzhTofx5MuZG+pyzp1CY1lU3+6t/0yrUnflEpmg5IZ8h95rC/INENtQQku93aT7StrC5WS1DBM3ygpnLXntG6SqaPNstRmSovDHsnmbP+sFyZvx0p0lV30aLC9coxpSxb7DV5NWmZWxp0j4coxpOV19CKmVvDld2kaMoNK6uJzhOrVWl+2aWjjO8QnhDTRBs3NIpWcb+FbZds21XShvk5vTF/OYkBG6GwbKhUKuBvGLBH/uOfE+7n+aUI/pjFs4tDzbXIbkxg8EXaiAhEFBglihZWPuIbSq69K9Wt3VkYHIMDjmNgd4y3YURk+2ZIGbccIWzrr5CdL6OcZDZuHYCaLtCrbZx5kil43OVQWqW9DcN5f8CxDmmomRBmNutJ2iflDmcYV6v6y0NRuI/7/DOpHES+S4Lo3HARequiptyjd0Nj8IWwhNOpIarIMmFVz7EtvIvh9kxW19G55UYkw5nCc9HmZxM4JmKJOzmODyMHerHht1iLm5LPttlSrgvDYeZTEHoisyUBt0DBY65WYnZLg4HN2FKhsb80W6KKbaJqWLeLZxIu0pbLx82sH+RvCw3vat+KaWggCNv466hCE/vFCoYyssoKa7m7Dy54bUiCuJKXAkrNLgiBvQrX7DyE7VvljS2kGtTFSNHQrZSezb0hVDzMZDaynV9FpgTNWf4TJxyRxYU6BJh2aULm13GAMW4a6puaE7VnzDtqs0t2ECmb0mBvea/sfQ3r13u+pPdOhj0T4kDbzuHnLgfN0lPcIJgn5crjY8w6KVUTVNcDvqnIJt5vyv5Z50MQut8BTu/QeknwwnJRVpox8IqXj+qizWulebXfjS1UgQK4td9fshsqTM2cwrQhiAT7spYXMDLhnoWTuNYzMTjqHNetcUW/KhrkcRFFDWxZEh94QxSCmsmy/jrU6oNETh41p+W2jYh7xLdpNLRP4A1L/je9EmzEbGIjJp+Ak1qtk/HJ6ULI0ZJUaAIb85ERSLoa3mfuqBukzH8tiUs0EYefGLX8l06zDcHMzRnaElhqdGpmy884m8VRLH6AkHc72DEqSFRrAmPtOIyoMWHRHbvXvwNFsq6ymzin8Ie3SLk9ctnKnj58d6hIi5+cIPd+5Wryy19r88nqp8srXy0cZ0EQZOtF9Cr8ifYbkD9/ChXbs/cnQLMHRGXfPWdBBGPpLqeNeoWjdvesqvz4znWHUvvV5B0gOxIJXYz1k2qStruC09FowvLJuhckszRgg1vhK/QxuO0iNGXxaZfVo8dmwtD8fqDvzdQE2i4LEElTR5mbED+TxJ2L2B0/qM5rMSfGrwWMxzusIUedqphkLekVw4lXdX/EZaacBTaHMqoaa4+jxC7M1UOuu9X3PeJQ4ZD7kMqeijc1PsHO5svUS/s9NHDmLgQDybftCCivovUOe2QZI5A6kFQht0h/UUDDKtECisj2twnP6dacWpOYj9bARztfs9NR2zvKU+romoFJRsPaK49yiODzXtMhyssbruMzmKSHuGp5NzC/j/9rX+OtifP/QsBIiMd6ZgLbZQ0HYWu65zPeSj8WwLt4ONeIbeMQbtfdA1V4ioRC+o3fXszCi5f9+Ti8J29Sy4+hqOix9zDr74RN2rN4Co4UAG6Q6nBWrUCoVqv48J5fZBXCDMyU3t7Jl44w1JF3PZC2/ounTp8sYTZFzWPysedPvbqV5w365pMBrvOJHfUnCn1QmUihYuO/lRC3tjiQENXOZRmgHCMS/ilvRgQp8eTcPCBcITniddQG9viQzNx+ezxOc+U+aJTVmyHgr9IhiympEj65f4RsFWO88PMR6MuL0kNqmyTrSyfg99KAJTL50eOyTYPuCQe0lHNQ+9TFlgY/Y7Z+6A+XSio4tLIFrzN7YpjNIwx8H0244dlrFxJ7qbE+TfOyg9vqLRnqR/Z/Ne7kNm3qphhCqVLOsfSDFKvYfawX47lOIyQzbrmZAqiMv6K3K1yDX8qFh5knelKHRQtUepQwF1jqkLqWgtdbSZnG55qptfaeA7N7XzABkEH80rRYs6RhF1YS95psvG3nRgelAK+uusCkdadMi2GcRWs94Rh0bmiq5OJHsbrvGMZdCcPBfWuoaESFy68efUneqfqRLnf3pSbtMbnBes2BI0uks4/V3TTS9p4Gkv49KgrbG8K8Y2a/pfSc03ghsYkvvvpExeU1fVfX+x0KjJvuFlVftLWjshnCn1T9inckuqtvO7XrO6FocZEoNolajsYC+C2rVp5CLuVFW2RXzU13nfhpJwfE7dPJzWkBlpGDNsisvt77f0zIOuWy/uet9Xe/QDT8ynQtaUCAUjAKC7sdxu3hZbt6Qsj8JvSJGn6/rEK0pDMdt7PSlBuaQFjvmg4mIYB8RSgXhDNqSHCRdfYY1p9vmp5rrP22z3OfUspFJPj7YZ1IsHuin3TjYxMj8LHM/bn9+TCOczvyf1Pus5Dkn6WZie62eyD9XgiOa/ITMM9vib+T3rnrip+L3f0p4uwvrmx3NGmWEpjd4786w2ETqbx7DRgIL62oZh2RXmBVL17dKdX/4YIqa4TLTLf3s33zRyAudALFkcfm8niBZTkmitUh3B2NYcmL8KSGa+HM7CzzEZJoEHrc05h+qfowoTAcEt0CsWyZQTAMHf9oZhVuKEpejnTvTeCxRnbecpoipDIMROr1greXKCLPRKxge+kQR/54OhOLyXfqk/Z+ILFZYtyQwxo+x4fOtZyn4SL+BoOv5vGaDHN1hTKzJ6+hzUmKmlHmab8NODclWY+eEtEixh1cAG2Pc8brpFqavaCogkR7uqM8XSEEfljlMPiXXbJWmeX3TDqEeqlrlDAsEN4jITIK9MNit+4LDOMfVSAiHiKfEnDg8I/vxb0K68FH5tNhXbt/VxQTNuSRn4Fbxno0vHCUEGpBGI7z8RfRCBJEwWER15PK5dJAABfRzF45jvid8IW0ICsiArqoAttYSzcy1qsPNFPHQu7ERpc/Atprq3gNy1jn25rq9WNrRI9jxJD8uhIHCBLsOUrLP3UcVgufBsm60jQCADtZeTiW3br0tbLnMTXkqTvaoA4vC07S49u/usXd+XV3hgITOAkDH75+WSQhlufRqshsrIBCqBN2UscpTZ0rDIlEjeZbpHvHPIuLovLJa9anwvwFmwFYlVxQSiHD3rclC7pWewXLAFPqqT95xO7wQiCfy6FMPUzX+B5b8VreBTFwqmBUZIsvf4CZzICVsvwZ4/P7pMa/j3oNmggx/7VAeWnUMnT2p8ahM+VUaqWMcbVP4Wc0ouIbAOtGJcucve/+2QTN61UUBri7YrFNska1Z4owP4YXWhyvq/lc9JQ9H5kx1egRuMs40PAtMaM/bui8YMGUOjjHS3l+mRCZP+oMWTf2DH/A3Gn00FOiAppTRSBPippsw==';

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
