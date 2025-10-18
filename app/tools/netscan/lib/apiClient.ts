export async function fetchAPI(endpoint: string, params?: string) {
  const url = `/app/tools/netscan/api/${endpoint}${params ? `?${params}` : ''}`
  const res = await fetch(url)
  return res.json()
}
