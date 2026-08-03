/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'mnycIIQC+T/g7Wl23C+0Hw==';
const IV_B64 = 'FkTHxzwXV/6+8Qx9';
const PAYLOAD_B64 =
  'GtRDsIH8cUSDCAIIzQM+r3zH0FouBjncZ1o4I8+RM/a4gQCzBgpS0Dgr9ToX6+MF5my4+ZG6GR/4oHnWHlkvuKlIOCwVJ7uD3exUoFaePjhJ2TUgd7Vo7mvzPL814Rnff9ETMjZwo6JbcWRhy0hHm9yMZHXsjV5DKUOuv59nv3okKipyPEdr6ywxj4F15oCyJUqTrx5feUOyy2kFAvvGLYLpoMlskIWvJpvaycZMu9iKLgwYcVbBCIYZYTn1zWltw4p5qWKhMSvVKPAR75bpommNQX55kmeVFEnXke8NxRo5C7grwjgdGCjMMIf+n9B6z+4d+tAAcvTPG4TFovHgxR5uCxdXeDzkjqoRsj4pfT2tMU1jzToWDqnWC+E38ZCZFejCoO/3YmF1NUmjjhP1qPTT1fS+tw2jXth9qU0qKBbHRgAGeeSRavRGWNHwTFsiF0mbqw86odwinkdnOzKGTelOBc40x9q6uJa0DI7jwZETsNpP66MsYbbLZRV0CBIF6enxZkAuXZIIsR3sCopo5a5SEXmb0ad/Tw4FrIjboS1E+1GJdnGOYeKJyKgGkkqDFpgaspV6AFQAXgeXDumE7f1T00ISIXK1R1f+6NkSaUplmeMO6A/hkC3bH4emcMhc3ub5q8MF+g/P7h0zlea5hge655ItIsIq1O3jYcjmmN1IQAHj5U6FqzlatweStw0gdmUPJ6eREYPaeEr15LyuL5O3vFabkq8D8sqpdGN1eyd2FBSgGgBVRHdlbK5E5Se1SHUhrC+KqtMR0dYAU3F0OxGRUizBNCvS3HSeQjDtlivJ778kk9V/f6D2u7J2qzivenNL6t+hkAJJtEe/iiFuRdnIaxDAzGaFrzIV/5AET5worClJCAffzP7HNNseObZCN/nLR+e6HSwB6FzQwFOTqKnvjIoRkVZQO3BHtP9wpZ7oZEGhLq0Bq5sDMJCZQcK0z4JEy46q4pmjBWSd7CFOdRxEWwYsBm94ukl6ce7bG2yyiYIjW3rSMNup76AcyE8jBQY+DNRkZCx+IqfyFyh+HFxjoJ6ydyBmH23puCvVU/WSnzdifOtuZ17YPjv0n3DIVl44JXNJM06FPwcJFDBG1RPmbzZIuwMPd0c/PBPgjjGhz3HxWY1i8Jab5JbtFAcCz/GnVNokN3lE1lyYTA2Gp3RxSj47OojpZyHE35Mu5IXbsM0IQJ70fZp8nKkIn2kUTExwvimxQikm9jvr8fUxwifGLThhXiZVGZysQWCx0FlpQLFWs7/J6p3l3Fc2qUyXNsynrXufrC3VakCH2xNBaD9rsvUiG081ROFh1gKzLZj0PhcncbjPovGCLNvZ6NlkwwgDMQetU8bNpDDQjPE4vAfqfv1tNE3/Bm2X+W1IElN8RCObHwTD8LoXpyL1G7NwMajDXSAKceYp2Hot06f1+9BTf+LWfA5vMJVl9RpAILqXW8voO9rjBkZqZPchghblhJ4qvfsyWpE1yujHNFMYoJIAuNsv29XutdvydYtj3EgFoRFfLai86tfTBZoDUR+3F/tMsiE27UA6tsy2X+DCzgjJRsMnsIhzC+Lfm0zp5oWQPXqtASL8krFMUf/hNlu+UisdecDwiIIRd0UmeI9eiOZufjr/hJWC1gXBnJegWUvyg80S/WSSbU+MY5tD5w+rJ2gujBh3mpdTvXG1b/rTFT3ffOmi5vfDWOkTZAVOz5lwo5lqbIf3LXYngBDIq5HvFli3zMCDzrlXXltXvPlShE9jvBAVm2lZXvQgj3/EQuCn8BxgwZfpKWff0RSR588PNhp5g09dBLuz3KRS004jOKWKhUTbmKb+dURDYdQ6+CAPOFl1xyFmavgx0g/gNulmfDLLFNR8UIJ5obysI0STyrBfWgUM0XqiCVcfRZKLcLNkc1rVSCrE77llMAWGtahGJTjn+/F+BuWp5efghkMoXfwwlPa7QtAAghENRpzc0wPXY5ZWQh5umBirQ0RjCDqv2PA1fPnklKdi7fo/cK040irjvmdFcG76phURWN6sd1MLtkkJTXU9cOsW6l4xCM/twNLvE+VKnlngYec9Sgz1b9AqgIh3RNkmTqTwBJ7Pyq/kASXX36iMHlT4M01gFb47JgA65ywWIhulhboPzaSWlGbYaajrt4xmMqQFA3mc2y72E9d8dEM/z5XLvl8AxEeR5zcuTTDgH3uMrKb1jfmF7qVVMJ0cFlRNq4kySwW+R7bZty6apR8dqK/1a783q5qhU1XxHGeYD2TWvcjGSP4DT+Ec3SQ0t5EqUkf9TPDuMSDe81o1+laqaMn9VgZ2dOSLs0T744dgbDP7nciIb99QVtj9e2tshN/UF+8ALLPFo4c8IS9FF/+Tg5s2WtACKQl2PeZifZDDgKZIXGYs/a/oTOr6kvavXjqSJjbDiaF7c5mBnAFY9ZbabeQPykcPRZj0KyglAWzMRNn8vJNCTeQ+EWx5zky7XNdZhV/2zmvtdDijfvl31NtXv86QamKgT5ct0e4B4uG7YtLxZif+N2MmIt69by6EOEFewio914Tc3cnuV/Oorl1jhl6jKa5Zz5aWznBdMK2QdH1UBLT6D/OXhczqAY0L3ITYQ3RjpUmBPdru74Aoa2sn5OZwncfgwbpMIVzWvy0I7EvhbW2a9YwL6rZmBPNa0RpDPOB9iyXpHNCSHoKUx1sV4O84iG67Xlkloa1yIv2C2a6tZYNDwRspmP2KhvKhdEDSAkX3vmhVPVAMyzdyX/Z/LtrzTkQn3BVt0IyjE8EmM9o1n21vv2U1fDhSu/lRYfItyi7wwlEQChnlZRKHWs9/GwhnA7gugqTMWkjsq+GVdjXj9ZTT9YwZszD97Ah8joJ4gAXi7bwubvIIaCI+StYKDVBAtoKE/DaJGjQycm7ibKBLtx9VP8SsoJbnibjbxTO4ypz4DWB7FN+BONX3OJO4/KmNtaTsoF7zr2xC0ivJL65Bo99oYr1T1wXLrgvZ9f8ynLBji/GsDpJ+WhlpkpAGTic3T9H+FpW4N381affINMBsHWQ7coXXzOclgeTGi6rkKtZ21Z2MhOrqoVMRE6nopmjnhpWe/gBnFf9NrRweMNdvdK6BkP6eAWQ0OZAzYAtNOsXffeU4KliJYOdleJeYkRBZbmyRUCYpABFPGUM1MslkprSyUyd1jYa1IPMo7gtzlhAZcbBU7qbmlpDX5zTiNZJ0zJzEb8ZIZI1yIPqLO80l6OB/cEsa4H1dBcjmDeGMP7oMcyR/40y4Tbff0wIJTERDOS+XAJ3QFMXSSOeDQgVeWBoQOIavIDC38pwY9/QH8qcLSQTgyLiJzfyEGxqy7VyVC2RIaqSo7aG0wL5vqPh+fHssn8Y4vECleBVfrfC6Qq8MycU9YDZpUE9lW8II8zy0mnVsaL+4fADc1Zho5kuYv2OS+COfRlvzp6QzyrD4p/U7wBlXLfo0M2Beccr6kNduAFrImM+2QqJF5UjgT94Sl9/Dqfq2bvMUPh9XejUWM4q9IQf9wO9bSbJkuGmrqFXmwT+LJsR2GnA1H3hFXk0avfDdPeTTpl7ZYdCjgkFj7QQJGQlLUS5yXZjN54+ufn0JNiFRDERKznx9gIUTm8p1+WiKk8OJgRRktSLo2XdwBvfiM49wWzunDMTheZDtZsFMji4EU8tD/F/9GSRBk84R+y2nGbHs/3lNnyNKjLbF+d5lG5J2q6c4zdPTqd7rSgF4hxW+biXgDiS9neXNCVcCqd4R7yvLA6kZR3RB+ybQhfXKOK/S4YGcDmuU7MNddnBPxQ2w897k5jvnOfgfx6SJm9AbJshbmukCdjYJ46j1fzRJNx+TOpuyyiJMm3fNc8AhK9De/LudNCJ3rc/PJFYEPokl8QnRxG6u8zLFM0CbIBq8Xbp44dEQb/D6UY8cu/RFX2w1uUQTYQsGQnE=';

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
