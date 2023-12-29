import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export const runtime = "edge";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

const promptText = (count: number) => `Each line in the following list is the label of an HTML form element. Replace each label with a camelCased, LEGAL JavaScript identifier that best summarizes the label. Each label MUST be less than 33 characters long, MUST start with a lowercase letter and MUST be unique across the list. For short labels, such as "Yes", "No" or "Other", use nearby context to give them a unique name. There are ${count} labels, so there MUST be ${count} identifiers in the response.

`;

function generatePrompt(
	labels: string[]): ChatCompletionMessageParam[]
{
	return [
		{
			role: "system",
			content: "You are a helpful employee of the City and County of San Francisco."
		},
		{
			role: "user",
			content: promptText(labels.length) + labels.join("\n")
		}
	];
}

export async function POST(request: Request)
{
	if (!openai.apiKey) {
		console.error("No API key");

		return {
			statusCode: 500,
			body: {
				error: {
					message: "OpenAI API key not configured.",
				}
			}
		};
	}

	const { labels } = await request.json();

	if (labels.length === 0) {
		return {
			statusCode: 500,
			body: {
				error: {
					message: "labels list is empty.",
				}
			}
		};
	}

	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		stream: true,
		messages: generatePrompt(labels)
	});
	const stream = OpenAIStream(response);

	return new StreamingTextResponse(stream);
}
