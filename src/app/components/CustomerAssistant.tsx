"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, MessageCircle, BookOpen, Library, ShoppingBag, Send, Globe } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function CustomerAssistant() {
  const [isOpen, setIsOpen] = useState(false);
const [language, setLanguage] = useState<"English" | "አማርኛ" | "Afaan Oromoo">("English");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Welcome to OUR LAUGHTER IS ONE! How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);
useEffect(() => {
  const welcomeMessages = {
    English: "Welcome to OUR LAUGHTER IS ONE! How can I help you today?",
    "አማርኛ": "እንኳን ወደ OUR LAUGHTER IS ONE በደህና መጡ!",
    "Afaan Oromoo": "Baga gara OUR LAUGHTER IS ONE dhuftan!",
  };

  setMessages((previous) =>
    previous.map((item, index) =>
      index === 0 && item.role === "assistant"
        ? { ...item, text: welcomeMessages[language] }
        : item
    )
  );
}, [language]);
  function askSuggestedQuestion(question: string) {
  setMessage(question);
}
function clearChat() {
  setMessages([
    {
      role: "assistant",
      text:
        language === "አማርኛ"
          ? "እንኳን ወደ OUR LAUGHTER IS ONE በደህና መጡ!"
          : language === "Afaan Oromoo"
          ? "Baga gara OUR LAUGHTER IS ONE dhuftan!"
          : "Welcome to OUR LAUGHTER IS ONE! How can I help you today?",
    },
  ]);
  setMessage("");
}
async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({ message: text, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Assistant unavailable.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: data.reply },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:language === "አማርኛ"
    ? "ይቅርታ፣ ረዳታችን ለጊዜው አይገኝም። እባክዎ ቆይተው እንደገና ይሞክሩ።"
    : language === "Afaan Oromoo"
    ? "Dhiifama, gargaaraan keenya yeroo ammaa hin argamu. Maaloo yeroo muraasa booda irra deebi'ii yaali."
    : "Sorry, our assistant is temporarily unavailable. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          right: "22px",
          bottom: "22px",
          zIndex: 1000,
          width: "62px",
          height: "62px",
          borderRadius: "50%",
          border: "1px solid #d9ad5c",
          background: "#090806",
          color: "#d9ad5c",
          fontSize: "25px",
          cursor: "pointer",
          boxShadow: "0 4px 25px #0008",
        }}
        aria-label="Open shopping assistant"
      >
        {isOpen ? "×" : "✦"}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: "22px",
            bottom: "96px",
            zIndex: 999,
            width: "min(370px, calc(100vw - 32px))",
           height: "min(600px, calc(100dvh - 125px))",
            background: "#090806",
border: "1px solid #d9ad5c",
borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 35px #0008",
          }}
        >
         <div
  style={{
   backgroundImage: `
  linear-gradient(rgba(9, 8, 6, 0.35), rgba(9, 8, 6, 0.72)),
  url("/IMG_20261116_212224_672.jpg")
`,
backgroundSize: "45% auto",
backgroundPosition: "right center",
backgroundRepeat: "no-repeat",
padding: "20px",
color: "#f5eddf",
position: "relative",
  }}
>
  <button
  type="button"
  onClick={() => setIsOpen(false)}
  aria-label="Minimize chat"
  style={{
    position: "absolute",
    top: "12px",
    right: "14px",
    background: "transparent",
    color: "#d9ad5c",
    border: "1px solid #bd9145",
    borderRadius: "6px",
    padding: "4px 9px",
    cursor: "pointer",
    fontSize: "16px",
  }}
>
  −
</button>
           
<div
  style={{
    display: "inline-block",
    color: "#FFE3A3",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "2.5px",
    padding: "6px 10px",
    background: "rgba(9, 8, 6, 0.72)",
    border: "1px solid rgba(217, 173, 92, 0.45)",
    borderRadius: "6px",
    textShadow: "0 2px 4px #000, 0 0 10px rgba(255, 220, 150, 0.5)",
  }}
>
  OUR LAUGHTER IS ONE
</div>


           <div
  style={{
    marginTop: "8px",
    fontSize: "22px",
    fontWeight: "500",
    color: "#fff8eb",
    textShadow: "0 2px 12px #000",
    letterSpacing: "0.5px",
  }}
>
             {language === "አማርኛ"
  ? "የግዢ ረዳት"
  : language === "Afaan Oromoo"
  ? "Gargaaraa Bittaa"
  : "Shopping Assistant"}
            </div>

            <div
              style={{
                marginTop: "5px",
             color: "#e2c99e",
fontSize: "11px",
letterSpacing: "2px",
textShadow: "0 2px 8px #000",
              }}
            >
             {language === "አማርኛ"
  ? "አንብብ • ፈገግ በል • አንድ ሁን"
  : language === "Afaan Oromoo"
  ? "Dubbisi • Kolfi • Tokko Ta'i"
  : "READ • SMILE • BE UNITED."}
            </div>
         <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "14px",
  }}
