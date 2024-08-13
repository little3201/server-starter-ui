import { http, HttpResponse } from 'msw'

export const commonHandlers = [
  http.post('/api/login', async ({ request }) => {
    const info = await request.formData()

    const username = info.get('username')

    return HttpResponse.json({ user: { username: username, avatar: '/vite.svg' }, access_token: "eyJhsdf3SFgasd4asdf" }, {
      headers: {
        'Set-Cookie': 'logged_in=yes'
      }
    })
  }),
  http.post('/api/logout', ({ cookies }) => {
    if (!cookies.logged_in) {
      return new HttpResponse(null, { status: 200 })
    }
    return new HttpResponse()
  })
]