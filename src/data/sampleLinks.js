/**
 * 样例下载链接的加密存储与密码解锁。
 *
 * 安全设计：
 * - 明文链接与密码均不出现在源码中 —— 只存 AES-GCM 密文 + PBKDF2 盐
 * - PBKDF2-SHA256 200,000 次迭代派生密钥，暴力破解成本高
 * - 解锁成功后密钥只保存在 sessionStorage（关标签页即失效），不存密码本身
 * - 失败计数 + 指数退避；连续 10 次失败锁定 10 分钟
 */

const SALT_B64 = 'jusQNTon/PxBCLZeTYrLWA==';
const IV_B64 = 'vYjpB2bYZfzRamfS';
const PAYLOAD_B64 =
  'vIJa3XllrjP0SH/kI6qbjPeWpPjSBvoWDxWnttg7GOWLG0Y2qj71JVS4dytf2JqpxS7/21yNa6/n4r5AeZdiOO7zHiZwi6Ne4knFny4I30c9U6KzJiCHw9YPZrou/Z8Smqpv8xcPM1N1JKCCTk4YepJ7GkKMkv+7yDppV+L13wXKs/Rhhahuj8nvcCLKIAHCE10mdqeVO7ZsPUxyXwqQ3Fku+tu/s1vTtQUJ3wfDjs6cBg9WPD2W4q16fmHwEmmrnsFsSHMeCnR3vfUKGRviRo4UsgfWKLYisSDfqz6Qah5p1fJk7Yl9hShpYeHzvZMYXO1Ek6jGYDUEibZJTvV6vbADZ2HBhLQw2QLCuc6Op5QfYsC4lpTXaxYj7stF6dQX9vHwGzUsQnQPKCxW/aaPtIQRBnfMPezSzB/6H14hjDi63eWcdXUuqSYyLVrqZzDOH1yul5N+sl8i3qsA9e/bkR2RwFWVOza3GNO7IILV+M6CThst4eX8kM0NkM3wJm3uV8Tma7l3tbUraOjZUXynKOp/iOkJ2aC9p7k+VCNwhTFPdRzdI/6MDGo8q+yHEvN7XLIZe2XKioEDf6lV7gDKMAtNaIEfDYPWJWsW2XiKo1xNkiB7smPUmjTc97kFYxwV2v6OHEPJvIauCwoTyqpcxWffFhddPg5bHzUiklnjKCcLxWSacwnNMCHi/hGauoqhou7nyQCiUCklL9HVXwEK4w+5hS0enStMZt/ZWYRCs6qNM1VPRUG8wwfG5mD4eSGv2RHkIurtr7h4pjup1z7unqzBmNe2xwx8ucJCi89XtEjhsf/JrK9l49hyIXdQTcxoasklWtJYwOL7z5ZQSaruJbiF3DdrUbakmnB8lapwyC/n6V5FGhlBFmyUBHgkI+oPXT4CBoLYhHBI3V8USpZunwF8qonTBvghGz56q4WlMMN/za66EfPjdbFpoCN0vBiGXKxi4Cu44HNYLI8h3kADXdwss+kZixRL2kmILL2m2fRaF5Q9Tmm+k1TcSHeEV/hRX7YD7eCmBH5sU8r4TSVHZPv1HN7icxnyPHuVgHPqAB4dWBiu5eGQ7SL9SW53mdhNZ6zpHi3Nahgy4YF/qg6WGkQqfBUE1wUIkkVgRoDeTXmTecZ2IFDjhVAT+70mSqNA8Ds/wLoAYI74K2319drVchg2QrQqLYokIBDXjZEUNa+L3q7jYCbfvY1gQh5a5+bVGqpDdlNWPtwcL3ipKauTf1ThjePWsworezIiTeKAZZLS1NoeYPHcXfD+5cGJ0CRZmSd6wu3UC5qUN4wSrlvGRPNmfEmm+2Y45jjAtuKJuhJbZhfTfdmki7PTa+YaSIBIRgUFVTR3M8zgqtmMv8ZpswbmuXxGTu/FzA+h7k3nv297H9ctsoWHi23M7i67TClPa4R2hfOLc48G0NQj/Wa4zMZeSH7VRd5yJif3JUQWvhP7A6N5PmijOhyegKAO05LpqdrO8BS9g870tRFz2MFdjclXxDOltPIh9yWi1XLPcPXRrcsH/1utIIeVcZf1Ta7OG2ZU1QcZsbcyyJgMGFRV9wXHMwsfVHDWeFYB46Ja1qe3slShfVmC7KyWVc3tWl/Eg089lKH3oO+DtngUERTASYyEVnxTNDFLj3PiGutZsYp8HhboZgzQGc5DuXVraJB+9D0Xh407kTP2wQG18nyFplh7xxmDOB13hSu99QIvjnWP3W79YMHYVwMCnbe+nSLgvY5mTG2QuMf1+b4LO+RBJiycr1oizSQnCCz3WvR9S3/Wz6NQL6j/Z9OrPp5YcFVb/6QfPo1fsY/yKsWDrBhT+W/E9HrSVRjcEbywTig5nCkr7cJBt0pRPfa6q7j4QMhefaJFpfsVcZsRI9p8a5KhVS1eTVHUCewQfmhO9J+auK6WQOKtIHl5yiscDRW9JdKeiVDtRjFVupFNChFU8kaYPZIpCY0VJLKyqJX1Vot9Oa6MhfJlxh1FT7Q6XKxtncjPkOSpdkVGw7jIXNSjSTCCW75qnfFjqsO2FWRIgsEhejNg2kxlKk4lIR6NKy6qS/aoOoP3DuRmxjNt3tEKr0mzIx9WgVorTcJTiucZ56fJy00nO3gxzgzhZ1WFc+exhBsL8+M75y47sVnRSSils9Yla5QHj6e8QhAMT0WYe5NxEzaccvKbTYVR+xndvvkORZI/8eyOV0It3QyD8ceQx/eXev+2A+kM/hAVcdin4X/jAB/hfoS3ZMDDnNRBfHTpJEX6Pd/AhXBf6/Wnfy2DFeX5I4aRcC/iY055xiblEOa+pzSoCf0/1v3rXApsRjgHdXmfPkkFsE/BUqVXRIOZLuB9Ba/K6ZWjc9OX/gOcq1ajGFvMlDOVxRcR2TOSISoMx4YdUmxjK5RuoDIxMtn4uv0kbAB4feNryiCP1/Gx7Famk1KhD8HN0Y0jy4N2HzE/xHza8N2dHUQ81rVqOYsfDyRdA6P4g7yG3ypYKVglghxbWN0zQyMlps25b0usx9q+LfKU5pYvn6FGORP9RVUZvGrVHfT0QQFCAtwDxFoqpJA0ekZ44WSBWh31UvN32jonA82E/pjzcFLRRAWNbpaYQBke1qlRZfjrSR+R7iZPBS2lBioKJT6LAIAbY/M4qYZ7NSilWRiK4/l7tXkPml1nkSUKdPXWNCvZEOjjRUoIswNrY1mygoFGSDDqiPvF0u1yjONgo5TGc0WNVx69sLGDCDP466H470t3JTfs5iNd5q0Tpb/wngy+Y+ObbFK0nQqbPT6TBBHgyqijyHYGUInNioAoKDUSRpjTllYGOlI1VoHV9+OvoU+7kkIRWLfVewhtGHSDBgrUDY5EF1kYlYqpvrykxafdvuZinCM6Tb0V7c+5tKeYF/vMjRytHddPKA4F/g0bQw6NavdcX6imI65AUjcmSKStLTc0n5YA1/vqgxaFSwI8f6pSKXLrjlralHGbdE85lC0RpN6Atd1XILZvJTbS5UM/sZnk8PLiBxl5JgbboPyBiDUf7e0nYvhnzlEfbk1fzK0YjLrMXxtkgIBPLWTSqi2N0/nfIBdrnDMfI7GFiWGc8GEqixG4FvOd4HJ1lgp3UhwaqyQPh0M3yNogGeOgYG8dIuMkCkN2W3+dROUpJiQ2NxWnqXaIOxEJcBIIwUr+MGaBwmo3CQZIy1CdsSytTFOtj3DRnZRdjMOcVwFLMotWk5WThUANxtixaiBuzzEJ6JxR3iAEuiROZ4SzmyXM4WYBJoei/HgGKq93hr0MsHeJwr8zLJY1msr0LfiPW7BkNRv0GisK853X2zSStHsA1B0aGv8yHyPVJ0mzy3VSrSiEDkm8zk/hmtOdzcLkpdOOPE0XKp/nY+Wc/Gyorx7LmZVXpClJ7g3GeHWy9HtkR9EZIFoUr+lGSbXPoKl+6gURLXPre/khz52nLe32/vcal6+kUQZ/UZHNQ+vHqLX4V+IwaoZpwdy+v/yOAyg/wyK+mPOAvDpnecAOQzSTTBfCqYyTWAhZdtR9eK9ApbPidZN8SJYyin2R8VxSGKauNGTo5NXMrLA7yCD962WwVUjpgDg4swq2Nel/kw+9EesygiDaAZkzD5bWZAvjEjlWjU2BI7Jsg7OghyF6achsCH5CAPoMEBGTEGIaeuhElBd3NTRW+zjYLDiy8WJ237KCXRHKjA+ZOavr+xFEdJLJIhnuqluccS+JsZmi4ZkLwrkUThRgU/3bnOnL9Sq9eoBPbYRsyEdGoIIZrNYCOkjR2C7eZFQz//BjIStWM2MSU+SgOgXP2VTWWt3Su5SLenRBDlWZco2DLa/Nd+TbG7tqRsTaMdKpkuzhxP3Y3j3Fj5r8zTsKIcAbTf1/h4ucaDtjuEZZZ5Gd45iHINlrjUfrCv4c0Yh2Pz2AdCL2cxOuUflkTEwmsyNHQ0MfE9UeHRUGlkqJmohFmVC2yTMLqwnaXem7FjfUPqz7QQCdmAP5G0X9prZ5W2A4H8t39YJTkosc4laO2+6pI67gP+fLa143srbP8JcIoiW4reyqhZhy8kI46VcVd/q0ItEVqeFFU6IlamSH5ehondGDcDkQVmJAuKd+/abN7koWuuOEutNjjnfXXS7izwbFla1bFIjvyv0l1gWvDzmmbgSX+bc8Fqt1wg87czCIDf12ONJCLILt4fWomFjt7Cy1LkBbJq9ULLGIuvxp4F+1rfBxT1+anH8sckE4V6QmCUHR+KTjXXF499PUj+MfaJPztvEA4w9gQQZLi2ExWvsbqBRtH/4r5hkINtTz0k75HZYTKgG0BBMOmSLeezV96dPKhGwCwtOB2wrNFiS4HzgCoIIYNjJASgExOJLafPZm5CrZ1KdKNLSnMUCHtIA=';

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
