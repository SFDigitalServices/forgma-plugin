import { ComponentSpec } from "@/types";
import { uniqueKey } from "@/utils/string";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";
import { findChildByPath } from "@/utils/plugin";
import SelectBoxesSpec from "./selectBoxes";

const spec: ComponentSpec = [
	"Checkbox",
	(node) => {
		const props = getFigmaComponentProperties(node);
		const labelNode = findChildByPath((node as unknown) as FrameNode, "_checkbox row/Checkbox + Label/Label text");

		if (!labelNode) {
				// Select boxes used to be called Checkbox, so if we can't find the
				// expected label, this may be an old Checkbox.  let the new Select boxes
				// handle it.
			return SelectBoxesSpec[1](node);
		}

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
