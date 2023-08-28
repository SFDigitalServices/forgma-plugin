import { ComponentSpec } from "@/types";
import { uniqueKey } from "@/utils/string";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";

const spec: ComponentSpec = [
	"Select",
	(node) => {
		const props = getFigmaComponentProperties(node);

		return {
			type: "select",
			key: uniqueKey(props.labelText),
			tableView: true,
			widget: "choicesjs",
			lockKey: true,
			tags: ["autocomplete"],
			...getFormioProperties(props),
		};
	}
];

export default spec;
