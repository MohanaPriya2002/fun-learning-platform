// RFC 6238 TOTP — uses Web Crypto API (no external deps)

function base32Decode(input) {
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0, val = 0
  const out = []
  for (const ch of input.toUpperCase().replace(/=+$/, '')) {
    const idx = ALPHA.indexOf(ch)
    if (idx < 0) continue
    val = (val << 5) | idx
    bits += 5
    if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8 }
  }
  return new Uint8Array(out)
}

export function generateSecret(len = 20) {
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => ALPHA[b & 31]).join('')
}

export function generateRecoveryCodes(n = 8) {
  return Array.from({ length: n }, () => {
    const b = new Uint8Array(5)
    crypto.getRandomValues(b)
    return Array.from(b, x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
  })
}

async function hotp(secret, counter) {
  const keyBytes = base32Decode(secret)
  const msg = new ArrayBuffer(8)
  const view = new DataView(msg)
  view.setUint32(0, Math.floor(counter / 0x100000000), false)
  view.setUint32(4, counter >>> 0, false)
  const k = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k, msg))
  const off = sig[19] & 0xf
  const code =
    (((sig[off]   & 0x7f) << 24) | ((sig[off+1] & 0xff) << 16) |
     ((sig[off+2] & 0xff) <<  8) |  (sig[off+3] & 0xff)) % 1_000_000
  return code.toString().padStart(6, '0')
}

export async function verifyTOTP(secret, token, drift = 1) {
  const t = Math.floor(Date.now() / 30_000)
  const code = token.replace(/\s/g, '')
  for (let i = -drift; i <= drift; i++) {
    if (await hotp(secret, t + i) === code) return true
  }
  return false
}

export function getOtpauthURL(secret, email, issuer = 'Code Quest') {
  const e = encodeURIComponent
  return `otpauth://totp/${e(issuer)}:${e(email)}?secret=${secret}&issuer=${e(issuer)}&algorithm=SHA1&digits=6&period=30`
}
