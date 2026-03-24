import { n as DiscordConfigSchema } from "./zod-schema.providers-core-DLPfih2y.js";
import { r as getChatChannelMeta } from "./registry-xyHjVLxh.js";
import { A_ as createChannelPluginBase, H_ as createScopedChannelConfigAdapter, Hy as resolveDiscordAccount, Iy as inspectDiscordAccount, R_ as adaptScopedAccountAccessor, Ry as listDiscordAccountIds, Vy as resolveDefaultDiscordAccountId, __ as formatAllowFromLowercase } from "./pi-embedded-D3aYWCrT.js";
import { n as describeAccountSnapshot } from "./account-helpers-BVDd7S3q.js";
import { r as buildChannelConfigSchema } from "./config-schema-Bpwy_blm.js";
import { n as createDiscordSetupWizardProxy } from "./setup-core-CD23URwL.js";
//#region extensions/discord/src/shared.ts
const DISCORD_CHANNEL = "discord";
async function loadDiscordChannelRuntime() {
	return await import("./channel.runtime-BhB_kA1B.js");
}
const discordSetupWizard = createDiscordSetupWizardProxy(async () => (await loadDiscordChannelRuntime()).discordSetupWizard);
const discordConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: DISCORD_CHANNEL,
	listAccountIds: listDiscordAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveDiscordAccount),
	inspectAccount: adaptScopedAccountAccessor(inspectDiscordAccount),
	defaultAccountId: resolveDefaultDiscordAccountId,
	clearBaseFields: ["token", "name"],
	resolveAllowFrom: (account) => account.config.dm?.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom }),
	resolveDefaultTo: (account) => account.config.defaultTo
});
function createDiscordPluginBase(params) {
	return createChannelPluginBase({
		id: DISCORD_CHANNEL,
		setupWizard: discordSetupWizard,
		meta: { ...getChatChannelMeta(DISCORD_CHANNEL) },
		capabilities: {
			chatTypes: [
				"direct",
				"channel",
				"thread"
			],
			polls: true,
			reactions: true,
			threads: true,
			media: true,
			nativeCommands: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: { configPrefixes: ["channels.discord"] },
		configSchema: buildChannelConfigSchema(DiscordConfigSchema),
		config: {
			...discordConfigAdapter,
			isConfigured: (account) => Boolean(account.token?.trim()),
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: Boolean(account.token?.trim()),
				extra: { tokenSource: account.tokenSource }
			})
		},
		setup: params.setup
	});
}
//#endregion
export { discordConfigAdapter as n, createDiscordPluginBase as t };
