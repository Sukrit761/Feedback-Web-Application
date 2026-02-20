import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    /* ================= AUTH ================= */
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const parsedUser = JSON.parse(userCookie.value);

    /* ================= CONNECT DB ================= */
    await dbConnect();

    const dbUser = await UserModel.findById(parsedUser.id);

    if (!dbUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    /* ================= INPUT ================= */
    const { type, content } = await req.json();
    const lowerType = type?.toLowerCase() || "general";

    const normalizedType =
      lowerType === "essay"
        ? "essay"
        : lowerType === "grammar" || lowerType === "grammarcheck"
        ? "grammar"
        : lowerType === "resume"
        ? "resume"
        : lowerType === "code"
        ? "code"
        : "general";

    let prompt = "";

    /* ================= PROMPTS ================= */

    if (normalizedType === "essay") {
      prompt = `
You must ONLY reply with valid JSON.

{
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "score": 0
}

Analyze and improve this essay:

${content}
`;
    } else if (normalizedType === "code") {
      prompt = `
You must ONLY reply with valid JSON.

{
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "correctedCode": "",
  "timeComplexity": "",
  "spaceComplexity": "",
  "score": 0
}

Review this code:

${content}
`;
    } else if (normalizedType === "resume") {
      prompt = `
You must ONLY reply with valid JSON.

{
  "summary": "",
  "skillsFound": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "atsScore": 0,
  "formattingIssues": [],
  "recommendations": [],
  "score": 0
}

Analyze this resume:

${content}
`;
    } else {
      prompt = `
You must ONLY reply with valid JSON.

{
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "score": 0
}

Analyze this content:

${content}
`;
    }

    /* ================= AI ================= */
    const result = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    });

    const raw = result.text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return Response.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    const aiData = JSON.parse(jsonMatch[0]);

    /* ================= SAVE TO DB ================= */
    dbUser.messages.push({
      content: content?.trim() || "[Input submitted]",
      type: normalizedType,
      aiResponse: aiData,
      createdAt: new Date(),
    });

    await dbUser.save();

    return Response.json(aiData);

  } catch (error) {
    console.error("AI Route Error:", error);
    return Response.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
