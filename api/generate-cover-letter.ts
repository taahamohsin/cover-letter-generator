import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateCoverLetter } from "./utils.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobTitle, jobDescription, resumeText } = req.body;

  try {

    if (!jobTitle || !jobDescription || !resumeText) {
      throw new Error("Missing required fields");
    }

    const result = await generateCoverLetter(
      jobTitle,
      jobDescription,
      resumeText
    );

    return res.status(200).json(result);
  } catch (err: any) {
    console.error(err);

    if (
      err?.status === 429 ||
      err?.code === 429 ||
      err?.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    }

    return res.status(500).json({ error: "Failed to generate cover letter" });
  }
}
