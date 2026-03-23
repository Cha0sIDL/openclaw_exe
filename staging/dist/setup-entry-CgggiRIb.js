import { N_ as defineSetupPluginEntry } from "./pi-embedded-D3aYWCrT.js";
import { r as discordSetupAdapter } from "./setup-core-CD23URwL.js";
import { t as createDiscordPluginBase } from "./shared-DDe7LlBo.js";
//#region extensions/discord/src/channel.setup.ts
const discordSetupPlugin = { ...createDiscordPluginBase({ setup: discordSetupAdapter }) };
//#endregion
//#region extensions/discord/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(discordSetupPlugin);
//#endregion
export { discordSetupPlugin as n, setup_entry_default as t };
