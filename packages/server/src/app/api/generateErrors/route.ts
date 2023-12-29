import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export const runtime = "edge";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

function generatePrompt(
	labels: string[]): ChatCompletionMessageParam[]
{
	return [
		{
			role: "system",
			content: "Each line in the following list contains the type of a required HTML form element and its label, with the type in brackets. For each line, create an error message that asks the user to fill out that information in the form. Do not include the form element type in the error message. Do not include the word \"error\" in the error messages. The message MUST NOT start with \"please\"."
		},
		{
			role: "user",
			content:
				`1. [radio] Have you informed your neighbors?
2. [selectboxes] How did you let your district supervisor know if your meeting
3. [textfield] Date you contacted your district supervisor about your meeting
4. [file] Upload your neighborhood notice
5. [radio] Will you have a compassion program for your business?
6. [selectboxes] What populations will you serve?`
		},
		{
			role: "system",
			content:
				`1. Fill out the information regarding whether you have informed your neighbors.
2. Select how you let your district supervisor know about your meeting.
3. Provide the date you contacted your district supervisor regarding your meeting.
4. Upload your neighborhood notice file.
5. Indicate whether you will have a compassion program for your business.
6. Select the populations you will serve.`
		},
		{
			role: "user",
			content: labels.join("\n")
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
