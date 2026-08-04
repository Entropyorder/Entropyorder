/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'kjzBiCBgDV/tKNLhw581xw==';
const IV_B64 = '8dN6lxrrYWiRCTH4';
const PAYLOAD_B64 =
  '3IyWOMyB72ar9FBs30T+ye8d4sheUHyuJ1YNGnfiaEJxK72ciN0/gAxxoqO6EIYifWwjvQM4aJl5tKAKEEwwJyZr5qKgbmPzmSJGN3jzr5yutW4PfoNIN3kz6G1+YSzcDsZCxlISs+gWMNAXQ2udZs2nHJrnYhJm9Hd71029//86BLvT7/YhddPchGyTV/h1Mo2KLUilHfCETCleWacY347i65B4MG3dNuUBe4WZ4H18XIIqugxBIbcoTffLKQaKCN4suqWLhrGBWrzNLxoQ9nokqCLGfDK3/E5iqx72hKhnS219nu09ht50326/7PMpBClM+pdTugwwsS8v17XTxKiHfaJoR4gGRzU2VeRWBdHK5r9eWtDX8IaCVzMKMFeFaVxkJgMuStwrSwPU2LhVyVAl2MKsO0NxclGsULvi0g8HewouwQUxv6lNcz2Ardz7CzzJq5UWoWB5PDROa/EbVBop5/9RCquLKj4j6gmwDDb7D6US44mzsxdirqRyO+4KwbSWyssmc2ceHbC2RBtTLExT8irks6RJEAV5vNiEB4icSgNDSM/8lRhQh7fbBFytmtmzqx1IUComvRIQzh0J9jhhqf6vvPK7Vxmbx65cn6T1/tv5hJ5AehUfZl5y7FHJ5ucXidYhdODhopRBZCP5JZKILpow9q+J72hSZJyana/EcRkt1QR+FZRk66Tywsa/LrNdzcqB0u566Mdhwc3ywxfsAcSIi3TKq/pDhw52P0Fsm4mMg6OZJMU+EmN5jS182sJQyyjOiHjIkkCFVJmRcpW/WJcie8lTQV8sH/4jX8HC+I5xmXvevcqLD4kexrEQy+/QL5rwq0lKtQgCTr1m0Kd2wt1YxMpMhWLNSEm2KgJcWcoej3J87JUwaWvZBKESo7q4NWTjp0E6jbL6ojZLSVjS9h7A/P0H1ta3yjFU/mFCVRKa5nwhN1NA6uiVHwdwxfYVESYE+Tg0qOfYVpZTqNa7w68r3xDzhuSajlVIItGO86B50jhw/Q3oaQgwlHs6tvdRiFoOW8T0xSnb1tf6RYnfgD1ppgJVS9X4xqW3ZGJuaxwo4iAOVgeDIoIyg7nBfL/V03s/dIqSutpk/bYo982mEHX19c6MrDKssoHNrxyaU2m3wvpIzWcH6YjboqpAtyNGB3mWu29eRiYLQrXUXXKzZtRHSSh8TY2Izef8TV7Q840yvxat7eeNI/T1S3JDVO6q/DK9ahwoez68VgCeEbrhSJZHLj0j/V5B3lVmxu9WsqmF7QtAJcnOzLHart7kZ/vaGiva9uAvE2o84iPEADmXszKWbD8M3p3UOEoBzKGveJbWLW86CbJ4DG4Vm8/E3l9HmG5XIJddztKruLZrPjLaRQ7CXZDGGx0LqmLQlXw+0lRIf2snygvYXGni3NJZFMZUKMYKkiCKtwMBwzYPDhRYNsvjH/zexDgQfvxxMbR9zppyJyVROywBoCKNYQoUAPoiTnDIK5MuVlB+FXjJBH2maR0wiv7LhZoQhPIwOxP0w46B3Z58K9CiOj9KyK+f0wWTCsAzAZ2qhS42rlJlbMmQYqbO8UeGWHUGJTEVlzoiPz6solRQ6BPUvvsMc2V1TdDZLq5rVvOfXCwSOVLP/VuZ985OcUx12NcETNMxS6u+8UTM0WHaBhNiIF7cYfKqsYUneYmZSiKnzV8qHLKbXHqOnxEoSB9c8AVoDwcodqJmuFKEqKK1jeehx5UE3/uZIEuhN3hXMyL/00nxfcWBHL54RSftL383rWJ6mB0BR0HE46ONzRQoVIyUIeiKYeWFVN0arBKWOCYy9KWIGUGRyBYH9izJ/RL+uctbc0FC2HpZ4ZwSB/KURUugwfiVL/eHV10HTWywx/lNza7Hn6Z0lPdZ8oudH8PWlBriFxmOUceuwShVTtLJkx9pr/ljUnS++UiRDVzB/tL4AFWRqG/AV8xqQV1pkHK20zCPty285NKLwkZHns3wD/SNI3NA8V0dYWqwk3uiGQ1quvCSrMRfOzlEsHTCDNeiygkN8b7CYNgxgt5KQCcIL66J27H8AboKNMw+h76w0bL/cDiRFXNx9gqvyIKtJA20/j4ZsxCJO2bsCJxJ4RnVcAZHLjwdJXe9+Lazxm+4QreR4NHyFfQwK9HWPoAJ1tVNQ3tL7x0E2AkmgVIn3jyT+K+Um09OeaJujFNVCYAPXS/1suoyRsnF8a+wUapNFHocrwlFQatBmA8o82Q/RepYJ2cY7dEGBsSMJeP0mR/5Tn3uEzkwsqdrjYKo4YGdxM9LpWcHMyT4ZeQ9aK3eUT161eJuP+bcCA/UURbtO4Bgtm52gEWa61uoKzHVdxsu4ZDunqnMCK7KIHG4vdZR+/gdClAxQZOpdoVmDqnT/Ci8G7vEU06GRvkFfk3ScoYTHUHawGQu0RXMVZ6TCCPGPopFb8pkTuZSRACrDZbjSb5hQyJO9336+YIEjrAfoTHl/csIUDdYONAQK3qTJMrmIfrjhvxS36+V3C4uI9+79HmrSWUHhdA1hXF74cbJA64T7DhRfg0///+o14Bj+NQAEJPHi75XlOsY7D4Mwg2AvyqmMLrZlumpor8UJ+sae86XWC0/fWP+2x9hnZ31pOmJXrUSkCTh30nln1KcYE3m2gWEE2Y0ahtBp+mXRqKwdUoQ94GH8NcvsWLrFDF+ffbZ3b23M+8kS3EwuUYYvCjCc643Kn9whzz7yipfc653z/Rrw403IdzcOM0NzYdvWecOvjk4Ge7R1sOGDq4foaaIxL387rGWV2wjtc12DwU9acXl7vtZ7rhPyYk9AYC8FzBdmhUgRYbqgYChaTBwLsZ98zGg/2udv7IU9bau7NK0vL5h1ZTWqxuINNupsOcGw2xjPPAms4973aRd+NoM+L90qpWt0mbPko2lK0r7ySRpIUQhYbeoY3Si55Nz9CU0r+u7o162ihfUFqkvP/tvnpV2gaagX9pZiKuNASYJ/NdiNn3bgP2meTotvok/Ik11O/UdD0EOC2OO38WG/jpbzo+ADZe/+ueMW7FTPGpiEXUmv6AVVmaj5BPgNNKGEYKabUXuC1L5DNdY+uoN6fLCHZ3ePhMddDCMIXTPiqchjAe/PEPJ/PVocmpShyWZU+c97/09UkNQon2gO1kBDQcyx/0bTKxIOGHAAIKPGyrnlL8AB+ygIPdc+Vv+/FXsQUZZ/iY9vzVBWCSqMgknR1nOY0468NpRM5B5EbMI3USIGVHhyu2nom3mRF9rIqK+85YedZpeqFvK+EBiaBdNdz3JPpALHMGtLKPH8yJsWBOPq18dhImcMse/Fz6zlNjO5y7QCC3FzZarPmK9JukXKk519ijr/s5ikHKu7+S4nsvo1zQgMwBhtexTNTp8QHo9IBKcKhYGf9RtDRReSOwAE7t4GMza4amdnyeXOx1rOEKFSydznaKK4syqpBOndizdvZD2d0un8iloOwxFmxtF1H7IcxmUBuL+BrMO8S1FDnzV1k/kWH3jHHzLuU/rKSYOlzOm5FyhsamwiBr/sp4vpsD3HjVA2nYHnxW5L4F+cdbUNDCHK8w4RkTkcSOOVXG89uvqEq4jNpyxvfRnoDV6/aULiKNwQOjDHeONCbFK9pvtUP3VWtNXGS+i1y+dF+6I3eD76wKdLqZYPSOIaToTo7fvd0lluL05/8G5AcDOati8wcupPJ4EZCfmGrKtEB/DlUjH+bDTfCq0TXcgbtPwfzujp2Ypxiu3VoLf9SNT8i0JxEWqFFcSoPM7BcP9iHkP8FkrjYgc/fInW5X3K2rM0jIGZhggrJARx4DV5aDi8Lw1idPxljYjifGAovsCbODa/dwMQjxl58PMPl+DXnMDZR3brubuiDsqs9LqKx32kawyf/DsHcrEJ86wPDKnSWbrA0VClvKSiVU8boK3Zi51w9gIh38JtIFw5PcDTl+pI13MY/bmPn5Th/IYoqAgWQ8NvfnyJVfvO+T9pn4GsZQBiu/ijNRgUkMInvMWkPNV3EGsiTnzbY3bp0+BrdHrp8r0o3tMdnQ9K88UQyzri0VpSNniUc6J4OZl8d1W1Q==';

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
