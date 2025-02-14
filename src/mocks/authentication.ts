import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/constants'

export const authenticationHandlers = [
  http.post(`/api${SERVER_URL.LOGIN}`, () => {
    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'logged_in=true; HttpOnly; Secure; SameSite=lax; Expires=85400; Path=/'
      }
    })
  }),

  http.post(`/api${SERVER_URL.LOGOUT}`, () => {
    return new HttpResponse(null, { status: 200 })
  })
]
