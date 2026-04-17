import { verifyTOTP } from './totp.js'

const KEY = 'cq-auth'
const defaults = { users: [], session: null }

function load() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY)) } }
  catch { return { ...defaults } }
}

function save(data) { localStorage.setItem(KEY, JSON.stringify(data)) }

async function hashPwd(pwd) {
  const buf = new TextEncoder().encode(`cq:${pwd}:quest2024`)
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')
}

function makeSession(userId) {
  return { userId, token: crypto.randomUUID(), at: Date.now() }
}

function sanitize({ password, mfaSecret, ...safe }) { return safe }

export function getSession() {
  const { session, users } = load()
  if (!session) return null
  const user = users.find(u => u.id === session.userId)
  return user ? { user: sanitize(user), session } : null
}

export function signOut() {
  const data = load()
  data.session = null
  save(data)
}

export async function signUp({ username, email, password }) {
  const data = load()
  if (data.users.some(u => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error('An account with this email already exists.')
  const pwd = await hashPwd(password)
  const user = {
    id: crypto.randomUUID(),
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: pwd,
    googleAuth: false,
    mfaEnabled: false,
    mfaSecret: null,
    recoveryCodes: [],
    createdAt: Date.now(),
  }
  data.users.push(user)
  const session = makeSession(user.id)
  data.session = session
  save(data)
  return { user: sanitize(user), session }
}

export async function signIn({ email, password }) {
  const data = load()
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) throw new Error('No account found with this email.')
  if (user.googleAuth && !user.password) throw new Error('This account uses Google sign-in.')
  if (await hashPwd(password) !== user.password) throw new Error('Incorrect password.')
  if (user.mfaEnabled) return { requiresMFA: true, userId: user.id }
  const session = makeSession(user.id)
  data.session = session
  save(data)
  return { user: sanitize(user), session }
}

export async function signInGoogle({ email, name }) {
  const data = load()
  let user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) {
    user = {
      id: crypto.randomUUID(), username: name,
      email: email.toLowerCase(), password: null, googleAuth: true,
      mfaEnabled: false, mfaSecret: null, recoveryCodes: [], createdAt: Date.now(),
    }
    data.users.push(user)
  }
  if (user.mfaEnabled) return { requiresMFA: true, userId: user.id }
  const session = makeSession(user.id)
  data.session = session
  save(data)
  return { user: sanitize(user), session }
}

export async function completeMFA({ userId, token }) {
  const data = load()
  const userIdx = data.users.findIndex(u => u.id === userId)
  if (userIdx === -1) throw new Error('User not found.')
  const user = { ...data.users[userIdx] }

  let valid = false
  if (/^\d{6}$/.test(token.replace(/\s/g, ''))) {
    valid = await verifyTOTP(user.mfaSecret, token.replace(/\s/g, ''))
  }
  if (!valid) {
    const idx = user.recoveryCodes.indexOf(token.toUpperCase())
    if (idx !== -1) { user.recoveryCodes.splice(idx, 1); valid = true }
  }
  if (!valid) throw new Error('Invalid code. Please try again.')

  data.users[userIdx] = user
  const session = makeSession(user.id)
  data.session = session
  save(data)
  return { user: sanitize(user), session }
}

export function setupMFA(userId, secret, recoveryCodes) {
  const data = load()
  data.users = data.users.map(u =>
    u.id === userId ? { ...u, mfaEnabled: true, mfaSecret: secret, recoveryCodes } : u
  )
  save(data)
}
