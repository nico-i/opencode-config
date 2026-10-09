import { Plugin } from "@opencode/plugin"
import { routeCopilotRequest } from "./route.mjs"

export default Plugin.define({
  id: "local.headroom-copilot",
  async setup(ctx) {
    await ctx.session.hook("http.request", (event) => {
      event.request = routeCopilotRequest(event.request)
    }, { providerID: "github-copilot" })
  },
})
