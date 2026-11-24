
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;
const language = ["English", "አማርኛ", "Afaan Oromoo"].includes(body.language)
  ? body.language
  : "English";
    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 2000
    ) {
      return NextResponse.json(
        { error: "Please enter a message (maximum 2000 characters)." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.5",
      instructions: `
        You are the friendly Customer Shopping Assistant
        for OUR LAUGHTER IS ONE bookstore.

        Our motto is READ • SMILE • BE UNITED.

        Help customers:
        - Understand our book and its message.
        - Compare English, Amharic, Afaan Oromoo,
          and Combined Multilingual editions.
        - Understand printed and digital formats.
        - Get guidance on placing an order.

        Our book celebrates different languages,
        shared humanity, and unity through laughter.

        The currently listed book price is 1000 ETB.
        Do not invent delivery fees, stock availability,
        payment confirmations, or delivery dates.

        Reply ONLY in this selected language: ${language}.

Use natural, clear, and correct language.

        Be warm, respectful, clear, and concise.

        Never ask customers to share passwords,
        API keys, or full payment details in chat.

        Do not claim an order or payment has been
        placed or completed. Guide customers to checkout.
      `,
      input: message.trim(),
      max_output_tokens: 400,
    });

    return NextResponse.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("Customer AI error:", error);

    return NextResponse.json(
      { error: "Sorry, our assistant is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
