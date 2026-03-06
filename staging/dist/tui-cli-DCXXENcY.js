import "./paths-BBP4yd-2.js";
import { p as theme } from "./globals-DyWRcjQY.js";
import "./utils-xFiJOAuL.js";
import "./thinking-Fqckw03T.js";
import "./agent-scope-Ckfy1eLE.js";
import { d as defaultRuntime } from "./subsystem-D5pRlZe-.js";
import "./openclaw-root-DeEQQJyX.js";
import "./logger-DHGbafYr.js";
import "./exec-XzljJcHM.js";
import "./model-selection-D6yIS4i6.js";
import "./registry-D9k2JaF8.js";
import "./github-copilot-token-b6kJVrW-.js";
import "./boolean-BsqeuxE6.js";
import "./env-BCNBCy-T.js";
import "./manifest-registry-CfBuZDUD.js";
import "./dock-y4QSCOQM.js";
import "./message-channel-FOEqd4n-.js";
import "./plugins-DmEd4pqG.js";
import "./sessions-Dt8vnmQq.js";
import "./pi-embedded-helpers-D2PVJ-a1.js";
import "./sandbox-BL9DTDci.js";
import "./tool-catalog-CCHhmVaK.js";
import "./chrome-Z9yUcaDs.js";
import "./tailscale-BTtkvuxs.js";
import "./tailnet-XGVl9sUv.js";
import "./ws-hC2980ir.js";
import "./auth-BL2Aq1B9.js";
import "./server-context-D9RxmesE.js";
import "./frontmatter-CuoNUw--.js";
import "./skills-CvS3YvgT.js";
import "./path-alias-guards-DuR6tGjh.js";
import "./paths-Ma2-xAwW.js";
import "./redact-C5yfNdVB.js";
import "./errors-kKUPais3.js";
import "./fs-safe-BSN_n9L7.js";
import "./proxy-env-DMYrH3XX.js";
import "./image-ops-ufpabANQ.js";
import "./store-BWQisjX6.js";
import "./ports-NAURVXNF.js";
import "./trash-r73uOrwG.js";
import "./server-middleware-tDRRJpz8.js";
import "./accounts-Gk6U_wCL.js";
import "./accounts-DAImktI2.js";
import "./logging-B-Ool4n-.js";
import "./accounts-V_js5_KL.js";
import "./paths-C_Kd9gsY.js";
import "./chat-envelope-BBn0ocB6.js";
import "./tool-images-CrdvPWWS.js";
import "./tool-display-CoHybMXf.js";
import "./commands-BrchMLbc.js";
import "./commands-registry-DO-OKRKl.js";
import "./client-Ca8oW9ow.js";
import "./call-CXalT0Oq.js";
import "./pairing-token-DW-Qfpqh.js";
import { t as formatDocsLink } from "./links-CYThhxFD.js";
import { t as parseTimeoutMs } from "./parse-timeout-kGl8Fsas.js";
import "./resolve-configured-secret-input-string-BVLNxX9z.js";
import { t as runTui } from "./tui-D3nd1GTJ.js";

//#region src/cli/tui-cli.ts
function registerTuiCli(program) {
	program.command("tui").description("Open a terminal UI connected to the Gateway").option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (if required)").option("--session <key>", "Session key (default: \"main\", or \"global\" when scope is global)").option("--deliver", "Deliver assistant replies", false).option("--thinking <level>", "Thinking level override").option("--message <text>", "Send an initial message after connecting").option("--timeout-ms <ms>", "Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)").option("--history-limit <n>", "History entries to load", "200").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/tui", "docs.openclaw.ai/cli/tui")}\n`).action(async (opts) => {
		try {
			const timeoutMs = parseTimeoutMs(opts.timeoutMs);
			if (opts.timeoutMs !== void 0 && timeoutMs === void 0) defaultRuntime.error(`warning: invalid --timeout-ms "${String(opts.timeoutMs)}"; ignoring`);
			const historyLimit = Number.parseInt(String(opts.historyLimit ?? "200"), 10);
			await runTui({
				url: opts.url,
				token: opts.token,
				password: opts.password,
				session: opts.session,
				deliver: Boolean(opts.deliver),
				thinking: opts.thinking,
				message: opts.message,
				timeoutMs,
				historyLimit: Number.isNaN(historyLimit) ? void 0 : historyLimit
			});
		} catch (err) {
			defaultRuntime.error(String(err));
			defaultRuntime.exit(1);
		}
	});
}

//#endregion
export { registerTuiCli };