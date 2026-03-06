import "./paths-BBP4yd-2.js";
import { p as theme } from "./globals-DyWRcjQY.js";
import "./utils-xFiJOAuL.js";
import "./agent-scope-Ckfy1eLE.js";
import "./subsystem-D5pRlZe-.js";
import "./openclaw-root-DeEQQJyX.js";
import "./logger-DHGbafYr.js";
import "./exec-XzljJcHM.js";
import "./model-selection-D6yIS4i6.js";
import "./registry-D9k2JaF8.js";
import "./github-copilot-token-b6kJVrW-.js";
import "./boolean-BsqeuxE6.js";
import "./env-BCNBCy-T.js";
import "./manifest-registry-CfBuZDUD.js";
import "./message-channel-FOEqd4n-.js";
import "./tailnet-XGVl9sUv.js";
import "./ws-hC2980ir.js";
import "./client-Ca8oW9ow.js";
import "./call-CXalT0Oq.js";
import "./pairing-token-DW-Qfpqh.js";
import "./runtime-config-collectors-9DfCwYpq.js";
import "./command-secret-targets-4tvPNNBM.js";
import { t as formatDocsLink } from "./links-CYThhxFD.js";
import { n as registerQrCli } from "./qr-cli-DytpAgxd.js";

//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`));
}

//#endregion
export { registerClawbotCli };