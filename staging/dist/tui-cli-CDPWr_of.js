import { p as theme } from "./globals-d3aR1MYC.js";
import "./paths-BMo6kTge.js";
import { d as defaultRuntime } from "./subsystem-Cfn2Pryx.js";
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
import "./dock-TO1HzU4S.js";
import "./frontmatter-I4t5UjzX.js";
import "./skills-DvBk_SBL.js";
import "./path-alias-guards-5rac999j.js";
import "./message-channel-BH8TVME5.js";
import "./sessions-0JfTMYG-.js";
import "./plugins-hyZRvFwO.js";
import "./accounts-5eLsrtsT.js";
import "./accounts-qTCkeVoU.js";
import "./logging-BvdokaVt.js";
import "./accounts-C9pjEZ6g.js";
import "./paths-cmEiiwMK.js";
import "./chat-envelope-n7RmUTHV.js";
import "./client-CzImpHGe.js";
import "./call-MMA9uqcd.js";
import "./pairing-token-h5vg0oaO.js";
import "./net-0Fapzizl.js";
import "./tailnet-cWmPZlFU.js";
import "./image-ops--7j2A6VZ.js";
import "./pi-embedded-helpers-BZ9Btdtj.js";
import "./sandbox-B1Nlj37O.js";
import "./tool-catalog-B4gxY3Jd.js";
import "./chrome-DQhBG1da.js";
import "./tailscale-Bx7OP_Ql.js";
import "./auth-BothAgrh.js";
import "./server-context-BeIaDzE3.js";
import "./paths-DkGd1YEC.js";
import "./redact-LmGH4yE3.js";
import "./errors-s25Xfb--.js";
import "./fs-safe-z-Hw12Xy.js";
import "./proxy-env-DxO4ZKbR.js";
import "./store-CtS8gb_5.js";
import "./ports-GoOZaxy6.js";
import "./trash-uRrkiV94.js";
import "./server-middleware-CJxtwXCE.js";
import "./tool-images-BRNSPwBR.js";
import "./thinking-C0gzzPsv.js";
import "./tool-display-CSQ-o0DM.js";
import "./commands-CUiU_v7O.js";
import "./commands-registry-BeCEsRcX.js";
import { t as parseTimeoutMs } from "./parse-timeout-DKY8YAUj.js";
import { t as formatDocsLink } from "./links-ILDVAiqt.js";
import "./resolve-configured-secret-input-string-B4sZ8SaF.js";
import { t as runTui } from "./tui-Fy7_jbma.js";

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