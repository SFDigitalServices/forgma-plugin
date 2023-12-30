import { fwidgets } from "fwidgets/main";
import { createForm } from "@/utils/api";
import { selection } from "@/utils/plugin";
import { getFormJSON } from "@/formio/getFormJSON";

//const url = "https://codepen.io/fwextensions/full/XWxeNNq?form_id=FORGMAcannabisCommunityOutreachAndGood&page=2";
const url = (id: string) => `https://formio-sfds.herokuapp.com/api/preview?source=https://formio.sfgov.org/oewdlive-ruehbbakcoznmcf/${id}`;
//const url = (id: string) => `https://formio-sfds.herokuapp.com/api/preview?source=https://formio.sfgov.org/ooc-form/${id}`;
const openBrowserUIString = (id: string) => `<script>window.open('${url(id)}','_blank');</script>`;

export default fwidgets(async ({ input, output }) => {
	const [selectedItem] = selection("GROUP");
	let exitMessage = "Make sure a group of panels is selected.";

	if (selectedItem?.children[0].type === "FRAME") {
		await output.text("Converting Figma design...");

		const form = await getFormJSON(selectedItem.children[0]);

		if (form) {
			await output.text("Creating form...");

			try {
				const response = await createForm(form);
				const responseText = await response.text();

				console.log("response", response, "TEXT:", responseText.slice(0, 100));
				console.log("response JSON", JSON.parse(responseText));

				if (response.status == 200) {
					exitMessage = `Form created: ${form.name}`;

					figma.showUI(openBrowserUIString(form.name), { visible: false });
				} else {
					exitMessage = `ERROR: ${response.text}`;
				}
			} catch (e) {
				console.error(e);
				exitMessage = `ERROR: ${(e as Error).message.slice(0, 150)}`;
			}

			console.log("FORM", form);
		}
	}

	await input.buttons(exitMessage, ["Done"]);
});
