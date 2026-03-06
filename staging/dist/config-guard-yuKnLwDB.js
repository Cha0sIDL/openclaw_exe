import "./paths-BBP4yd-2.js";
import { L as shouldMigrateStateFromPath, d as colorize, f as isRich, p as theme } from "./globals-DyWRcjQY.js";
import { S as shortenHomePath } from "./utils-xFiJOAuL.js";
import "./agent-scope-Ckfy1eLE.js";
import "./subsystem-D5pRlZe-.js";
import "./openclaw-root-DeEQQJyX.js";
import "./logger-DHGbafYr.js";
import "./exec-XzljJcHM.js";
import { tn as readConfigFileSnapshot } from "./model-selection-D6yIS4i6.js";
import "./registry-D9k2JaF8.js";
import "./github-copilot-token-b6kJVrW-.js";
import { t as formatCliCommand } from "./command-format-Gp1OUMPH.js";
import "./boolean-BsqeuxE6.js";
import "./env-BCNBCy-T.js";
import "./manifest-registry-CfBuZDUD.js";
import "./dock-y4QSCOQM.js";
import "./message-channel-FOEqd4n-.js";
import "./plugins-DmEd4pqG.js";
import "./sessions-Dt8vnmQq.js";
import "./tailnet-XGVl9sUv.js";
import "./ws-hC2980ir.js";
import "./accounts-Gk6U_wCL.js";
import "./accounts-DAImktI2.js";
import "./logging-B-Ool4n-.js";
import "./accounts-V_js5_KL.js";
import "./paths-C_Kd9gsY.js";
import "./chat-envelope-BBn0ocB6.js";
import "./client-Ca8oW9ow.js";
import "./call-CXalT0Oq.js";
import "./pairing-token-DW-Qfpqh.js";
import "./exec-approvals-allowlist-ByL1G0o5.js";
import "./exec-safe-bin-runtime-policy-DBZ3wFej.js";
import "./plugin-auto-enable-DomcoDkl.js";
import "./pairing-store-Cty2495o.js";
import "./runtime-config-collectors-9DfCwYpq.js";
import "./command-secret-targets-4tvPNNBM.js";
import "./prompt-style-DRL6JbLb.js";
import "./note-BcRMnc8F.js";
import { n as formatConfigIssueLines } from "./issue-format-D600VZVE.js";
import { t as loadAndMaybeMigrateDoctorConfig } from "./doctor-config-flow-DOhWK4rA.js";

//#region src/cli/program/config-guard.ts
const ALLOWED_INVALID_COMMANDS = new Set([
	"doctor",
	"logs",
	"health",
	"help",
	"status"
]);
const ALLOWED_INVALID_GATEWAY_SUBCOMMANDS = new Set([
	"status",
	"probe",
	"health",
	"discover",
	"call",
	"install",
	"uninstall",
	"start",
	"stop",
	"restart"
]);
let didRunDoctorConfigFlow = false;
let configSnapshotPromise = null;
function resetConfigGuardStateForTests() {
	didRunDoctorConfigFlow = false;
	configSnapshotPromise = null;
}
async function getConfigSnapshot() {
	if (process.env.VITEST === "true") return readConfigFileSnapshot();
	configSnapshotPromise ??= readConfigFileSnapshot();
	return configSnapshotPromise;
}
async function ensureConfigReady(params) {
	const commandPath = params.commandPath ?? [];
	if (!didRunDoctorConfigFlow && shouldMigrateStateFromPath(commandPath)) {
		didRunDoctorConfigFlow = true;
		const runDoctorConfigFlow = async () => loadAndMaybeMigrateDoctorConfig({
			options: { nonInteractive: true },
			confirm: async () => false
		});
		if (!params.suppressDoctorStdout) await runDoctorConfigFlow();
		else {
			const originalStdoutWrite = process.stdout.write.bind(process.stdout);
			const originalSuppressNotes = process.env.OPENCLAW_SUPPRESS_NOTES;
			process.stdout.write = (() => true);
			process.env.OPENCLAW_SUPPRESS_NOTES = "1";
			try {
				await runDoctorConfigFlow();
			} finally {
				process.stdout.write = originalStdoutWrite;
				if (originalSuppressNotes === void 0) delete process.env.OPENCLAW_SUPPRESS_NOTES;
				else process.env.OPENCLAW_SUPPRESS_NOTES = originalSuppressNotes;
			}
		}
	}
	const snapshot = await getConfigSnapshot();
	const commandName = commandPath[0];
	const subcommandName = commandPath[1];
	const allowInvalid = commandName ? ALLOWED_INVALID_COMMANDS.has(commandName) || commandName === "gateway" && subcommandName && ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName) : false;
	const issues = snapshot.exists && !snapshot.valid ? formatConfigIssueLines(snapshot.issues, "-", { normalizeRoot: true }) : [];
	const legacyIssues = snapshot.legacyIssues.length > 0 ? formatConfigIssueLines(snapshot.legacyIssues, "-") : [];
	if (!(snapshot.exists && !snapshot.valid)) return;
	const rich = isRich();
	const muted = (value) => colorize(rich, theme.muted, value);
	const error = (value) => colorize(rich, theme.error, value);
	const heading = (value) => colorize(rich, theme.heading, value);
	const commandText = (value) => colorize(rich, theme.command, value);
	params.runtime.error(heading("Config invalid"));
	params.runtime.error(`${muted("File:")} ${muted(shortenHomePath(snapshot.path))}`);
	if (issues.length > 0) {
		params.runtime.error(muted("Problem:"));
		params.runtime.error(issues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	if (legacyIssues.length > 0) {
		params.runtime.error(muted("Legacy config keys detected:"));
		params.runtime.error(legacyIssues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	params.runtime.error("");
	params.runtime.error(`${muted("Run:")} ${commandText(formatCliCommand("openclaw doctor --fix"))}`);
	if (!allowInvalid) params.runtime.exit(1);
}
const __test__ = { resetConfigGuardStateForTests };

//#endregion
export { __test__, ensureConfigReady };