>
  <Globe size={17} color="#d9ad5c" />

  <select
    value={language}
    onChange={(e) =>
      setLanguage(e.target.value as "English" | "አማርኛ" | "Afaan Oromoo")
    }
    style={{
      padding: "9px 14px",
      background: "rgba(9, 8, 6, 0.85)",
      color: "#e8c783",
      border: "1px solid #bd9145",
      borderRadius: "8px",
      fontSize: "13px",
      cursor: "pointer",
    }}
  >
    <option value="English">English</option>
    <option value="አማርኛ">አማርኛ</option>
    <option value="Afaan Oromoo">Afaan Oromoo</option>
  </select>
</div>
<button
  type="button"
  onClick={clearChat}
  style={{
  marginTop: "10px",
  padding: "8px 14px",
  background: "rgba(9, 8, 6, 0.85)",
  color: "#e8c783",
  border: "1px solid #bd9145",
  borderRadius: "8px",
  fontSize: "12px",
  cursor: "pointer",
  letterSpacing: "0.5px",
}}
>
 <>
  <Trash2 size={14} style={{ display: "inline", marginRight: "6px" }} />
  {language === "አማርኛ"
    ? "ውይይት አጽዳ"
    : language === "Afaan Oromoo"
    ? "Haasa'a qulqulleessi"
    : "Clear Chat"}
</>
</button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
              background: "#100e0a",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((item, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    item.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "11px 14px",
                  borderRadius: "12px",
                background:
  item.role === "user" ? "#292013" : "#17140f",
color: "#f5eddf",
border: "1px solid #9b7538",
boxShadow: "0 3px 12px #0006",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.text}
              </div>
            ))}
{messages.length === 1 && !loading && (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {[
      language === "አማርኛ"
        ? "ይህ መጽሐፍ ስለ ምንድን ነው?"
        : language === "Afaan Oromoo"
        ? "Kitaabni kun waa'ee maalii dubbata?"
        : "What is this book about?",

      language === "አማርኛ"
        ? "ምን ዓይነት እትሞች አሉ?"
        : language === "Afaan Oromoo"
        ? "Gosoonni kitaabaa maal fa'i?"
        : "What editions are available?",

      language === "አማርኛ"
        ? "እንዴት ማዘዝ እችላለሁ?"
        : language === "Afaan Oromoo"
        ? "Akkamittan ajajuu danda'a?"
        : "How can I order?",
    ].map((question, index) => (
      <button
        key={question}
        type="button"
        onClick={() => askSuggestedQuestion(question)}
        style={{
          padding: "10px 12px",
          textAlign: "left",
         background: "linear-gradient(135deg, #211b12, #100e0a)",
color: "#e8c783",
border: "1px solid #bd9145",
boxShadow: "0 3px 12px #0008",
          borderRadius: "8px",
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        {[<BookOpen size={16} />, <Library size={16} />, <ShoppingBag size={16} />][index]}{" "}
        {question}
      </button>
    ))}
  </div>
)}
            {loading && (
              <div style={{ color: "#806a45", fontSize: "13px" }}>
              {language === "አማርኛ"
  ? "ረዳቱ እያሰበ ነው..."
  : language === "Afaan Oromoo"
  ? "Gargaaraan yaadaa jira..."
  : "Assistant is thinking..."}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

        <form
  onSubmit={sendMessage}
  style={{
    display: "flex",
    gap: "8px",
    padding: "14px",
    borderTop: "1px solid #8b6b36",
    background: "#090806",
  }}
>
        <div
  style={{
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    gap: "8px",
    padding: "0 10px",
    background: "#17140f",
    border: "1px solid #bd9145",
    borderRadius: "8px",
  }}
>
  <MessageCircle size={18} color="#d9ad5c" />

  <input
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder={
      language === "አማርኛ"
        ? "ስለ መጽሐፋችን ይጠይቁ..."
        : language === "Afaan Oromoo"
        ? "Waa'ee kitaaba keenyaa gaafadhu..."
        : "Ask about our book..."
    }
    maxLength={2000}
    style={{
      flex: 1,
      minWidth: 0,
      padding: "12px 0",
      color: "#f5eddf",
      background: "transparent",
      WebkitTextFillColor: "#f5eddf",
      border: "none",
      outline: "none",
      fontSize: "14px",
    }}
  />
</div>
            <button
              type="submit"
              disabled={loading || !message.trim()}
             style={{
  padding: "0 18px",
  border: "1px solid #d9ad5c",
  borderRadius: "8px",
  background: "linear-gradient(135deg, #d9ad5c, #a77a32)",
  color: "#090806",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 3px 12px #d9ad5c33",
}}
            >
              <Send size={17} />
              {language === "አማርኛ"
  ? "ላክ"
  : language === "Afaan Oromoo"
  ? "Ergi"
  : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}