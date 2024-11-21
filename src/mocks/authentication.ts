import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/constants'

export const authenticationHandlers = [
  http.post(`/api${SERVER_URL.SIGNIN}`, () => {
    return HttpResponse.text('token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiemhhbmdzYW4iLCJleHAiOjE3MjkwMTU0ODYsImlhdCI6MTcyODk3OTQ4Niwic2NvcGUiOiJST0xFX1VTRVIifQ.1USESTKtTw4uSZECx-5kz9eBh-vVNWpyyrn5iehzbrf6wY7UaOhxZKcJckLdOsau50kkxdxhfuOy__WHE7uNWxpZlBdJO5j4A6FF21Py4EdpEpgHXjZiwvR_Z3AhsWWR7LuYc_Z2M8aWsC88qDlqlKJquZiHn_Qfa7AdMLh5Id-x9UanDEMDqKvmvaKuParhNsGnFqxSQWkYK4TvoF1SKjKF935ZJI4tAM21tFAqj2rPIyZIvxLprT8aPJxoB5Iy7INitp938bV01mhO0MtUPil9gLtq8OIOHxRTPkOIR1v6LXApSRDuBzGypAwNrpqxkz5aM13NLYtQCFYa1XG4BA')
  }),

  http.post(`/api${SERVER_URL.SIGNOUT}`, () => {
    return new HttpResponse(null, { status: 200 })
  })
]
