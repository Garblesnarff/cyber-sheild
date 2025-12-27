import { GoogleGenAI, Type } from "@google/genai";
import { SecurityAlert, VulnerabilityResult } from '../types';

// Use gemini-3-pro-preview for complex reasoning tasks as per guidance
const MODEL_NAME = 'gemini-3-pro-preview';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a Senior Security Engineer analyzing vulnerability alerts against user dependency files.

TASK:
1. Extract the affected software/library from the ALERT
2. Extract the affected version range from the ALERT
3. Search the DEPENDENCY FILE for that library (account for naming variations)
4. If found, compare versions strictly
5. Return JSON only

RULES:
- If library NOT in file, return {"vulnerable": false, "reason": "Package not in dependencies"}
- Account for naming variations (e.g., "Apache Log4j2" = "log4j-core")
- Version comparison: "4.17.1" < "4.17.2", "^4.17.1" means ">=4.17.1 <5.0.0"
- When uncertain, set confidence to "low" and explain in reason
- Never hallucinate packages that aren't in the dependency file
`;

export const analyzeVulnerability = async (
  alert: SecurityAlert,
  dependencyFileContent: string,
  fileType: string
): Promise<VulnerabilityResult> => {

  const prompt = `
--- SECURITY ALERT ---
Source: ${alert.source}
Title: ${alert.title}
Published: ${alert.date}
CVE: ${alert.cveId || 'N/A'}
Description: ${alert.description}
Link: ${alert.link}

--- USER DEPENDENCY FILE (${fileType}) ---
${dependencyFileContent}

Analyze if any dependency is vulnerable. Return JSON only.
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vulnerable: { type: Type.BOOLEAN },
            confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
            package_name: { type: Type.STRING, nullable: true },
            current_version: { type: Type.STRING, nullable: true },
            patched_version: { type: Type.STRING, nullable: true },
            severity: { type: Type.STRING, enum: ["critical", "high", "medium", "low"], nullable: true },
            reason: { type: Type.STRING },
          },
          required: ["vulnerable", "confidence", "reason"],
        }
      },
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as VulnerabilityResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Return a safe fallback
    return {
      vulnerable: false,
      confidence: "low" as any,
      package_name: null,
      current_version: null,
      patched_version: null,
      severity: null,
      reason: "Analysis failed due to API error"
    };
  }
};
