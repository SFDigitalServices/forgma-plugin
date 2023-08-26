import { ComponentSpec } from "@/types";
import { uniqueKey } from "@/utils/string";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";
import { findChildByPath } from "@/utils/plugin";

const spec: ComponentSpec = [
	"Select",
	(node) => {
		const props = getFigmaComponentProperties(node);
//		const labelNode = findChildByPath((node as unknown) as FrameNode, "Label + Field/_Field label");
//		const labelProps = getFigmaComponentProperties(labelNode as InstanceNode);
//		const label = labelProps.fieldLabel;

console.log("=== Select", getFormioProperties(props), props);

		return {
			type: "select",
//			label,
//			key: uniqueKey(label),
			tableView: true,
			widget: "choicesjs",
			lockKey: true,
			tags: ["autocomplete"],
			...getFormioProperties(props),
		};
	}
];

export default spec;
