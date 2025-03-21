import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'
import { getRandomString, generateVerifier, computeChallenge } from 'src/utils'


const client_id = import.meta.env.VITE_CLIENT_ID
const baserUri = import.meta.env.VITE_AUTHORITY
 

export async function signIn() {
  const state = getRandomString(16)
  const codeVerifier = generateVerifier()
  // 存储code_verifier
  localStorage.setItem('code_verifier', codeVerifier)
  const codeChallenge = await computeChallenge(codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: `${client_id}`,
    redirect_uri: `${window.location.origin}/callback`,
    scope: 'openid profile',
    code_challenge: codeChallenge,
    state: state,
    code_challenge_method: 'S256'
  })

  window.location.href = `${baserUri}/${SERVER_URL.AUTHORIZE}?${params}`
}

export function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  if (!code) {
    throw Error('cannot get code!')
  }
  const state = urlParams.get('state')
  if (!state){
    throw Error('cannot get state!')
  }

  const codeVerifier = localStorage.getItem('code_verifier')
  if (!codeVerifier){
    signIn()
    throw Error('code_verifier not getted!')
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: `${client_id}`,
    code: code,
    redirect_uri: `${window.location.origin}/callback`,
    code_verifier: codeVerifier,
    state: state
  })
  // Exchange authorization code for access token
  return api.post(`${baserUri}/${SERVER_URL.TOKEN}`, params)
}

export function getUser() {
  return api.get(`${baserUri}/${SERVER_URL.USERINFO}`)
}

export function signOut() {
  const idTokenHint = localStorage.getItem('id_token_hint')
  const params = new URLSearchParams({
    id_token_hint: `${idTokenHint}`,
    client_id: `${client_id}`,
    post_logout_redirect_uri: `${window.location.origin}`
  })

  window.location.href = `${baserUri}/${SERVER_URL.LOGOUT}?${params}`
}