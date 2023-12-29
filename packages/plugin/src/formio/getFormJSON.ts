import { extractLabelsKeysOptions } from "@/utils/labels";
import { generateErrors, generateKeys } from "@/utils/api";
import { isFrame, isNotEmpty } from "@/types";
import { getPanelJSON, processPanelConditionals } from "@/formio/getPanelJSON";
import { hiddenFields, hiddenFieldsPageName } from "@/formio/hiddenFields";

const Roles = {
	OOC: {
		Administrator: "610b0c5358fe8ce406e8f4ec",
		Authenticated: "610b0c5358fe8c749be8f4ed",
		Anonymous: "610b0c5358fe8c0756e8f4ee",
	},
	OEWD: {
		Administrator: "6124300e58fe8ccd00e91246",
		Authenticated: "6124300e58fe8c0669e91247",
		Anonymous: "6124300e58fe8c82b5e91248",
	}
};
const Environment = "OEWD";
const FormTag = "FORGMA";
const DefaultForm = {
	type: "form",
	display: "wizard",
	tags: [],
	access: [
		{
			type: "create_own",
			roles: []
		},
		{
			type: "create_all",
			roles: []
		},
		{
			type: "read_own",
			roles: []
		},
		{
			type: "read_all",
			roles: [
				Roles[Environment].Administrator,
				Roles[Environment].Authenticated,
				Roles[Environment].Anonymous,
			]
		},
		{
			type: "update_own",
			roles: []
		},
		{
			type: "update_all",
			roles: []
		},
		{
			type: "delete_own",
			roles: []
		},
		{
			type: "delete_all",
			roles: []
		},
		{
			type: "team_read",
			roles: []
		},
		{
			type: "team_write",
			roles: []
		},
		{
			type: "team_admin",
			roles: []
		}
	],
		// by default, an anonymous user should only have access to their own submission
		// if it's in a draft state.  if it is, the field match rules below will add the
		// `anonymous` access to the read/write roles.  otherwise, anonymous users won't
		// be able to access the submitted form.
	submissionAccess: [
		{
			type: "create_own",
			roles: [
				Roles[Environment].Anonymous,
			]
		},
		{
			type: "create_all",
			roles: [
				Roles[Environment].Anonymous,
			]
		},
		{
			type: "read_own",
			roles: []
		},
		{
			type: "read_all",
			roles: [
				Roles[Environment].Administrator,
			]
		},
		{
			type: "update_own",
			roles: []
		},
		{
			type: "update_all",
			roles: [
				Roles[Environment].Administrator,
			]
		},
		{
			type: "delete_own",
			roles: []
		},
		{
			type: "delete_all",
			roles: []
		},
		{
			type: "team_read",
			roles: []
		},
		{
			type: "team_write",
			roles: []
		},
		{
			type: "team_admin",
			roles: []
		}
	],
	fieldMatchAccess: {
		read: [
			{
				formFieldPath: "state",
				value: "draft",
				operator: "$eq",
				valueType: "string",
				roles: [
					"610b0c5358fe8c0756e8f4ee"
				]
			}
		],
		write: [
			{
				formFieldPath: "",
				value: "",
				operator: "$eq",
				valueType: "string",
				roles: []
			}
		],
		create: [
			{
				formFieldPath: "",
				value: "",
				operator: "$eq",
				valueType: "string",
				roles: []
			}
		],
		admin: [
			{
				formFieldPath: "",
				value: "",
				operator: "$eq",
				valueType: "string",
				roles: []
			}
		],
		delete: [
			{
				formFieldPath: "",
				value: "",
				operator: "$eq",
				valueType: "string",
				roles: []
			}
		],
		update: [
			{
				formFieldPath: "state",
				value: "draft",
				operator: "$eq",
				valueType: "string",
				roles: [
					"610b0c5358fe8c0756e8f4ee"
				]
			}
		],
	},
	controller: "try {\n\tFormio.requireLibrary(\"add-save-link\", \"\", \"https://static.sf.gov/formio/js/add-save-link.js\");\n} catch (e) {\n\tconsole.error(e);\n}\n",
};
const FirstPanelProperties = {
	hideSidebar: "true",
	hideFromNavigation: "true"
};

export async function getFormJSON(
	node: FrameNode)
{
		// getPanelJSON returns a promise, since it calls the OpenAI API, so wait for
		// all the promises to settle before filtering out any nulls
	const panels = node.children.filter(isFrame).map(getPanelJSON)
		.filter(isNotEmpty);
	const [firstPanel] = panels;

	if (firstPanel) {
		const { title: panelTitle, key } = firstPanel;
		const title = `${FormTag} ${panelTitle}`;
		const name = key;
		const path = name.toLowerCase();
		let components = panels;

			// we don't want the first panel to show the nav bar on the right or to be
			// listed in it
		firstPanel.properties = { ...FirstPanelProperties };

		if (figma.currentPage.name === hiddenFieldsPageName) {
				// if this is a Part 2 OOC form, add some hidden fields that will be filled
				// in by an Airtable automation
			firstPanel.components.unshift(hiddenFields);
		}

		console.log("==== panels before gpt", panels);

		try {
			figma.notify("Talking to our robot overlords...", { timeout: 15000 });

			const result = await generateKeys(components);

			if (result) {
					// only update the components if we got something back from the server
				components = result;
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
			}
		} catch (e) {
			console.error(e);
		}

		console.log("==== panels after gpt", components);

			// print out tab-delimited cells with the label, key, type and options of
			// each component in the form, so that they can be easily copied into a
			// mapping document
		console.log(
`▼▼▼▼ copy and paste these cells into a spreadsheet ▼▼▼▼

${extractLabelsKeysOptions(components)}

▲▲▲▲ copy and paste these cells into a spreadsheet ▲▲▲▲`);

		components = components.map(processPanelConditionals);

		return {
			...DefaultForm,
			title,
			name,
			path,
			tags: [FormTag],
			components
		};
	}

	return null;
}
