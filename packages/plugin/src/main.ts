import { FormioJSON, isFrame, isNotEmpty } from "@/types";
import { selection } from "@/utils/plugin";
import { getPanelJSON, processPanelConditionals } from "@/formio/getPanelJSON";
import { generateErrors, generateKeys } from "@/utils/open-ai";
import { extractLabels, Panel } from "@/utils/labels";

//const CreateFormURL = "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-ebdb2c50-b3cd-475a-a51d-2cf90d5b6185/formio/create";
//const CreateFormURL = "http://127.0.0.1:3000/api/create";
const CreateFormURL = "https://formio-proxy-nu.vercel.app/api/create";
const FormTag = "FORGMA";

//const url = "https://codepen.io/fwextensions/full/XWxeNNq?form_id=FORGMAcannabisCommunityOutreachAndGood&page=2";
const url = (id: string) => `https://formio-sfds.herokuapp.com/api/preview?source=https://formio.sfgov.org/dev-ruehbbakcoznmcf/${id}`;
const openBrowserUIString = (id: string) => `<script>window.open('${url(id)}','_blank');</script>`;

function createForm(
	form: FormioJSON)
{
	const body = JSON.stringify(form);

	return fetch(CreateFormURL, {
		method: "POST",
		body
	});
}

async function getFormJSON(
	node: FrameNode)
{
		// getPanelJSON returns a promise, since it calls the OpenAI API, so wait for
		// all the promises to settle before filtering out any nulls
	const panels: Panel[] = (await Promise.all(node.children.filter(isFrame).map(getPanelJSON)))
		.filter(isNotEmpty);
	const [firstPanel] = panels;

	if (firstPanel) {
		const { title: panelTitle, key } = firstPanel;
		const title = `${FormTag} ${panelTitle}`;
		const name = key;
		const path = name.toLowerCase();
		const initialKeys = extractLabels(panels)[2];
		let components: FormioJSON[] = panels;

		console.log("==== panels before gpt", panels);
		console.log(`==== keys before gpt\n${initialKeys.join("\n")}`);

		try {
			figma.notify("Talking to our robot overlords...", { timeout: 15000 });

			const result = await generateKeys(components);

			if (result) {
					// only update the components if we got something back from the server
				components = result;

//				const newKeys = extractLabels(result)[2];
//				console.log(`==== keys after gpt\n${extractLabels(result)[2].map((newKey, i) => `${initialKeys[i]}:\t\t${newKey}`).join("\n")}`);
//				const newKeys = extractLabels(result)[2].map((newKey, i) => [initialKeys[i], newKey]);
//				console.table(newKeys, ["default", "robotified"]);
//				console.log(`==== keys after gpt\n${extractLabels(result)[2].join("\n")}`);
			}
		} catch (e) {
			console.error(e);
		}

		try {
			figma.notify("Talking to our robot overlords...", { timeout: 15000 });

			const result = await generateErrors(components);

			if (result) {
					// only update the components if we got something back from the server
				components = result;
				console.log(`==== error messages\n${result.map((panel) => panel.components.map((comp: Panel) => comp?.validate?.customMessage).filter((o: Panel) => o)).flat().join("\n")}`);
			}
		} catch (e) {
			console.error(e);
		}

		console.log("==== panels after gpt", components);

		components = components.map(processPanelConditionals);

		return {
			type: "form",
			display: "wizard",
			title,
			name,
			path,
			tags: [FormTag],
			components
		};
	}

	return null;
}

export default async function() {
	const [selectedItem] = selection("GROUP");
	let exitMessage = "Make sure a group of panels is selected.";

	if (selectedItem?.children[0].type === "FRAME") {
		figma.notify("Converting Figma design...", { timeout: 500 });

		const form = await getFormJSON(selectedItem.children[0]);

		if (form) {
			figma.notify("Creating form...", { timeout: 500 });

			try {
				const response = await createForm(form);
				const responseJSON = await response.json();

				console.log("response", response, responseJSON);

				if (response.status == 200) {
					exitMessage = `Form created: ${form.name}`;

					figma.showUI(openBrowserUIString(form.name), { visible: false });
				} else {
					exitMessage = `ERROR: ${response.text}`;
				}
			} catch (e) {
				console.error(e);
				exitMessage = `ERROR: ${(e as Error).message}`;
			}

			console.log("FORM", form);
		}
	}

	setTimeout(() => figma.closePlugin(exitMessage), 500);
}
