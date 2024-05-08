"use client";

import { useStartChatStore } from "@/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import ChatHeader from "./chat-header";
import { ChatMessages } from "./chat-messages";

const Chat = () => {
  const start = useStartChatStore((state) => state.start);
  if (start) {
    return (
      <Accordion
        type="single"
        collapsible
        className="relative bg-white text-white z-40 shadow">
        <AccordionItem value="item-1">
          <div className="fixed right-8 w-96 bottom-8 bg-[#141c27] border border-slate-900 rounded-md overflow-hidden">
            <div className="w-full h-full flex flex-col">
              <AccordionTrigger className="px-6 border-b border-zinc-300">
                <ChatHeader />
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col h-80">
                  <ChatMessages />
                </div>
              </AccordionContent>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    );
  }
};

export default Chat;
