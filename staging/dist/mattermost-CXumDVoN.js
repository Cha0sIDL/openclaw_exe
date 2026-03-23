import { M_ as defineChannelPluginEntry } from "./pi-embedded-D3aYWCrT.js";
import { n as registerSlashCommandRoute, r as setMattermostRuntime, t as mattermostPlugin } from "./channel-QnE4T_gG.js";
//#region extensions/mattermost/index.ts
var mattermost_default = defineChannelPluginEntry({
	id: "mattermost",
	name: "Mattermost",
	description: "Mattermost channel plugin",
	plugin: mattermostPlugin,
	setRuntime: setMattermostRuntime,
	registerFull(api) {
		registerSlashCommandRoute(api);
	}
});
//#endregion
export { mattermost_default as t };
