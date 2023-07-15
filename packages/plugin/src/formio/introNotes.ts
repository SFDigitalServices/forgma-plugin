import { ComponentSpec } from "@/types";
import { htmlelement } from "@/formio/htmlelement";

const content = (icon: string, text: string) => `<span class="mr-2" data-icon="${icon}"></span>\n${text}`;

function createSpec(
	name: string,
	icon: string): ComponentSpec
{
	return [
		name,
		(node) => {
			const textNode = (node as FrameNode).children[1] as TextNode;
			const text = textNode.characters;

			return htmlelement({
				text: text,
				key: `${name.toLowerCase()}Note`,
				content: content(icon, text),
			});
		}
	];
}

export const Documents = createSpec("Documents", "document");
export const Time = createSpec("Time", "pencil");
