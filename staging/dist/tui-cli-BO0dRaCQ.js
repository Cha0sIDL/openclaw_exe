import "./paths-BJV7vkaX.js";
import { p as theme } from "./globals-BM8hKFm0.js";
import "./utils-DC4zYvW0.js";
import "./thinking-BYwvlJ3S.js";
import "./agent-scope-BjNYwuUO.js";
import { d as defaultRuntime } from "./subsystem-B-oDv-jG.js";
import "./openclaw-root-Bm1aZrog.js";
import "./logger-CS_BtBMJ.js";
import "./exec-M8Rb4KML.js";
import "./model-selection-Ct4JRMnm.js";
import "./github-copilot-token-D37fjdwy.js";
import "./boolean-CJxfhBkG.js";
import "./env-BCEGmRqf.js";
import "./host-env-security-3W3usp5X.js";
import "./registry-DTGNhZ2I.js";
import "./manifest-registry-BkD5G9c-.js";
import "./dock-BE996V7g.js";
import "./message-channel-SQk3PfR_.js";
import "./plugins-Dqx9Ki_e.js";
import "./sessions-CCYTHV0b.js";
import "./pi-embedded-helpers-D9w2HqW7.js";
import "./sandbox-Dp2LrT2r.js";
import "./tool-catalog-ITGbG7Rk.js";
import "./chrome-0JI-2W2a.js";
import "./tailscale-DI4s2-Gr.js";
import "./tailnet-DDDvYK0o.js";
import "./ws-DTH7lPMz.js";
import "./auth-D-L89Yt0.js";
import "./server-context-CcO1RPsQ.js";
import "./frontmatter-DDaV0iaR.js";
import "./env-overrides-DmjWQl3G.js";
import "./path-alias-guards-DLqJgAhJ.js";
import "./skills-a9F7gIZY.js";
import "./paths-CR0R5_8U.js";
import "./redact-CSAAUZeN.js";
import "./errors-CaD5MZdl.js";
import "./fs-safe-B3BtQwY1.js";
import "./proxy-env-gofikmGK.js";
import "./image-ops-Dj1UHz_P.js";
import "./store-BmISwJ7q.js";
import "./ports-BkdglpAO.js";
import "./trash-Z3mFp_O-.js";
import "./server-middleware-DGnu0Iyy.js";
import "./accounts-BYXZoHmE.js";
import "./accounts-Cb-TYjNx.js";
import "./logging-CK-b_j6J.js";
import "./accounts-B7qIxnuY.js";
import "./paths-COpaT9Gf.js";
import "./chat-envelope-C16Rx042.js";
import "./tool-images-CTExEruu.js";
import "./tool-display-DOC9dtsx.js";
import "./commands-4hNlWOFL.js";
import "./commands-registry-DKds7JdT.js";
import "./client-SbKzE96g.js";
import "./call-anvtKqEC.js";
import "./pairing-token-JyHgxIPg.js";
import { t as formatDocsLink } from "./links-LX8xbIqP.js";
import { t as parseTimeoutMs } from "./parse-timeout-DBlhtYKW.js";
import "./resolve-configured-secret-input-string-x4HTikzQ.js";
import { t as runTui } from "./tui-rT0-S5FM.js";
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
