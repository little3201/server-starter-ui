import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import type {User} from 'oidc-client-ts'

const oidcSettings = {
    authority: 'http://127.0.0.1:8761',
    client_id: 'pkce-client',
    redirect_uri: `${window.location.origin}/callback`,
    post_logout_redirect_uri: `${window.location.origin}`,
    response_type: 'code',
    scope: 'openid profile',
    loadUserInfo: true,
    stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
    filterProtocolClaims: true,
    revokeAccessTokenOnSignout: true,
    monitorSession: true
}

const userManager = new UserManager(oidcSettings);

export function signIn() {
    userManager.signinRedirect()
}

export function handleCallback() {
  return userManager.signinRedirectCallback()
}

export function isAuthenticated(): Promise<boolean> {
  return userManager.getUser().then(user => {
      return !!user
  })
}

export function getUser(): Promise<User | null> {
  return userManager.getUser()
}

export function signOut() {
  userManager.signoutRedirect()
}