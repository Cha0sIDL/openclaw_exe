import { Di as lineSetupWizard, N_ as defineSetupPluginEntry, Oi as lineSetupAdapter } from "./pi-embedded-D3aYWCrT.js";
import { t as lineChannelPluginCommon } from "./channel-shared-C9bXCx9u.js";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setup: lineSetupAdapter
};
//#endregion
//#region extensions/line/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(lineSetupPlugin);
//#endregion
export { lineSetupPlugin as n, setup_entry_default as t };
