/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'u/OLOzzHeeUa1AoeAAwHpg==';
const IV_B64 = 'a1ddJ6jGCvcPRyRh';
const PAYLOAD_B64 =
  'ZReUinyoQn7dJpc1H2OsRSEXlzkVB3oHgZEFsC3PKAbiCKDi66VNcI5gTkkHDgfvB2mke0EOzp3Xr9KImChU+kxsudmdgvPj0TgcyXqVEm/QFqhaTvEi6DcwwR4B0XyzIAQkWTX+at1xnH0GaFFQv1RfGU0aJhNaFal0V4/LkFzszYS8awGMFtmG+ND8MC/D+Ii6VeYvv732bQtMfJn1uUjriQYNns4FgfHHqRbuAWT15auwV5Gh/mT+ph34DbpQC9VT7wletud/h01Ig4sLCRzuMPJb77tkURghJcx2a2m+DtjK3yMk4mstsy985rfRgNtli4Xxnsu9GnkLmBJ0vFk8jEIdoFHKbAGoN11uatBcEJWbnszMKO/fXRxt03BZf/kHmUbMDQ/BkGvLxnlUTB0vXlrZDGoBFvkAIasBhOXMLirfDJZKD8K4c7+XWglF7tfiYhlhDHEHNNpdNEscW2+VZyLHJ6O4oB2p5lSz79yyJPyEdj1l0HlHxI59z3L3SW2chszx6H9chYsqaJ5r4XqcZ5mRUSFW+jgItDUvozrFSAC5FrJlC45iHbp72XMRGB4DXbNPzZLxEocqPtzdBWd66fb9I5BK+kjxHnOXNeV2FxW0iI2ctt/UM4kXwsbpO7UiBEl33jrYmCZk/AkE1L7sKIsrOizHHl6pC0vqNIb6SLmPsQtqf8n/gYYyQxywT2ilKuKQfi2X4ERJ3pLIeqYguL3AixwZ2PhAyH3RSUWnnWCFpbUg3aBY52KWgsoueJ+fb4DOTfTDsqwoScuysYRtAmDSwytfbAztLO9hGbtwcrM7Opy1xWUOoY8tP/AOwwadwyhwv7fF7gM5D/1npDSwGipnqpldEX5ZL7vyiAR3o8Gy+0O5TPZXVjEgeM7v60iOaSfCUDBCeKL1lt0vXZl/EBfD1Fb/9xsJaqXNZJxpv671RJ4WkZpakSqXkF94BNzWW8prAPjSwUaIR8F03BlVenjZJiOq4DU9pUB8mNXj7SycHRxTUZYBHxI7O6uaSdCPygLZRNuYm3jwfUY4/jdDz8jq/saUgmSMUAUZzRGs1OeMNojhJ5wXbU+rJo5tjYLF8RPbdxqq/kV3WRdvjP6+qUFRCPpK5EtRX3p5UJF8OsVPRxAZcssK3w8Z6xYLqh5qYF0zCOHxVpKcd1rrtgtantNtC1bnClUmIJPdaUDVLsgWIdSB0rIlbrLJYJeysk9+yhpNYvtEWFIpnzWYuYwz2r0FE8qbdgmFp5kodkqSZVC82xB6GMgRbx4cVRsBvj2Bi3KGjpGgPdnv/Tk+zAi1Ee0M9XxtbLhDzhPUZbWinFjQW+/h+Jg1/lVXUugd9HqPPKNjdUQoo0zwAgahDxwrgsGyShx9W4XFhZ3KIVD0FsEYj6SjKiBihrhg05t5GwPYoOqLzIxAUquoAWDYD2UDGMv8bbCmAtDjPmeY6MFTNEtxy3WwLhNB3CJWifRz/12WQGZQgQGAS7XReCqXySUuCL0eBfqst7KlZzG7yUwMjABgCueKvwxQnL15ql5aVMamikcFSiBguMjb+rzV1FNCDS5m4YzRnLQIKxtcxZ3XlZPOzA1OAhMIBtaceolFTS+CBy6WNYNAqRRLzTt1Qyc+gB+cQeftc6TIZmhF5FJ4mfUcBP0jg1w+4pzdisuqqL8T7wU9E3AP/lLpvMXD7HEmm/xBRdVFIIBD9XG3pB90Ww2zeHDAeKgMub2pVOcFL0WeMRbvUQO72VOO76hkp7lxeHM49bepUb5TqdzofKQB0+1+AhgAhQ2bVX0LH7+9BX1ffakX9P/N+kr2VN0ITjVxF2wDKfBQQyB45I7e7sjOQ2iVW3ehZjxw4+KvFVi96xPGUkD6XxlKSG/ydva3evXWL8nJHjPUCLkLZwCwZoKkoKkElaGH3x83G7KmCSsV90U3+U2fVI4P9nxyu2EARWRKfxF3TLNIrlVTnYa80M/ID4TrP1db+iC6xmWNZz47ZjFiNpk1suVHqa1wZwBgM8Pwja6lzvqildQCiS6pY3f7cwN/E/eHbYHpmkxXOLnZcj+cYvfDjntdSnwBpyZGE/FPOwYIV+ysk9hlcNHmJosN2m3Mzu9PaMQFaIUoKqpJThgvrK5sXTUB6rzI43a4SwQOkviVCUdhNsMBojUvjAQM56OZC5otcl9AyvR6JZdpeATmJYUoHUMUAONL60SLfMHx13PjK3Vl65dJTo4ZXFxNnsdXSUSXkyq+bpDS3sXZvwhd8/Q5ukRKm1mT5W7cSkwgPkRpML33wD9ZdoTbVOjkeE2z0eErqoTt+rmU0+5gyvc1U/AB9HQejcxVd2zwhHqovuw5Ec8pCaNh+mBdkNgzKUKnIK0mq3THYG+ny9/3UkncG7Qvm1BRNcYJ+MfZa2/T1GRkHFathZ2618obhMccK1GawZdsFxLNsdm7PBmtW7/+yNMFx414gO0pn2+3P/3CurcW8j3Nrv0GsPmDssZeN1p77wazied/rEiJL8a/aqwnt5gbSyVprlT4CBqiNNXRsIX7ZZIGvO992g82yfU5SESDGHJBPs/zYz8eU37c/K64DXGcxc7X1V6/Z3eKgp3T6nH3J2K8vrToOhbP8dY+0gkSL6lyWaK8+oCrVskRH43jV4HaDgBmfaZbdq+/NpEL44zlbFiihivzwVIfTAI6VPmZetEvYe4fGqe1WRC9mdrLT/yQwuOS1YkSJMdmD8tKeh38ZG8FEiGkJxOLVMNZiLX8XBW5s49ufUHrHS/G7Ed+3HIwUnejyX2bBSfxfYf6XaNQioaaAOysXAG9T0ighVtGMnyaEP2PO9R3vJGc3dN4KUO3AusCJSHamfpn0LbJwBIeo4ih4IzGZ8d7ZUaDOUR554Fb4d9Vgfd3dHnQlFP09Xx9U0Lz8l4WKSCsMlAhvStLu+9L5FEZUEeb6IZr88gXcjljksThwXdu582LGarvuxc/xjy1sKCF212FEZhp9i0SgG9X4yjSdmT7qBwf9wIgCgvOf/2X6RBBSrsc6Q1l27c1KeGLFYxG81YIYTG0pIQPboD3/hKA4cjsh4USHrZ46gSLzW8ZAwYxdx0nCOS10F72O7PR3v8MJI9HDTeVg8vWSmQiKid7PKbdkIwtCZspGtPOnemXjVKDpMZoTOy31nrg7nTNZlW1pF5uID7S8KplaqZ1MdmFpaQmRXEyjMiMA13NhCsmQqEqttf+anx3F8vaMCjoSPQ+e1Z+oZM3qgCaHMqvVKyImkfCXtFxq/cQJ27jj732aEfiZQHF/ez9waFugQmDH3NHcLtZnzSh+kBpPxWb3ZyRe4AXe2bc6xkYftb+ZqxXWWEpxrpPDJH6wqH5TjmBH05hx4azprPek2dT9ZG4m/eQVzDENwB/pqCqxZarkppZUSJlSWfsgEkCDQ27NcR+uz7k0r6gaukqHO2mWLhsyvwGxj02I9dzF0IG5T8V6ABrdzUyXyytUye20xsRmvSBbrDXUcdVNpDQRSFlPFOFp/R42bgiN19LKCAzLkK2hGG8BeXiqmOihoJSqtB/hT7awECmlxd+VF1IN+4mx2c2CjucoiM4BpQ+ybO8WwBGsT4AN/vFjaZpEunSdJs53TSPoG76BD2hcTA6pbu8uVd6tOOtQPk8tym5p+bXA4LinHj+crIns24BKe8nxVPe2mNZwUk8fB/+P5S90ByJhrEmuYt2PFsQc2ts1bc+kM/iNE4/NkGbA4ddWw3+ZY1DF147tZ/nz9DuWNN9GEO2vfg=';

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
