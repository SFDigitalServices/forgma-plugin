import { ComponentSpec } from "@/types";
import { getFigmaComponentProperties } from "@/formio/getFigmaComponentProperties";

const IsPattern = / is\s*$/i;
const OrPattern = /\s*OR\s*/i;

const spec: ComponentSpec = [
	"Notes",
	(node) => {
		const props = getFigmaComponentProperties(node);

		if (props.type !== "Conditional logics") {
			return null;
		}

			// the `Label` field used to be called `Value text`
		const labels = ((props.label || props.valueText) as string)?.split(OrPattern);

		return {
			type: "Conditional",
			operator: IsPattern.test(props.logic as string)
				? "eq"
				: "neq",
			labels
		};
	}
];

export default spec;
