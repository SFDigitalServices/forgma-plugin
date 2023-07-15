import { ComponentSpec } from "@/types";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";
import { htmlelement } from "@/formio/htmlelement";

const spec: ComponentSpec = [
	"Plain text",
	(node) => {
		const props = getFigmaComponentProperties(node);
		const plainText = props.plainText as string;

		return htmlelement({
			text: plainText,
			key: plainText,
			...getFormioProperties(props)
		});
	}
];

export default spec;
