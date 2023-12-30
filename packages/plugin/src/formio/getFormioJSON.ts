import {
	ComponentProcessor,
	FormioJSON,
	isFrame,
	isInstance,
} from "@/types";
import AlertCallout from "@/formio/components/alertCallout";
import Checkbox from "@/formio/components/checkbox";
import Dropdown from "@/formio/components/dropdown";
import Fieldset from "@/formio/components/fieldset";
import Notes from "@/formio/components/notes";
import PlainText from "@/formio/components/plainText";
import Radio from "@/formio/components/radio";
import Select from "@/formio/components/select";
import SelectBoxes from "@/formio/components/selectBoxes";
import TextArea from "@/formio/components/textArea";
import TextField from "@/formio/components/textField";
import TextNode from "@/formio/components/textNode";
import Upload from "@/formio/components/upload";
import { Documents, Time } from "@/formio/components/introNotes";

const ComponentProcessors: Record<string, ComponentProcessor> = Object.fromEntries([
	AlertCallout,
	Checkbox,
	Documents,
	Dropdown,
	Fieldset,
	Notes,
	PlainText,
	Radio,
	Select,
	SelectBoxes,
	TextArea,
	TextField,
// TODO: this is an ugly kludge to handle text fields with this name
	["Text field/Default", TextField[1]],
	TextNode,
	Time,
	Upload
]);

function getComponentType(
	node: SceneNode)
{
	let type: string = node.type;

	if (isInstance(node)) {
		const { mainComponent } = node;

		if (mainComponent) {
			if (mainComponent.parent) {
				type = mainComponent.parent.name;
			} else {
				type = mainComponent.name;
			}
		}
	} else if (isFrame(node)) {
		type = node.name;
	}

	return type;
}

export function getFormioJSON(
	node: SceneNode): FormioJSON|null
{
	const type = getComponentType(node);
	const processor = ComponentProcessors[type];

	if (processor && node) {
		const json = processor(node);

		if (json && json.type !== "Conditional" && isInstance(node) && node.paddingLeft) {
				// we need to temporarily store the paddingLeft on the component so we
				// know which components are affected by which conditional
			json.conditionalLevel = node.paddingLeft;
		}

		return json;
	} else if (isFrame(node) && node.children.length) {
		const [conditional, ...components] = node.children.map(getFormioJSON);

		if (conditional?.type === "Conditional") {
				// in the OEWD forms, conditionals are grouped with the elements the
				// affect, so add a conditionalLevel to each child in the group
			components.forEach(component => component && (component.conditionalLevel = 40));

			return [conditional, ...components];
		}
	}

	return null;
}
