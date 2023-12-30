import { ComponentSpec } from "@/types";
import { getFormioProperties } from "@/formio/getFormioProperties";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";
import { htmlelement } from "@/formio/components/htmlelement";

const AlertStylesByType: Record<string, { icon: string, iconClass: string, bg: string }> = {
	Informational: {
		icon: "alert",
		iconClass: "",
		bg: "bg-blue-1"
	},
	Success: {
		icon: "alert",
		iconClass: "",
		bg: "bg-blue-1"
	},
	Failure: {
		icon: "delete",
		iconClass: "fg-red-4",
		bg: "bg-red-1"
	}
} as const;

const spec: ComponentSpec = [
	"Alert callouts",
	(node) => {
		const props = getFigmaComponentProperties(node);
		const { type, alertMessage } = props;
		const { icon, iconClass, bg } = AlertStylesByType[String(type)];

		return htmlelement({
			text: alertMessage as string,
			key: alertMessage as string,
			label: `${type} alert`,
			content: `<span class="mr-2 ${iconClass}" data-icon="${icon}"></span>\n${alertMessage}\n`,
			className: `flex flex-items-start p-40 my-40 ${bg}`,
			lockKey: true,
			source: "61b7cba855627e36d98108ca",
			isNew: true,
			attrs: [
				{
					attr: "role",
					value: "alert"
				}
			],
			...getFormioProperties(props)
		});
	}
];

export default spec;
