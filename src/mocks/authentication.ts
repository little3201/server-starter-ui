import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/constants'


export const authenticationHandlers = [
  http.post(`/api${SERVER_URL.LOGIN}`, async ({ request }) => {
    const formData = await request.formData()
    const username = formData.get('username')
    const password = formData.get('password')
    if (username && password) {
      return HttpResponse.json({
        access_token: 'eyJhsdf3SFgasd4asdf',
        type: 'Bearer'
      })
    }
    return HttpResponse.error()
  }),
  http.post(`/api${SERVER_URL.LOGOUT}`, () => {
    return new HttpResponse(null, {
      status: 302,
      headers: {
        Location: '/login',
      },
    })
  })
]
