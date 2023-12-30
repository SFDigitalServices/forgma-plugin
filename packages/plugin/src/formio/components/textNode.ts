import { ComponentSpec } from "@/types";
import { htmlelement } from "@/formio/components/htmlelement";

const spec: ComponentSpec = [
	"TEXT",
	(node ) => {
		const plainText = (node as TextNode).characters;

		return htmlelement({
			text: plainText,
			key: plainText,
		});
	}
];

export default spec;
