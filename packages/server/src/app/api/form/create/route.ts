const url = process.env.FORMIO_BASE_URL ?? "";
const token = process.env.FORMIO_TOKEN ?? "";

export const runtime = "edge";

export async function POST(request: Request)
{
	const { method, body } = request;
	const headers = Object.assign(
		{},
		request.headers,
		{
			"Content-Type": "application/json",
			"x-token": token,
		}
	);

	return fetch(url + "/form", {
		method,
		headers,
		body,
			// this duplex key seems to be required now in node and throws error if
			// it's not there, but TS complains about it
			// @ts-ignore
		duplex: "half"
	});
}
