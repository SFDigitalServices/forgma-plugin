import { ComponentSpec, FormioJSON } from "@/types";
import { uniqueKey } from "@/utils/string";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";

const PhoneNumberPlaceholders = [
	"(_ _ _)  _ _ _-_ _ _ _",
	"_ _ _ - _ _ _ - _ _ _ _"
];
const EmailPattern = /email/i;

const spec: ComponentSpec = [
	"Text field",
	(node) => {
		const props = getFigmaComponentProperties(node);
		const json: FormioJSON = {
			type: "textfield",
			key: uniqueKey(props.labelText),
			tableView: true,
			input: true,
			...getFormioProperties(props)
		};
		const prefix = String(props.type).match(/Prefix:\s+(\w+)/);

		if (prefix) {
				// the prefix types don't seem to have a showPlaceholderText option, so
				// the placeholder is always included, but we don't want the default
				// phone placeholder to be in the prefixed component
			delete json.placeholder;

			if (prefix[1] === "Currency") {
				json.prefix = "$";
			} else if (prefix[1] === "Date") {
				json.widget = {
					type: "calendar",
					altInput: true,
					allowInput: true,
					clickOpens: true,
					enableDate: true,
					enableTime: true,
					mode: "single",
					noCalendar: false,
					format: "yyyy-MM-dd hh:mm a",
					dateFormat: "yyyy-MM-ddTHH:mm:ssZ",
					useLocaleSettings: false,
					hourIncrement: 1,
					minuteIncrement: 5,
					time_24hr: false,
					saveAs: "text",
					displayInTimezone: "viewer",
					locale: "en"
				};
			}
		} else if (PhoneNumberPlaceholders.includes(json.placeholder)) {
				// this placeholder is one that's used in a text field to indicate a phone
				// number, but there's an actual phoneNumber component, so we want to use
				// that instead of a text field
			delete json.placeholder;
			json.type = "phoneNumber";
		} else if (EmailPattern.test(json.label)) {
				// treat any text field with "email" in the label as an email field
			json.type = "email";
			json.spellcheck = false;
			json.kickbox = {
				enabled: true
			};
		}

		return json;
	}
];

export default spec;
