import { p as theme } from "./globals-d3aR1MYC.js";
import "./paths-BMo6kTge.js";
import "./subsystem-Cfn2Pryx.js";
import "./boolean-DtWR5bt3.js";
import "./auth-profiles-tPxLL4Q6.js";
import "./agent-scope-BGsA4zEf.js";
import "./utils-cwpAMi-t.js";
import "./openclaw-root-BU3lu8pM.js";
import "./logger-DB-PHqB2.js";
import "./exec-B45rafWZ.js";
import "./registry-p3miLKfM.js";
import "./github-copilot-token-Byc_YVYE.js";
import "./manifest-registry-Dmh8Lc7n.js";
import "./version-DdJhsIqk.js";
import "./message-channel-BH8TVME5.js";
import "./client-CzImpHGe.js";
import "./call-MMA9uqcd.js";
import "./pairing-token-h5vg0oaO.js";
import "./net-0Fapzizl.js";
import "./tailnet-cWmPZlFU.js";
import "./runtime-config-collectors-Cwq4_1iU.js";
import "./command-secret-targets-DCqd4iaR.js";
import { t as formatDocsLink } from "./links-ILDVAiqt.js";
import { n as registerQrCli } from "./qr-cli-OV2rwuYH.js";

//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`));
}

//#endregion
export { registerClawbotCli };