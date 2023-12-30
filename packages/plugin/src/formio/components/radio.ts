import { ComponentSpec } from "@/types";
import { uniqueKey } from "@/utils/string";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFormioOptionProperties } from "@/formio/getFormioOptionProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";

const spec: ComponentSpec = [
	"Radio",
	(node) => {
		const props = getFigmaComponentProperties(node);

			// there's no help text field in the component properties
		delete props.helpText;

		return {
			type: "radio",
			key: uniqueKey(props.labelText),
			tableView: true,
			input: true,
			optionsLabelPosition: "right",
			...getFormioProperties(props),
			...getFormioOptionProperties(node)
		};
	}
];

export default spec;
