import { Panel } from "@/utils/labels";

//const GenerateKeysURL = "http://127.0.0.1:3000/api/generateKeys";
//const GenerateKeysURL = "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-ebdb2c50-b3cd-475a-a51d-2cf90d5b6185/openai/generateKeys";
const BaseURL = "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-ebdb2c50-b3cd-475a-a51d-2cf90d5b6185/openai";

export async function generateKeys(
	panels: Panel[]): Promise<Panel[]>
{
	const body = JSON.stringify({ panels });
	const response = await fetch(`${BaseURL}/generateKeys`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body
	});

	return (await response.json()).result;
}

export async function generateErrors(
	panels: Panel[]): Promise<Panel[]>
{
	const body = JSON.stringify({ panels });
	const response = await fetch(`${BaseURL}/generateErrors`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body
	});

	return (await response.json()).result;
}
