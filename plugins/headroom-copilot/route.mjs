// Keep Copilot OAuth in OpenCode; Headroom only proxies the resulting API request.
export function routeCopilotRequest(request) {
  const upstream = new URL(request.url)
  if (upstream.protocol !== "https:" || ![
    "api.githubcopilot.com",
    "api.individual.githubcopilot.com",
    "api.business.githubcopilot.com",
    "api.enterprise.githubcopilot.com",
  ].includes(upstream.hostname)) return request

  const target = new URL("http://127.0.0.1:8787")
  target.pathname = upstream.pathname.startsWith("/v1/")
    ? upstream.pathname
    : `/v1${upstream.pathname}`
  target.search = upstream.search
  const routed = new Request(target, request)
  routed.headers.set("x-headroom-base-url", upstream.origin)
  routed.headers.set("x-headroom-original-path", upstream.pathname)
  return routed
}
