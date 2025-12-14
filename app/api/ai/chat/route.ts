import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
  try {
    /* ================= CONNECT DB ================= */
    await dbConnect();

    /* ================= AUTH ================= */
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: token.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    /* ================= INPUT ================= */
    const { type, content } = await req.json();
    const lowerType = type?.toLowerCase() || "general";

    /**
     * ✅ NORMALIZED TYPE (ONE SOURCE OF TRUTH)
     */
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

    // 📝 ESSAY
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

        Analyze and improve this essay for structure, clarity, grammar and quality:

        ${content}
      `;
    }


    // 💻 CODE
    else if (normalizedType === "code") {
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

        Review and optimize this code:

        ${content}
      `;
    }

    // 📄 RESUME
    else if (normalizedType === "resume") {
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
    }

    // 📌 GENERAL
    else {
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
      console.error("AI Output:", raw);
      return Response.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    const aiData = JSON.parse(jsonMatch[0]);

    /* ================= SAVE ================= */
    user.messages.push({
      content: content?.trim() || "[Input submitted]",
      type: normalizedType, // ⭐ ESSAY IS NOW SAVED CORRECTLY
      aiResponse: aiData,
      createdAt: new Date(),
    });

    await user.save();

    return Response.json(aiData);
  } catch (error) {
    console.error("AI Route Error:", error);
    return Response.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
