"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import {
  Bot,
  MessageCircle,
  MessageCircleHeart,
  MessageCircleMore,
  User,
} from "lucide-react";

export function ChatMessages() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "api/chat",
      onError: (e) => {
        console.log(e);
      },
    });
  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  return (
    <main className="flex flex-col  h-screen max-h-dvh bg-background   text-black overflow-hidden w-auto">
      <section className="container px-0 pb-10 flex border border-muted-foreground flex-col flex-grow gap-4 mx-auto max-w-3xl">
        <ul
          ref={chatParent}
          className="h-1 p-4 flex-grow bg-muted/20 rounded-lg overflow-y-auto flex flex-col gap-4">
          {messages.map((m, index) => (
            <div key={m.id}>
              {m.role === "user" ? (
                <li key={index} className="flex flex-row">
                  <div className="rounded-xl p-4 bg-muted/40 shadow-md   flex flex-col">
                    <p className="text-black flex ">
                      <User className="h-5 w-5" />
                      Me:
                    </p>
                    <p>{m.content}</p>
                  </div>
                </li>
              ) : (
                <li key={index} className="flex flex-row-reverse ">
                  <div className="rounded-xl p-4 bg-muted/50 shadow-md flex w-auto">
                    <p className="text-black">
                      <span className="font-bold flex text-black">
                        <Bot className="h-5 w-5" /> Wael Tarabishi:
                      </span>
                      {m.content}
                    </p>
                  </div>
                </li>
              )}
            </div>
          ))}
        </ul>
      </section>
      <section className="p-2">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-3xl mx-auto items-center">
          <Input
            className="flex-1 min-h-[40px]"
            placeholder="Type your question here..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <Button className="ml-[8px]" type="submit" size={"icon"}>
            <MessageCircleMore />
          </Button>
        </form>
      </section>
    </main>
  );
}
