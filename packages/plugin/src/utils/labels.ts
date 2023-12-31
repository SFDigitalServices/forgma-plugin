import { FormioJSON } from "@/types";

type Label = string;
type Path = (string|number)[];

interface ValueItem {
	label: string;
	value: string;
	shortcut: string;
}

type DefaultsMap = Record<string, boolean>;

export interface Component {
	type: string;
	label?: string;
	values?: ValueItem[];
	defaultValue?: DefaultsMap|boolean,
	[key: string]: any;
}

export interface Panel extends FormioJSON {
	type: "panel",
	components: Component[];
}
const NumberPattern = /^\d+\.\s+/;

const targetTypes = [
	"checkbox",
	"file",
	"radio",
	"selectboxes",
	"textfield",
	"textarea",
	"phoneNumber",
	"email"
];

function getByPath(
	obj: Record<string|number, any>,
	path: Path)
{
	let current = obj;
	let next;

	for (const key of path) {
		next = current[key];

		if (typeof next !== "undefined") {
			current = next;
		} else {
			break;
		}
	}

	return next;
}

function pushNumberedLabel(
	list: string[],
	label: string)
{
	list.push(`${list.length + 1}. ${label}`);
}

export function extractLabels(
	panels: Panel[]): [Label[], Path[], string[]]
{
	const labels: Label[] = [];
	const paths: Path[] = [];
	const existingKeys: string[] = [];

	panels.forEach((panel, panelIndex) => {
		panel.components.forEach((component, componentIndex) => {
			const { type, label, key, values } = component;

			if (targetTypes.includes(type)) {
				const componentPath = [panelIndex, "components", componentIndex];

				if (label) {
						// prepend a number to the label, as that seems to help the AI keep
						// track of them
					pushNumberedLabel(labels, label);
					paths.push([...componentPath]);
					existingKeys.push(key);
				}

				if (values) {
					values.forEach(({ label, value }, valueIndex) => {
						pushNumberedLabel(labels, label);
						paths.push([...componentPath, "values", valueIndex]);
						existingKeys.push(value);
					});
				}
			}
		});
	});

	return [labels, paths, existingKeys];
}

export function extractLabelsKeysOptions(
	panels: Panel[])
{
	const result: string[] = [];

	panels.forEach((panel) => {
		panel.components.forEach((component) => {
			const { type, label, key, values } = component;

			if (targetTypes.includes(type)) {
				const row = [label, key, type];

				if (values) {
					row.push(values.map(({ value }) => value).join(", "));
				}

				result.push(row.join("\t"));
			}
		});
	});

	return result.join("\n");
}

export function extractRequiredLabels(
	panels: Panel[]): [Label[], Path[]]
{
	const labels: Label[] = [];
	const paths: Path[] = [];

	panels.forEach((panel, panelIndex) => {
		panel.components.forEach((component, componentIndex) => {
			const { type, label, key, validate, values } = component;

			if (targetTypes.includes(type)) {
				const componentPath = [panelIndex, "components", componentIndex];

				if (label && validate?.required) {
						// prepend a number to the label, as that seems to help the AI keep
						// track of them
					pushNumberedLabel(labels, label);
					paths.push([...componentPath]);
				}
			}
		});
	});

	return [labels, paths];
}

//export function extractKeys(
//	panels: FormioJSON[]): [Label[], Path[], string[]]
//{
//	const keys: string[] = [];
//	const paths: Path[] = [];
//	const existingKeys: string[] = [];
//
//	panels.forEach((panel, panelIndex) => {
//		panel.components.forEach((component: FormioJSON, componentIndex: number) => {
//			const { type, label, key, values } = component;
//
//			if (targetTypes.includes(type)) {
//				const componentPath = [panelIndex, "components", componentIndex];
//
//				if (key) {
//						// prepend a number to the label, as that seems to help the AI keep
//						// track of them
//					pushNumberedLabel(keys, key);
//					paths.push([...componentPath]);
//					existingKeys.push(key);
//				}
//
//				if (values) {
//					values.forEach(({ label, value }, valueIndex) => {
//						pushNumberedLabel(keys, label);
//						paths.push([...componentPath, "values", valueIndex]);
//						existingKeys.push(value);
//					});
//				}
//			}
//		});
//	});
//
//	return [keys, paths, existingKeys];
//}

export function insertKeys(
	panels: Panel[],
	paths: Path[],
	keys: string[],
	existingKeys: string[])
{
	paths.forEach((path, i) => {
		const key = keys[i].replace(NumberPattern, "");
		const target = getByPath(panels, path);

		if (target) {
			if (path.includes("values")) {
				const existingKey = existingKeys[i];
				const parent = getByPath(panels, path.slice(0, -2));

				target.value = key;

					// if the new key is the same as the existing one, we don't need to
					// make any changes to the parent component
				if (parent && key !== existingKey) {
					parent.defaultValue[key] = parent.defaultValue[existingKey];
					delete parent.defaultValue[existingKey];
				}
			} else {
				target.key = key;
			}
		} else {
			throw new Error(`Bad path: ${path}`);
		}
	});

	return panels;
}

export function insertErrorMessages(
	panels: Panel[],
	paths: Path[],
	errorMessages: string[])
{
	paths.forEach((path, i) => {
		const errorMessage = errorMessages[i].replace(NumberPattern, "");
		const target = getByPath(panels, path);

		if (target) {
			target.validate.customMessage = errorMessage;
		} else {
			throw new Error(`Bad path: ${path}`);
		}
	});

	return panels;
}
