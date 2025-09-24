"use client";
import { ListPageTemplate, ProfileBar, ProtectedRoute } from "@/components";
import { useAuth } from "@/contexts";
import { useEffect, useId, useState } from "react";

interface IChatMessage {
  content: string;
  type: string;
}

const messages = [
  {
    content: "Hi! I'm your AI assistant. How can I help you today?",
    type: "ai",
  },
  {
    content: "Find drugs for HIV",
    type: "human",
  },
  {
    content:
      "I can help you find information about HIV medications. Here are some commonly prescribed antiretroviral drugs: Tenofovir disoproxil fumarate (TDF), Emtricitabine (FTC), Efavirenz (EFV), Dolutegravir (DTG), Raltegravir (RAL), Darunavir (DRV), Atazanavir (ATV), and many others. These drugs work by targeting different stages of the HIV replication cycle to prevent the virus from multiplying and damaging the immune system.",
    type: "ai",
  },
  {
    content: "What are the side effects of these medications?",
    type: "human",
  },
  {
    content:
      "Common side effects of antiretroviral medications can include nausea, diarrhea, headache, fatigue, and rash. More serious side effects may include liver problems, kidney issues, bone density loss, and changes in body fat distribution. It's important to work closely with your healthcare provider to monitor for these effects and adjust treatment as needed.",
    type: "ai",
  },
  {
    content: "How long do I need to take these medications?",
    type: "human",
  },
  {
    content:
      "HIV medications are typically taken for life. The goal of antiretroviral therapy is to suppress the virus to undetectable levels, which helps maintain your immune system and prevents transmission to others. Stopping treatment can lead to viral rebound and potential resistance to medications. It's crucial to maintain adherence to your prescribed regimen.",
    type: "ai",
  },
  {
    content: "Thank you for the information!",
    type: "human",
  },
  {
    content:
      "You're welcome! Remember to always consult with your healthcare provider for personalized medical advice. If you have any other questions about HIV treatment or medications, feel free to ask.",
    type: "ai",
  },
] as IChatMessage[];

export default function Chatbot() {
  const sessId = useId();
  const { userData } = useAuth();
  const [chatHistories, setChatHistories] = useState<IChatMessage[]>(messages);
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("abc", sessId);
  }, []);

  return (
    <ProtectedRoute>
      <ListPageTemplate>
        <div className="flex flex-col h-[70vh]">
          <ProfileBar
            {...{
              title: `Chatbot vs ${userData?.username}`,
            }}
          />
          <hr className="mb-2" />

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
                    {msg.content}
                  </div>
                  {msg.type === "human" && (
                    <span className="text-sm text-gray-400 mb-1 font-medium">
                      You
                    </span>
                  )}
                </div>
              );
            })}
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
                          content: text.trim(),
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
              disabled={!text.trim()}
              onClick={(e) => {
                e.preventDefault();
                if (text.trim()) {
                  setChatHistories((prev: IChatMessage[]) => {
                    return [
                      ...prev,
                      {
                        content: text.trim(),
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
