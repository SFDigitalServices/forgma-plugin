import { FormioJSON } from "@/types";
import {
	extractLabels,
	extractRequiredLabels,
	insertErrorMessages,
	insertKeys,
	Panel
} from "@/utils/labels";

//const GenerateKeysURL = "http://127.0.0.1:3000/api/generateKeys";
//const GenerateKeysURL = "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-ebdb2c50-b3cd-475a-a51d-2cf90d5b6185/openai/generateKeys";
//const BaseURL = "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-ebdb2c50-b3cd-475a-a51d-2cf90d5b6185/openai";
const BaseURL = "https://forgma-plugin-server-fwextensions.vercel.app/api";
//const BaseURL = "http://127.0.0.1:3000/api";

function post(
	call: string,
	value: object)
{
	const body = JSON.stringify(value);

	return fetch(`${BaseURL}/${call}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body
	});
}

export async function generateKeys(
	panels: Panel[]): Promise<Panel[]>
{
	const [labels, paths, existingKeys] = extractLabels(panels);
	const response = await post("generateKeys", { labels });
	const keys = (await response.text()).split("\n");
	const result = insertKeys(panels, paths, keys, existingKeys);

	return result;
}

export async function generateErrors(
	panels: Panel[]): Promise<Panel[]>
{
	const [labels, paths] = extractRequiredLabels(panels);
	const response = await post("generateErrors", { labels });
	const errors = (await response.text()).split("\n");
	const result = insertErrorMessages(panels, paths, errors);

	return result;
}

export async function createForm(
	form: FormioJSON)
{
	return post("form/create", form);
}
