import { ComponentSpec } from "@/types";
import { uniqueKey } from "@/utils/string";

const content = (icon: string, text: string) => `<span class="mr-2" data-icon="${icon}"></span>\n${text}`;

function createSpec(
	name: string,
	icon: string): ComponentSpec
{
	return [
		name,
		(node) => {
			const text = (node as FrameNode).children[1] as TextNode;

			return {
				type: "htmlelement",
				key: uniqueKey(`${name.toLowerCase()}Note`),
				label: "html",
				tag: "div",
				content: content(icon, text.characters),
				className: "mb-40",
				tableView: false,
				input: false,
				attrs: [
					{
						attr: "",
						value: ""
					}
				],
			};
		}
	];
}

export const Documents = createSpec("Documents", "document");
export const Time = createSpec("Time", "pencil");
