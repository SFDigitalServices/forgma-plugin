import { FigmaComponentProps, isInstance } from "@/types";
import { clean } from "@/utils/string";

export function getFigmaComponentProperties(
	node: SceneNode): FigmaComponentProps
{
	if (!isInstance(node)) {
		return {};
	}

	const { componentProperties } = node;

	return Object.fromEntries(Object.entries(componentProperties).map(
		([key, value]) => [clean(key), value.value])
	);
}
