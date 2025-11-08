"use client";
import {
  ListPageTemplate,
  ProfileBar,
  ProtectedRoute,
  Spinner,
  TypingAnimation,
  HTMLTypingAnimation,
} from "@/components";
import { useAuth, useLoader } from "@/contexts";
import { IChatMessage } from "@/types";
import { useEffect, useId, useRef, useState } from "react";
import { chatAIv2 } from "@/http/backend";
import { useApiHandler } from "@/hooks";

const messages = [
  {
    content: "<p>Hi! I'm your AI assistant. How can I help you today?</p>",
    type: "ai",
  },
] as IChatMessage[];

export default function Chatbot() {
  const sessId = useId();
  const { userData } = useAuth();
  const [chatHistories, setChatHistories] = useState<IChatMessage[]>(messages);
  const [text, setText] = useState("");
  const [loadingCountLocal, setLoadingCountLocal] = useState(0);
  const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handleResponse } = useApiHandler();
  const isLoadingLocal = loadingCountLocal > 0;
  const { withGenericLoading } = useLoader();

  const withLoadingLocal = async <T,>(fn: () => Promise<T>): Promise<T> => {
    return withGenericLoading(fn, setLoadingCountLocal);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function chatAIReply() {
      const L = chatHistories.length;
      if (chatHistories[L - 1].type === "human") {
        const replyRes = await withLoadingLocal(() =>
          chatAIv2(chatHistories[L - 1].content),
        );
        handleResponse(replyRes);
        if (!replyRes.success) return;
        setChatHistories((prev: IChatMessage[]) => {
          if (replyRes.data) {
            const newMessages = [...prev, replyRes.data];
            // Set the last AI message to show typing animation
            setTypingMessageIndex(newMessages.length - 1);
            return newMessages;
          }
          return prev;
        });
      }
    }
    chatAIReply();

    console.log("abc", sessId);
  }, [chatHistories]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [chatHistories]);

  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <div className="flex flex-col h-[70vh]">
          <ProfileBar
            {...{
              title: `Chatbot vs ${userData?.username}`,
            }}
          />
          <hr className="my-2" />

          {/* Chat Messages Area - Takes remaining space and scrolls */}
          <div
            className="flex-1 flex flex-col space-y-2
            overflow-y-auto overflow-x-hidden
            min-h-0 pb-4 scrollbar"
          >
            {chatHistories.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={`
                    flex w-full space-x-2 items-end
                    flex-wrap
                    ${msg.type === "ai" ? "justify-start" : "justify-end"}`}
                >
                  {msg.type === "ai" && (
                    <span className="text-sm text-gray-400 mb-1 font-medium">
                      AI
                    </span>
                  )}
                  <div
                    className={`${
                      msg.type === "ai"
                        ? "bg-gray-700 text-gray-100"
                        : "bg-purple-600 text-white"
                    }
                    max-w-[70%] min-w-[100px] p-3
                    rounded-lg font-medium
                    break-words overflow-wrap-anywhere
                    ${msg.type === "ai" ? "rounded-bl-none" : "rounded-br-none"}
                    }
                  `}
                  >
                    {msg.type === "ai" && typingMessageIndex === index ? (
                      <HTMLTypingAnimation
                        html={msg.content}
                        speed={5}
                        onComplete={() => setTypingMessageIndex(null)}
                        onCharacterTyped={scrollToBottom}
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                    )}
                  </div>
                  {msg.type === "human" && (
                    <span className="text-sm text-gray-400 mb-1 font-medium">
                      You
                    </span>
                  )}
                </div>
              );
            })}
            {isLoadingLocal && (
              <div
                className={`
                flex w-full space-x-2 items-end
                flex-wrap justify-start`}
              >
                <span className="text-sm text-gray-400 mb-1 font-medium">
                  AI
                </span>
                <div
                  className={`bg-gray-700 text-gray-100
                p-3
                rounded-lg font-medium
                break-words overflow-wrap-anywhere
                rounded-bl-none
              `}
                >
                  <Spinner />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div
            className="flex-shrink-0 flex flex-col space-y-2 items-end
            bg-gray-900 pt-3 pb-3 border-t border-gray-700
            scrollbar"
          >
            <textarea
              className="bg-gray-800 text-gray-100 border border-gray-600
                rounded-lg p-3 w-full resize-none
                min-h-[40px] max-h-[120px] scrollbar
                placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              value={text}
              placeholder="Type your message..."
              onChange={(e) => {
                e.preventDefault();
                setText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (text.trim()) {
                    setChatHistories((prev: IChatMessage[]) => {
                      return [
                        ...prev,
                        {
                          content: `<p>${text.trim()}</p>`,
                          type: "human",
                        },
                      ];
                    });
                    setText("");
                  }
                }
              }}
            />
            <button
              className="px-4 py-2 bg-purple-600 text-white 
              font-medium w-fit rounded-lg hover:bg-purple-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200"
              disabled={!text.trim() || isLoadingLocal}
              onClick={(e) => {
                e.preventDefault();
                if (text.trim()) {
                  setChatHistories((prev: IChatMessage[]) => {
                    return [
                      ...prev,
                      {
                        content: `<p>${text.trim()}</p>`,
                        type: "human",
                      },
                    ];
                  });
                  setText("");
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      </ListPageTemplate>
    </ProtectedRoute>
  );
}
