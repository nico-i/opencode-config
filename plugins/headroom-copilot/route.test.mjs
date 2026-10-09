import assert from "node:assert/strict"
import test from "node:test"
import { routeCopilotRequest } from "./route.mjs"

for (const path of ["/responses", "/chat/completions", "/v1/messages"]) {
  test(`routes ${path} without changing authentication or body`, async () => {
    const request = new Request(`https://api.githubcopilot.com${path}?test=1`, {
      method: "POST",
      headers: { authorization: "Bearer test-only", "content-type": "application/json" },
      body: '{"model":"test-model"}',
    })
    const routed = routeCopilotRequest(request)
    assert.equal(new URL(routed.url).origin, "http://127.0.0.1:8787")
    assert.equal(new URL(routed.url).pathname, path.startsWith("/v1/") ? path : `/v1${path}`)
    assert.equal(new URL(routed.url).search, "?test=1")
    assert.equal(routed.headers.get("x-headroom-base-url"), "https://api.githubcopilot.com")
    assert.equal(routed.headers.get("x-headroom-original-path"), path)
    assert.equal(routed.headers.get("authorization"), "Bearer test-only")
    assert.equal(await routed.text(), '{"model":"test-model"}')
  })
}

test("does not redirect unrelated hosts or already routed requests", () => {
  for (const url of ["https://api.openai.com/v1/responses", "http://127.0.0.1:8787/v1/responses", "https://api.githubcopilot.com.evil.example/responses"]) {
    const request = new Request(url)
    assert.equal(routeCopilotRequest(request), request)
  }
})
