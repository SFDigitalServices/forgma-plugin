import { uniqueKey } from "@/utils/string";

const DefaultProps = {
	type: "htmlelement",
	label: "html",
	tag: "div",
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

export function htmlelement({
	text = "",
	key = "htmlelement",
	...props})
{
	const content = `<div style="white-space: pre-wrap;">${text}</div>`;
	const refreshOnChange = text.includes("{{");

	return {
		...DefaultProps,
		key: uniqueKey(key),
		content,
		refreshOnChange,
		...props,
	};
}
