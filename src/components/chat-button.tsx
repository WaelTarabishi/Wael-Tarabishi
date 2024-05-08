"use client";
import { Bot } from "lucide-react";
import { Button } from "./ui/button";
import { useStartChatStore } from "@/store";

const Chat = () => {
  const start = useStartChatStore((state) => state.start);
  const change = useStartChatStore((state) => state.change);
  return (
    <div>
      <Button variant={"ghost"} className="outline" onClick={change}>
        <div className="flex  items-center justify-center gap-2">
          <span className="font-semibold">Chat with AI</span>
          <Bot className="h-6 w-6 " />
        </div>
      </Button>
    </div>
  );
};

export default Chat;
