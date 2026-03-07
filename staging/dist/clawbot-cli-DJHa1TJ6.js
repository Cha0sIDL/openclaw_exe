import { p as theme } from "./globals-Bv4ZcVWM.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-B4CcvtwB.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-Ok_29lfs.js";
import "./agent-scope-Ct4K9XNr.js";
import "./utils-C5WN6czr.js";
import "./openclaw-root-BD5PlMF6.js";
import "./logger-DK5MgyI_.js";
import "./exec-Ma6oRU03.js";
import "./github-copilot-token-V8sGXzUU.js";
import "./host-env-security-BqjSpt13.js";
import "./version-CWAlVg1Z.js";
import "./registry-COiI4eXe.js";
import "./manifest-registry-CDX-Vxgs.js";
import "./message-channel-DwOOiHnr.js";
import "./tailnet-CxYaUoxP.js";
import "./ws-BzjlD7jY.js";
import "./client-BFxmeDqQ.js";
import "./call-DVkWjKJC.js";
import "./pairing-token-B_ihwlFf.js";
import "./runtime-config-collectors-C7NEx3Ij.js";
import "./command-secret-targets-Hw0LPI1L.js";
import { t as formatDocsLink } from "./links-BhWccyz9.js";
import { n as registerQrCli } from "./qr-cli-mv5KZN-Y.js";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`));
}
//#endregion
export { registerClawbotCli };
