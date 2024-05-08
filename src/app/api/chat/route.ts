import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { CharacterTextSplitter } from "langchain/text_splitter";

// const loader = new JSONLoader("src/data/wael.json", [
//   "/name",
//   "/last_name",
//   "/location/country",
//   "/location/city",
//   "/occupation/title",
//   "/occupation/skills",
//   "/age",
//   "/interests",
//   "/employment",
//   "/education/degree",
//   "/education/major",
//   "/education/institution",
//   "/education/graduation_year",
//   "/languages",
//   "/social_media/twitter",
//   "/social_media/github",
//   "/social_media/linkedin",
//   "/projects",
//   "/certifications",
// ]);

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `Answer the user's questions based only on the following context. If the answer is not in the context, reply politely that you do not have that information available.:
==============================
Context: {context}
==============================
Current conversation: {chat_history}

user: {question}
assistant:`;

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const currentMessageContent = messages[messages.length - 1].content;

    // const docs = await loader.load();

    // load a JSON object
    const textSplitter = new CharacterTextSplitter();
    const docs = await textSplitter.createDocuments([
      JSON.stringify({
        "/name": "Wael Tarabishi",
        "/location/country": "Syria",
        "/location/city": "Damascus",
        "/phone_number": "+963940472324",
        "/age": "22",
        "/occupation/title": "Web Developer",
        "/occupation/specialization": "Next.js",
        "/education/institution": "Arab International University",
        "/education/degree": "Currently pursuing",
        "/education/years_remaining": 2,
        "/employment": "Currently seeking job opportunities",
        "/skills": [
          "JavaScript",
          "TypeScript",
          "HTML",
          "CSS",
          "Tailwind CSS",
          "React",
          "Next.js",
          "Node.js",
          "Express.js",
          "MongoDB",
          "SQL",
          "Git",
          "Prisma",
          "RESTful APIs",
          "Responsive Web Design",
        ],
        "/projects": [
          "Full-stack websites with React and Next.js",
          "MERN stack applications",
        ],
        "/interests": ["Sports", "Coding"],
        "/social_media/github": "https://github.com/WaelTarabishi",
        "/social_media/linkedin":
          "https://linkedin.com/in/wael-tarabishi-95b12825a",
        "/social_media/instagram": "https://www.instagram.com/wael_tarabishi/",
        "/social_media/facebook": "https://www.facebook.com/wael.tarabishi.7/",
      }),
    ]);

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      model: "gpt-3.5-turbo",
      temperature: 0,
      streaming: true,
      verbose: true,
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and encoding.
     */
    const parser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: () => formatDocumentsAsString(docs),
      },
      prompt,
      model,
      parser,
    ]);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      question: currentMessageContent,
    });

    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
