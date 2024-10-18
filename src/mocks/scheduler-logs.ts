import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/api/paths'
import type { SchedulerLog } from 'src/models'

const datas: SchedulerLog[] = [
  {
    id: 1,
    name: 'DailyBackup',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    status: 0
  },
  {
    id: 2,
    name: 'GenerateReport',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 5,
    status: 1
  },
  {
    id: 3,
    name: 'SyncData',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 6,
    status: 1
  },
  {
    id: 4,
    name: 'ClearTempFiles',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 323,
    status: 1
  },
  {
    id: 5,
    name: 'SendEmails',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 33,
    status: 2
  },
  {
    id: 6,
    name: 'UpdateStats',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 2,
    status: 1
  },
  {
    id: 7,
    name: 'ReindexSearch',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 323,
    status: 1
  },
  {
    id: 8,
    name: 'ArchiveLogs',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 23,
    status: 1
  },
  {
    id: 9,
    name: 'RefreshCache',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 2345,
    status: 1
  },
  {
    id: 10,
    name: 'GenerateInvoices',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 125,
    status: 1
  },
  {
    id: 11,
    name: 'GenerateInvoices',
    startTime: '2024-05-12 23:23',
    nextExecuteTime: '2024-05-13 03:23',
    executedTime: 125,
    status: 1
  }
]


export const schedulerLogsHandlers = [
  http.get(`/api${SERVER_URL.SCHEDULER_LOG}/:id`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get(`/api${SERVER_URL.SCHEDULER_LOG}`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    // Construct a JSON response with the list of all Row
    // as the response body.
    const data = {
      content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
      page: {
        totalElements: datas.length
      }
    }

    return HttpResponse.json(data)
  }),
  http.delete(`/api${SERVER_URL.SCHEDULER_LOG}/:id`, ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Row by its ID.
    const deletedData = datas.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Row ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Row from the "allRow" map.
    datas.pop()

    // Respond with a "200 OK" response and the deleted Row.
    return HttpResponse.json(deletedData)
  })
]
