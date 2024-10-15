import { http, HttpResponse } from 'msw'

export const commonHandlers = [
  http.post('/api/login', async ({ request }) => {
    const req = await request.formData()

    const username = req.get('username')

    return HttpResponse.json({
      user: {
        id: 1,
        username: username,
        fullName: '管理员',
        email: username + '@leafage.top',
        avatar: '/src/assets/images/avatar.jpg'
      },
      access_token: 'eyJhsdf3SFgasd4asdf'
    }, {
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