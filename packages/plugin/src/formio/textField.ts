import { ComponentSpec, FormioJSON } from "@/types";
import { uniqueKey } from "@/utils/string";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";
import { findChildByName, findChildByPath } from "@/utils/plugin";

const FigmaToFormioTypeMap: Record<string, string> = {
	Default: "textfield",
	Prefix: "textfield",
	Suffix: "textfield",
	Number: "number",
	Currency: "currency",
	"Phone number": "phoneNumber",
	Email: "email",
	Date: "datetime",
	Time: "time",
} as const;

const spec: ComponentSpec = [
	"Text field",
	(node) => {
		const props = getFigmaComponentProperties(node);
		const type = FigmaToFormioTypeMap[props.type as string] ?? "textfield";
		const json: FormioJSON = {
			type,
			key: uniqueKey(props.labelText),
			tableView: true,
			input: true,
			...getFormioProperties(props)
		};
		const helpTextNode = findChildByName((node as unknown) as FrameNode, "Helptext");

		switch (type) {
			case "currency":
				json.prefix = "$";
				break;

			case "email":
				json.spellcheck = false;
				json.kickbox = {
					enabled: true
				};
				break;

			case "datetime":
				json.widget = {
					type: "calendar",
					altInput: true,
					allowInput: true,
					clickOpens: true,
					enableDate: true,
					enableTime: false,
					mode: "single",
					noCalendar: false,
					format: "yyyy-MM-dd",
					dateFormat: "yyyy-MM-ddTHH:mm:ssZ",
					useLocaleSettings: false,
					hourIncrement: 1,
					minuteIncrement: 5,
					time_24hr: false,
					saveAs: "text",
					displayInTimezone: "viewer",
					locale: "en"
				};
				break;
		}

		if (type !== "phoneNumber") {
				// the placeholder field isn't hooked up in the properties for anything
				// except the phone number, so delete that key, since we don't want the
				// default phone placeholder showing up in all text fields
			delete json.placeholder;
		}

		if (!helpTextNode?.visible) {
				// if the user manually hid the help text element, they don't want the
				// description to be included, since there's no longer a toggle for it
			delete json.description;
		}

		return json;
	}
];

export default spec;
