function getToken() {
  return localStorage.getItem('token')
}

const BASE = '/api'

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  let url = BASE + path
  let fetchBody = undefined

  if (body && (method === 'GET' || method === 'HEAD')) {
    url = `${url}?${new URLSearchParams(body)}`
  } else if (body) {
    fetchBody = JSON.stringify(body)
  }

  const res = await fetch(url, {
    method,
    headers,
    body: fetchBody,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  get:    (path, body) => request('GET',    path, body),
  post:   (path, body) => request('POST',   path, body),
  delete: (path, body) => request('DELETE', path, body),
}
