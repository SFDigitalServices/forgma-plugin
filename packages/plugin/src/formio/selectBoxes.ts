import { ComponentSpec } from "@/types";
import { uniqueKey } from "@/utils/string";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFormioOptionProperties } from "@/formio/getFormioOptionProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";

const spec: ComponentSpec = [
	"Select boxes",
	(node) => {
		const props = getFigmaComponentProperties(node);

		return {
			type: "selectboxes",
			key: uniqueKey(props.labelText),
			tableView: true,
			inputType: "checkbox",
			optionsLabelPosition: "right",
			...getFormioProperties(props),
			...getFormioOptionProperties(node)
		};
	}
];

export default spec;
