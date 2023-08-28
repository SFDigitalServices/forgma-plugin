import { ComponentSpec } from "@/types";
import { uniqueKey } from "@/utils/string";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";
import { findChildByPath } from "@/utils/plugin";

const spec: ComponentSpec = [
	"Checkbox",
	(node) => {
		const props = getFigmaComponentProperties(node);
		const labelNode = findChildByPath((node as unknown) as FrameNode, "_checkbox row/Checkbox + Label/Label text");
		const label = (labelNode as TextNode).characters;

		return {
			type: "checkbox",
			key: uniqueKey(label),
			tableView: true,
			input: true,
			defaultValue: props.Checkbox === "Selected",
			...getFormioProperties(props),
			label
		};
	}
];

export default spec;
