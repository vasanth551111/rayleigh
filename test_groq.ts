import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an AI." },
        { role: "user", content: "test" }
      ],
    });
    console.log("Success:", completion.choices[0]?.message?.content);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
