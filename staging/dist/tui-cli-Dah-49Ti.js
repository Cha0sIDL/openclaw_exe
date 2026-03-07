import { p as theme } from "./globals-Bv4ZcVWM.js";
import "./paths-BfR2LXbA.js";
import { d as defaultRuntime } from "./subsystem-B4CcvtwB.js";
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
import "./dock-D5Ul7srh.js";
import "./accounts-Cs7lRJ22.js";
import "./plugins-DH0nf2wM.js";
import "./logging-DYOk_rR3.js";
import "./accounts-C5aOTkts.js";
import "./image-ops-CgkYbHWv.js";
import "./message-channel-DwOOiHnr.js";
import "./pi-embedded-helpers-CBRvxz6e.js";
import "./sandbox-B3ZfWqQX.js";
import "./tool-catalog-BipbxDxK.js";
import "./chrome-DtNznCNZ.js";
import "./tailscale-Ch9Mc7pc.js";
import "./tailnet-CxYaUoxP.js";
import "./ws-BzjlD7jY.js";
import "./auth-DPbW35vL.js";
import "./server-context-BGjLULS5.js";
import "./frontmatter-Hg10Mdyo.js";
import "./env-overrides-lQ9nfNgI.js";
import "./path-alias-guards-Dd9daA8Q.js";
import "./skills-UtzuOmV5.js";
import "./paths-BsQGrIJV.js";
import "./redact-BPv8nenp.js";
import "./errors-Bxy1kFT-.js";
import "./fs-safe-DGIa4SNP.js";
import "./proxy-env-BQ8shHGR.js";
import "./store-CRz4WjkH.js";
import "./ports-fgKk6ALw.js";
import "./trash-qzaIKOIU.js";
import "./server-middleware-B1Hn5Uxq.js";
import "./sessions-CkpVe03D.js";
import "./accounts-BER1yztz.js";
import "./paths-E64m60XY.js";
import "./chat-envelope-CH5bYP5u.js";
import "./tool-images-1mCfmpMJ.js";
import "./thinking-B_wxfji0.js";
import "./tool-display-IDeAbAnn.js";
import "./commands-BNyCzjzn.js";
import "./commands-registry-Q8iSE9Pt.js";
import "./client-BFxmeDqQ.js";
import "./call-DVkWjKJC.js";
import "./pairing-token-B_ihwlFf.js";
import { t as parseTimeoutMs } from "./parse-timeout-D02LlLER.js";
import { t as formatDocsLink } from "./links-BhWccyz9.js";
import "./resolve-configured-secret-input-string-g6Dmh7Eu.js";
import { t as runTui } from "./tui-BCkUFw2L.js";
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
