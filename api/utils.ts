import { GoogleGenAI } from "@google/genai";

export async function generateCoverLetter(jobTitle: string, jobDescription: string, resumeText: string) {
  const ai = new GoogleGenAI({});

  const result = await ai.models.generateContent({
    model: "gemma-3-12b-it",
    contents: `Write a cover letter for a ${jobTitle} position. Use ONLY plain text - no markdown, asterisks, bullets, or formatting.

FORMAT (follow exactly):
Hiring Manager
[Company name only if in job description, else skip this line]
[City, State only if in job description, else skip this line]
${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}

Dear Hiring Manager,

[Body paragraphs - see rules below]

Sincerely,
[Full name]

BODY PARAGRAPH RULES:
1. First paragraph: Open with 1-2 sentences expressing genuine interest in the role and company, then transition naturally into your most relevant technical background. Be warm but professional.
2. Middle paragraphs (2-3): Each focuses on one employer and one core problem solved, ordered by relevance to job
3. Write in active voice about what you built, not what the role "involved" or "required"
4. Cover ALL roles from resume that relate to the job
5. Show different work contexts (enterprise/startup, regulated/fast-paced, scale differences)
6. Each paragraph leads with impact, then explains technical approach
7. Final paragraph: Express interest in discussing the role further and thank them for their consideration

AVOID THESE PHRASES:
- "This involved", "This required", "This demonstrated", "This experience provided"
- "My experience at X focused on" - just state what you did
- Long tech stack lists - weave in 2-3 relevant technologies per paragraph naturally
- Generic enthusiasm like "as advertised" or overly formal language

OPENING STYLE:
- Express genuine interest in the role/company first
- Transition naturally to relevant background: "With [X years/background], I've..."
- Should feel conversational and warm, not transactional

WRITING STYLE:
- Write like you're explaining your work to a peer, not selling yourself
- Lead each paragraph with impact, then how you achieved it
- 250-300 words total
- Each role shows different capability relevant to the job
- Never invent details not in resume
- Never use placeholders or brackets in output

Resume:
${resumeText}

Job description:
${jobDescription}

Output the complete cover letter now:`
  });
  return result.text;
}
