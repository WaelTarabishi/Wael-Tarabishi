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
        "/number": "+963940472324",
        "/study": "IT Engineering",
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
        "/personal_statement":
          "As a passionate and driven web developer, I am committed to creating innovative and user-friendly digital experiences. With a strong foundation in modern web technologies and a keen eye for design, I strive to deliver high-quality solutions that solve real-world problems. My goal is to continuously expand my skills and contribute to the growth of the tech industry.",
        "/career_goals":
          "My career aspirations are to become a lead web developer, where I can leverage my expertise in Next.js and other cutting-edge technologies to build scalable and performant applications. I am particularly interested in exploring opportunities in the e-commerce or fintech sectors, where I can apply my skills to create impactful solutions.",
        "/education_details": {
          courses: ["Data Structures", "Algorithms", "Web Development"],
          gpa: "High",
        },
        "/work_experience": {
          description:
            "While I am currently seeking job opportunities, I have gained valuable experience through personal projects and freelance work. with a focus on implementing responsive design and optimizing performance. These experiences have allowed me to develop a deep understanding of the software development lifecycle and the ability to work effectively in a team environment.",
          projects: [
            {
              name: "Full-stack websites with React and Next.js",
              description:
                "Developed responsive and performant web applications using React and Next.js.",
            },
            {
              name: "MERN stack applications",
              description:
                "Built full-stack applications using the MERN (MongoDB, Express, React, Node.js) stack.",
            },
          ],
        },
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
