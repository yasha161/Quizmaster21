import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import crypto from "crypto";

import {
  saveQuestions,
  getUserAttemptedQuestionIds,
  saveAttempt,
  getUserAttempts,
  queryMatchingQuestions,
  getAllQuestions,
  DbQuestion,
  DbSubject,
  DbQuiz,
  getSubjects,
  saveSubject,
  renameSubject,
  deleteSubject,
  getQuizzes,
  saveQuiz,
  updateQuiz,
  deleteQuiz,
  splitExplanation,
  saveJob,
  getJob
} from "./server-db";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" })); // allow large HTML file uploads
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: any = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini AI Client successfully configured with search grounding capabilities.");
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found in process.env. Quizzes will use smart contextual fallback pool.");
}

// Admin credentials checked statically or via local db


// Helper to shuffle options inside a DbQuestion and recalculate correctOptionIndex dynamically
function shuffleQuestionOptions(q: DbQuestion): DbQuestion {
  const originalCorrectOptionText = q.options[q.correctOptionIndex];
  const shuffledOptions = [...q.options];
  
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledOptions[i];
    shuffledOptions[i] = shuffledOptions[j];
    shuffledOptions[j] = temp;
  }
  
  const newIndex = shuffledOptions.indexOf(originalCorrectOptionText);
  return {
    ...q,
    options: shuffledOptions,
    correctOptionIndex: newIndex !== -1 ? newIndex : q.correctOptionIndex
  };
}

// REST Endpoint to fetch DB statistics
app.get("/api/db-stats", async (req, res) => {
  try {
    const all = await getAllQuestions();
    const countByDifficulty = {
      Easy: all.filter((q) => q.difficulty === "Easy").length,
      Medium: all.filter((q) => q.difficulty === "Medium").length,
      Hard: all.filter((q) => q.difficulty === "Hard").length,
    };
    const countBySubject = all.reduce((acc: Record<string, number>, q) => {
      acc[q.subject] = (acc[q.subject] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalQuestions: all.length,
      difficultyBreakdown: countByDifficulty,
      subjectBreakdown: countBySubject,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed fetching schema statistics." });
  }
});

// --- ADMIN PORTAL API ENDPOINTS ---

// Admin login using static secure local admin checks
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === "admin@quizgenius.com" && password === "admin123") {
      res.json({ status: "success", uid: "admin_uid_static" });
    } else {
      throw new Error("Invalid admin email or password.");
    }
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Invalid admin credentials." });
  }
});

// Get admin dashboard stats
app.get("/api/admin/stats", async (req, res) => {
  try {
    const subjects = await getSubjects();
    const quizzes = await getQuizzes();
    const questionsPool = await getAllQuestions();
    
    const totalQuizQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);
    
    const recentUploads = [...quizzes]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(q => ({
        id: q.id,
        name: q.name,
        subject: subjects.find(s => s.id === q.subjectId)?.name || "Unknown",
        questionsCount: q.questions?.length || 0,
        createdAt: q.createdAt,
        published: q.published
      }));

    res.json({
      totalSubjects: subjects.length,
      totalQuizzes: quizzes.length,
      totalQuestions: questionsPool.length + totalQuizQuestions,
      recentUploads
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed fetching admin stats." });
  }
});

// Get all subjects
app.get("/api/admin/subjects", async (req, res) => {
  try {
    const subjects = await getSubjects();
    res.json({ subjects });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed reading subjects catalog." });
  }
});

// Create subject
app.post("/api/admin/subjects", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing required property 'name'." });
  try {
    const created = await saveSubject(name);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed saving new subject." });
  }
});

// Rename subject
app.put("/api/admin/subjects/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updated = await renameSubject(id, name);
    if (!updated) return res.status(404).json({ error: "Subject not found." });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed renaming subject." });
  }
});

// Delete subject
app.delete("/api/admin/subjects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteSubject(id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed deleting subject." });
  }
});

// Get all quizzes
app.get("/api/admin/quizzes", async (req, res) => {
  try {
    const quizzes = await getQuizzes();
    res.json({ quizzes });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed fetching quizzes list." });
  }
});

// Create quiz
app.post("/api/admin/quizzes", async (req, res) => {
  const { subjectId, name, difficulty = "Medium", published = true, questions = [] } = req.body;
  if (!subjectId || !name) {
    return res.status(400).json({ error: "Missing required properties on quiz save." });
  }
  try {
    const quiz = await saveQuiz({ subjectId, name, difficulty, published, questions });
    res.json(quiz);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed publishing quiz." });
  }
});

// Edit quiz
app.put("/api/admin/quizzes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await updateQuiz(id, req.body);
    if (!updated) return res.status(404).json({ error: "Quiz not found." });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed saving quiz updates." });
  }
});

// Delete quiz
app.delete("/api/admin/quizzes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteQuiz(id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed deleting quiz." });
  }
});


// High-performance line-by-line MCQ parser from HTML/text
function nativeParseMCQs(html: string, subjectName: string) {
  const textContent = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<tr>/gi, "\n")
    .replace(/<td>/gi, " ")
    .replace(/<\/td>/gi, " ")
    .replace(/&nbsp;/gi, " ");

  const lines = textContent
    .replace(/<[^>]*>/g, "")
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const questions: any[] = [];
  let currentQ: any = null;
  let options: string[] = [];
  let currentCorrect = -1;
  let explanationLines: string[] = [];
  let totalFoundRaw = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const qMatch = line.match(/^\s*(?:Q(?:uestion)?\.?\s*)?\[?(\d+)\]?[\.\)\s:-]+\s*(.*)/i);
    const isOptionLine = line.match(/^\s*[\(\[]?[A-D][\.\)\s\]:-]+/i);

    if (qMatch && !isOptionLine) {
      if (currentQ && options.length >= 2) {
        while (options.length < 4) {
          options.push(`Alternative Option ${String.fromCharCode(65 + options.length)}`);
        }
        currentQ.options = options.slice(0, 4);
        currentQ.correctOptionIndex = currentCorrect >= 0 && currentCorrect < 4 ? currentCorrect : 0;
        currentQ.explanation = explanationLines.join("\n").trim();
        questions.push(currentQ);
      }

      totalFoundRaw++;
      currentQ = {
        question: qMatch[2] || "",
        options: [],
        correctOptionIndex: 0,
        explanation: "",
        subject: subjectName,
        topic: "Core Topic",
        difficulty: "Medium",
        importance: "high",
        createdAt: new Date().toISOString()
      };
      options = [];
      currentCorrect = -1;
      explanationLines = [];
      continue;
    }

    if (!currentQ) continue;

    const inlineMatches = [...line.matchAll(/(?:\(|\[)?([A-D])[\.\)\s\]:-]+\s*([^\(\[A-D]+)/gi)];
    const singleMatch = line.match(/^\s*[\(\[]?([A-D])[\.\)\s\]:-]+\s*(.*)/i);

    if (inlineMatches.length > 1) {
      inlineMatches.forEach(m => {
        const letter = m[1].toUpperCase();
        const text = m[2].trim();
        const idx = letter.charCodeAt(0) - 65;
        options[idx] = text;
      });
    } else if (singleMatch) {
      const letter = singleMatch[1].toUpperCase();
      const text = singleMatch[2].trim();
      const idx = letter.charCodeAt(0) - 65;
      options[idx] = text;
    } else {
      const ansMatch = line.match(/(?:Ans(?:wer)?|Correct(?:\s*Answer)?|Option|Key|Sol|उत्तर)\s*[:\-\s]+([A-D]|[1-4])/i);
      if (ansMatch) {
        const val = ansMatch[1].toUpperCase();
        if (["A", "B", "C", "D"].includes(val)) {
          currentCorrect = val.charCodeAt(0) - 65;
        } else if (["1", "2", "3", "4"].includes(val)) {
          currentCorrect = parseInt(val) - 1;
        }
        const afterVal = line.substring(line.indexOf(ansMatch[1]) + 1).trim();
        if (afterVal.length > 5) {
          explanationLines.push(afterVal);
        }
      } else {
        if (options.length === 0) {
          currentQ.question += " " + line;
        } else {
          explanationLines.push(line);
        }
      }
    }
  }

  if (currentQ && options.length >= 2) {
    while (options.length < 4) {
      options.push(`Alternative Option ${String.fromCharCode(65 + options.length)}`);
    }
    currentQ.options = options.slice(0, 4);
    currentQ.correctOptionIndex = currentCorrect >= 0 && currentCorrect < 4 ? currentCorrect : 0;
    currentQ.explanation = explanationLines.join("\n").trim();
    questions.push(currentQ);
  }

  return { totalFoundRaw, questions };
}

function cleanHTMLContent(html: string): string {
  // Remove CSS style tags
  let cleaned = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  
  // Remove JS script tags
  cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  
  // Remove Head / Meta / Link tags
  cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");
  cleaned = cleaned.replace(/<link[^>]*>/gi, "");
  cleaned = cleaned.replace(/<meta[^>]*>/gi, "");
  
  // Remove standard UI/Layout wrappers but keep their text content if relevant, or remove them entirely if they are navigation, footers, headers
  cleaned = cleaned.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");
  cleaned = cleaned.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");
  cleaned = cleaned.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "");
  cleaned = cleaned.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "");
  cleaned = cleaned.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "");
  cleaned = cleaned.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");
  
  return cleaned;
}

// Ensure every parsed or generated question has a high-quality bilingual explanation
async function ensureAllQuestionsHaveExplanations(questions: any[], subjectContext: string): Promise<any[]> {
  if (!ai || questions.length === 0) {
    // Local fallback if Gemini client is not initialized or questions are empty
    return questions.map(q => {
      const isGeneric = !q.explanation || 
                        q.explanation.includes("Concept explanation for") || 
                        q.explanation.includes("sankalpnaatmak") || 
                        q.explanation.trim().length === 0;
      if (isGeneric) {
        const correctText = Array.isArray(q.options) ? (q.options[q.correctOptionIndex] || "") : "";
        const englishExp = `Regarding the question about "${q.question.slice(0, 60)}...", the correct option is "${correctText}" which aligns with key concepts in ${subjectContext}.`;
        const hindiExp = `"${q.question.slice(0, 60)}..." के बारे में प्रश्न का सही उत्तर "${correctText}" है जो ${subjectContext} के महत्वपूर्ण सिद्धांतों के अनुरूप है।`;
        
        q.explanation = `💡 Explanation:\nEnglish:\n${englishExp}\n\nHindi:\n${hindiExp}`;
      }
      return q;
    });
  }

  const polishedQuestions: any[] = [];
  const batchSize = 15;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    try {
      console.log(`[Explanation Gen] Polishing batch ${Math.floor(i / batchSize) + 1} of size ${batch.length}...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert academic curriculum writer and competitive exam compiler.
For the following multiple-choice questions belonging to the subject/context: "${subjectContext}", refine or generate their explanations.

CRITICAL EXPLANATION RULES:
1. For every question, the explanation must be generated from:
   - The question text
   - The correct answer (options[correctOptionIndex])
   - The subject context ("${subjectContext}")
2. DO NOT use generic sentences, the quiz title, or the subject name only. Explain specifically why the correct answer is correct and add useful exam context.
3. Keep the explanation length between 2 to 4 lines only.
4. If an explanation is already present in the question and is detailed/accurate, refine it to match the required format. If it is missing, blank, generic, or mentions "sankalpnaatmak", generate a completely new high-quality educational explanation using your knowledge.
5. STRICTLY format each explanation in the exact format shown below (with "💡 Explanation:", "English:", and "Hindi:" on their own lines, separated by newlines):

💡 Explanation:
English:
[Clear, accurate English explanation of 2-4 lines]

Hindi:
[Simple, clean Hindi explanation of 2-4 lines in Devanagari script]

Questions to process:
${JSON.stringify(batch.map(q => ({
  question: q.question,
  options: q.options,
  correctOptionIndex: q.correctOptionIndex,
  explanation: q.explanation || ""
})), null, 2)}

Return strictly a JSON array matching this schema:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctOptionIndex": number,
    "explanation": "string"
  }
]`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const parsedPolished = JSON.parse(response.text);
      if (Array.isArray(parsedPolished)) {
        parsedPolished.forEach((pq, idx) => {
          const original = batch[idx];
          if (original) {
            polishedQuestions.push({
              ...original,
              question: pq.question || original.question,
              options: pq.options || original.options,
              correctOptionIndex: pq.correctOptionIndex !== undefined ? pq.correctOptionIndex : original.correctOptionIndex,
              explanation: pq.explanation || original.explanation
            });
          }
        });
      } else {
        throw new Error("Response was not an array.");
      }
    } catch (err: any) {
      console.error(`[Explanation Gen] Failed to polish batch ${Math.floor(i / batchSize) + 1}:`, err);
      // Fallback for this batch
      batch.forEach(q => {
        const isGeneric = !q.explanation || 
                          q.explanation.includes("Concept explanation for") || 
                          q.explanation.includes("sankalpnaatmak") || 
                          q.explanation.trim().length === 0;
        if (isGeneric) {
          const correctText = Array.isArray(q.options) ? (q.options[q.correctOptionIndex] || "") : "";
          const englishExp = `Regarding the question about "${q.question.slice(0, 60)}...", the correct answer is "${correctText}" which aligns with key concepts in ${subjectContext}.`;
          const hindiExp = `"${q.question.slice(0, 60)}..." के बारे में प्रश्न का सही उत्तर "${correctText}" है जो ${subjectContext} के महत्वपूर्ण सिद्धांतों के अनुरूप है।`;
          
          q.explanation = `💡 Explanation:\nEnglish:\n${englishExp}\n\nHindi:\n${hindiExp}`;
        }
        polishedQuestions.push(q);
      });
    }
  }

  return polishedQuestions;
}

// Background extraction routine
async function runExtractionJob(jobId: string, fileContent: string, selectedSubject: string, isJson: boolean, isPdf: boolean = false) {
  try {
    let internalQuestions: any[] = [];
    let totalFound = 0;

    if (isPdf) {
      console.log(`[Background Parser] Gemini PDF parsing for job: ${jobId}`);
      if (!ai) {
        throw new Error("Gemini AI client is not configured. PDF processing requires GEMINI_API_KEY.");
      }

      const pdfPart = {
        inlineData: {
          mimeType: "application/pdf",
          data: fileContent // Base64 encoded PDF
        }
      };

      const systemPrompt = `You are an elite academic curriculum editor and multiple-choice question (MCQ) extraction system.
Your task is to analyze the entire attached PDF document and extract all relevant questions.

CRITICAL INSTRUCTIONS FOR EXTRACTING, FILTERING, AND SHUFFLING:
1. Target Subject: "${selectedSubject}". Only extract questions related to this subject/exam. Filter out and completely discard questions from other subjects or any irrelevant text, headers, footers, page numbers, or advertisements.
2. Deduplication: Remove duplicate questions.
3. Rigor and Quality: Rewrite questions into a clean, highly professional competitive exam format (like UPSC, SSC, RAS, Banking, Railway, General Knowledge, etc.). Improve grammar, sentence structure, spelling mistakes, broken text (due to PDF extraction), and poorly written phrases without changing the original question's core meaning.
4. Shuffling & Randomization:
   - For every question, shuffle the order of the answer options.
   - Ensure the correct option is placed randomly. Avoid placing all correct answers on the same option letter (e.g., all 'A' or 'B'). Balance correct option indices evenly between A, B, C, and D (indices 0, 1, 2, 3).
5. Formatting:
   - Each extracted question must have exactly 4 options.
   - Provide a professional, detailed explanation. First paragraph must be in clean, expert English. Below it, on a new line, provide a clear Hindi translation of the explanation in Devanagari script.
   - Detect and set appropriate difficulty level ("Easy", "Medium", "Hard") for each question.
   - Detect and set an appropriate micro-topic name.

Extract ALL relevant questions present in the PDF. Please be extremely thorough and do not stop after a few questions.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "The processed question text." },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 options, shuffled and randomized."
                },
                correctOptionIndex: { type: Type.INTEGER, description: "0-indexed index of the correct option." },
                explanation: { type: Type.STRING, description: "Explanation text. English paragraph first, followed by Hindi translation." },
                difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard." },
                topic: { type: Type.STRING, description: "The specific topic or category name." }
              },
              required: ["question", "options", "correctOptionIndex", "explanation", "difficulty", "topic"]
            }
          }
        },
        required: ["questions"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          pdfPart,
          { text: `Analyze the entire PDF, extract and filter all questions related to "${selectedSubject}" in accordance with the system instructions.` }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.2
        }
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.questions)) {
        internalQuestions = parsed.questions.map((q: any) => ({
          question: q.question || "",
          options: Array.isArray(q.options) ? q.options.map(String) : [],
          answer: Array.isArray(q.options) && q.correctOptionIndex !== undefined ? q.options[q.correctOptionIndex] : "",
          explanation: q.explanation || "",
          subject: selectedSubject,
          difficulty: q.difficulty || "Medium",
          topic: q.topic || "Core Topic"
        }));
        totalFound = internalQuestions.length;
      } else {
        throw new Error("Failed to extract structured questions from PDF.");
      }
    } else if (isJson) {
      console.log(`[Background Parser] Direct JSON parsing for job: ${jobId}`);
      let parsedJSON: any;
      try {
        parsedJSON = JSON.parse(fileContent);
      } catch (err: any) {
        throw new Error("Invalid JSON format: " + err.message);
      }

      let questionsArray: any[] = [];
      if (Array.isArray(parsedJSON)) {
        questionsArray = parsedJSON;
      } else if (parsedJSON && typeof parsedJSON === "object" && Array.isArray(parsedJSON.questions)) {
        questionsArray = parsedJSON.questions;
      } else {
        throw new Error("JSON file must contain an array of questions or a quiz object with a 'questions' array.");
      }

      totalFound = questionsArray.length;

      // Map to internal format: { question, options, answer, explanation, subject, difficulty }
      internalQuestions = questionsArray.map((q: any) => {
        let ansVal = "";
        if (q.answer !== undefined) {
          ansVal = String(q.answer);
        } else if (q.correctOptionIndex !== undefined) {
          const idx = Number(q.correctOptionIndex);
          if (Array.isArray(q.options) && idx >= 0 && idx < q.options.length) {
            ansVal = q.options[idx];
          } else {
            ansVal = String(idx);
          }
        }

        return {
          question: q.question || "",
          options: Array.isArray(q.options) ? q.options.map(String) : [],
          answer: ansVal,
          explanation: q.explanation || "",
          subject: q.subject || selectedSubject,
          difficulty: q.difficulty || "Medium"
        };
      });
    } else {
      // It is an HTML file
      console.log(`[Background Parser] HTML parsing for job: ${jobId}`);
      
      // Clean HTML Content first
      const cleanedHtml = cleanHTMLContent(fileContent);

      // Extract raw questions
      const parsed = nativeParseMCQs(cleanedHtml, selectedSubject);
      totalFound = parsed.totalFoundRaw;

      // Convert extracted data into internal JSON format
      internalQuestions = parsed.questions.map((q: any) => {
        let ansVal = "";
        if (Array.isArray(q.options) && q.correctOptionIndex !== undefined) {
          const idx = Number(q.correctOptionIndex);
          if (idx >= 0 && idx < q.options.length) {
            ansVal = q.options[idx];
          }
        }
        return {
          question: q.question || "",
          options: q.options || [],
          answer: ansVal,
          explanation: q.explanation || "",
          subject: q.subject || selectedSubject,
          difficulty: q.difficulty || "Medium"
        };
      });
    }

    // Convert internal JSON format to DbQuestion shape and remove duplicates
    const finalDbQuestions: any[] = [];
    const seenHashes = new Set<string>();

    for (const q of internalQuestions) {
      if (!q.question || typeof q.question !== "string" || q.question.trim().length === 0) continue;
      const norm = q.question.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (seenHashes.has(norm)) continue;
      seenHashes.add(norm);

      // Determine correctOptionIndex from q.answer and options
      let correctOptionIndex = 0;
      if (Array.isArray(q.options) && q.options.length > 0) {
        if (q.answer !== undefined) {
          const ans = String(q.answer).trim();
          if (["0", "1", "2", "3"].includes(ans)) {
            correctOptionIndex = parseInt(ans, 10);
          } else if (["A", "B", "C", "D"].includes(ans.toUpperCase())) {
            correctOptionIndex = ans.toUpperCase().charCodeAt(0) - 65;
          } else {
            const optIdx = q.options.findIndex((o: string) => String(o).trim().toLowerCase() === ans.toLowerCase());
            if (optIdx !== -1) {
              correctOptionIndex = optIdx;
            }
          }
        }
      }

      // Ensure options has exactly 4 items
      const optionsArray = Array.isArray(q.options) ? [...q.options] : [];
      while (optionsArray.length < 4) {
        optionsArray.push(`Alternative Option ${String.fromCharCode(65 + optionsArray.length)}`);
      }
      const finalOptions = optionsArray.slice(0, 4);

      // Increase option randomness by shuffling options and updating correctOptionIndex dynamically
      const originalCorrectOptionText = finalOptions[correctOptionIndex] || finalOptions[0];
      const shuffledOptions = [...finalOptions];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffledOptions[i];
        shuffledOptions[i] = shuffledOptions[j];
        shuffledOptions[j] = temp;
      }
      const newCorrectOptionIndex = shuffledOptions.indexOf(originalCorrectOptionText);

      const qId = crypto.createHash("sha256").update(norm).digest("hex").slice(0, 16);

      finalDbQuestions.push({
        id: qId,
        subject: q.subject || selectedSubject,
        topic: q.topic || "Core Topic",
        question: q.question.trim(),
        options: shuffledOptions,
        correctOptionIndex: newCorrectOptionIndex !== -1 ? newCorrectOptionIndex : 0,
        explanation: q.explanation || "",
        difficulty: (q.difficulty || "Medium") as any,
        importance: "high",
        createdAt: new Date().toISOString()
      });
    }

    // Update progress locally
    await saveJob(jobId, {
      totalQuestions: totalFound,
      savedQuestions: finalDbQuestions.length
    });

    let filteredQuestions = finalDbQuestions;

    if (!isPdf) {
      // 3. Define filtering keywords based on selectedSubject via Gemini or fallback
      let includeKeywords: string[] = [];
      let excludeKeywords: string[] = [];

      if (ai) {
        try {
          console.log(`[Background Parser] Requesting Gemini filtering rules for subject: "${selectedSubject}"`);
          const rulesResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Analyze this exam/subject name: "${selectedSubject}".
Provide a list of 25-30 highly relevant keywords, core terms, topics, or concepts that must be found in questions belonging to "${selectedSubject}".
Provide a list of 10-15 completely irrelevant exam subjects or topics that must be excluded.
Return strictly a JSON object matching this schema:
{
  "includeKeywords": ["string", ...],
  "excludeKeywords": ["string", ...]
}`,
            config: {
              responseMimeType: "application/json",
              temperature: 0.1
            }
          });
          const rules = JSON.parse(rulesResponse.text);
          includeKeywords = rules.includeKeywords || [];
          excludeKeywords = rules.excludeKeywords || [];
        } catch (err: any) {
          console.error("[Background Parser] Failed to fetch dynamic rules from Gemini:", err);
          // Error handling: log warning locally, continue gracefully using fallback keywords!
          await saveJob(jobId, {
            lastWarning: `Gemini API failed to generate filtering keywords. Using offline fallbacks. Error: ${err.message}`
          });
        }
      }

      if (includeKeywords.length === 0) {
        const fallbacks: Record<string, { include: string[], exclude: string[] }> = {
          "UPSC": {
            include: ["constitution", "polity", "parliament", "history", "geography", "economics", "current affairs", "fundamental rights", "president", "gandhi", "harappan", "mughal", "treaty", "climate", "biodiversity", "act"],
            exclude: ["jee", "neet", "physics", "chemistry", "biology", "calculus", "vector", "banking interest", "coding", "software"]
          },
          "SSC CGL": {
            include: ["aptitude", "percentage", "profit", "loss", "interest", "algebra", "geometry", "trigonometry", "ratio", "reasoning", "english", "grammar", "synonym", "antonym", "comprehension", "gk", "history", "polity"],
            exclude: ["medical", "organic chemistry", "botany", "zoology", "law of motion", "integrals", "upsc mains"]
          },
          "Banking": {
            include: ["interest", "compound", "simple", "profit", "loss", "percentage", "ratio", "proportion", "banking", "monetary", "inflation", "rbi", "syllogism", "data interpretation", "english", "grammar"],
            exclude: ["physics", "chemistry", "biology", "geology", "harappan", "gandhian era", "calculus", "thermodynamics"]
          },
          "Railway": {
            include: ["general science", "physics", "chemistry", "biology", "history", "geography", "polity", "gk", "aptitude", "train", "speed", "distance", "time", "interest", "ratio"],
            exclude: ["neet", "organic chemistry", "botany", "advanced calculus", "foreign policy", "literary criticism"]
          },
          "JEE": {
            include: ["physics", "chemistry", "math", "mechanics", "electromagnetism", "thermodynamics", "optics", "organic", "inorganic", "physical chemistry", "calculus", "algebra", "vectors", "matrices", "probability"],
            exclude: ["history", "polity", "geography", "civics", "banking", "finance", "biological classification", "botany", "zoology"]
          },
          "NEET": {
            include: ["biology", "botany", "zoology", "physics", "chemistry", "human physiology", "genetics", "evolution", "ecology", "organic chemistry", "inorganic chemistry", "physical chemistry", "mechanics"],
            exclude: ["calculus", "matrices", "vectors", "probability", "history", "polity", "geography", "banking", "accounting"]
          },
          "General Knowledge": {
            include: ["gk", "history", "geography", "polity", "science", "sports", "awards", "books", "authors", "capitals", "currencies", "inventions", "discoveries"],
            exclude: ["highly advanced calculus", "coding", "software engineering", "complex quantum mechanics"]
          },
          "Current Affairs": {
            include: ["current affairs", "news", "recent", "awards", "sports", "government schemes", "summit", "conference", "appointment", "obituary", "index", "ranking"],
            exclude: ["ancient history", "prehistoric", "calculus", "organic chemistry"]
          }
        };

        const keys = Object.keys(fallbacks);
        const matchedKey = keys.find(k => selectedSubject.toLowerCase().includes(k.toLowerCase()));
        if (matchedKey) {
          includeKeywords = fallbacks[matchedKey].include;
          excludeKeywords = fallbacks[matchedKey].exclude;
        } else {
          includeKeywords = [selectedSubject.toLowerCase(), "exam", "question", "test", "gk", "concept", "aptitude"];
          excludeKeywords = ["promotional", "advertisement", "newsletter", "sign up", "login", "cookie"];
        }
      }

      // 4. Perform relevance filtering
      filteredQuestions = finalDbQuestions.filter(q => {
        const text = (q.question + " " + q.options.join(" ") + " " + (q.explanation || "")).toLowerCase();
        
        const hasExclude = excludeKeywords.some(kw => text.includes(kw.toLowerCase()));
        if (hasExclude) return false;

        if (includeKeywords.length > 0) {
          const score = includeKeywords.reduce((acc, kw) => acc + (text.includes(kw.toLowerCase()) ? 1 : 0), 0);
          return score >= 0;
        }
        return true;
      });

      if (filteredQuestions.length === 0) {
        filteredQuestions = finalDbQuestions;
      }
    }

    const relevantCount = filteredQuestions.length;
    let finalQuestionsList = await ensureAllQuestionsHaveExplanations(filteredQuestions, selectedSubject);

    // Mark job as completed
    await saveJob(jobId, {
      status: "completed",
      totalQuestions: totalFound,
      savedQuestions: relevantCount,
      questions: finalQuestionsList,
      detectedSubject: selectedSubject,
      detectedDifficulty: "Medium"
    });

    console.log(`[Background Parser] Extraction job ${jobId} successfully completed.`);

  } catch (err: any) {
    console.error(`[Background Parser] Extraction job ${jobId} failed:`, err);
    await saveJob(jobId, {
      status: "failed",
      errorMessage: err.message || "Failed to parse HTML/PDF quiz content."
    });
  }
}

// Auto-parse uploaded HTML/text/JSON/PDF quiz files via Background Processing Jobs
app.post("/api/admin/parse-quiz", async (req, res) => {
  const { htmlContent, fileContent, fileName, subjectName } = req.body;
  const content = fileContent || htmlContent;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Missing or invalid file content." });
  }

  const selectedSubject = subjectName || "General Knowledge";
  const name = fileName || "upload.html";
  const ext = name.split(".").pop()?.toLowerCase() || "";

  // 1. Detect file type
  const isPdf = ext === "pdf";
  const isJson = !isPdf && (ext === "json" || (content.trim().startsWith("{") || content.trim().startsWith("[")));
  const isHtml = !isPdf && !isJson && (ext === "html" || ext === "htm" || ext === "txt" || (content.toLowerCase().includes("<html") || content.toLowerCase().includes("<!doctype") || content.toLowerCase().includes("</")));

  if (!isJson && !isHtml && !isPdf) {
    return res.status(400).json({ error: "Unsupported file format. Please upload a PDF, HTML, HTM, TXT, or JSON file." });
  }

  const jobId = "job_" + crypto.randomUUID().slice(0, 8);

  try {
    // Strip Base64 prefix if present for PDF
    let cleanContent = content;
    if (isPdf && content.includes(";base64,")) {
      const parts = content.split(";base64,");
      if (parts.length > 1) {
        cleanContent = parts[1];
      }
    }

    // 1. Process local file parameters
    const fileExtension = isPdf ? "pdf" : (isJson ? "json" : "html");
    const downloadUrl = `local_file_${jobId}.${fileExtension}`;

    // 2. Create processing job locally
    console.log(`[Admin Flow] Creating local processing job: ${jobId}`);
    await saveJob(jobId, {
      jobId: jobId,
      fileName: `${selectedSubject.toLowerCase().replace(/\s+/g, "_")}_upload.${fileExtension}`,
      status: "processing",
      totalQuestions: 0,
      savedQuestions: 0,
      errorMessage: "",
      fileUrl: downloadUrl,
      createdAt: new Date().toISOString()
    });

    // 3. Extract questions in a non-blocking background task!
    runExtractionJob(jobId, cleanContent, selectedSubject, isJson, isPdf);

    // Return the jobId instantly so the website never freezes!
    res.json({
      success: true,
      jobId: jobId,
      status: "processing"
    });

  } catch (err: any) {
    console.error("[Admin Flow] Parse upload initiation failed:", err);
    res.status(500).json({ error: err.message || "Failed to initialize extraction job." });
  }
});

// GET processing job status
app.get("/api/admin/jobs/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: "Processing job not found." });
    }
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed checking job status." });
  }
});


// REST Endpoint to search & generate customized quizzes on any custom topic
app.post("/api/generate-quiz", async (req, res) => {
  const { topic, difficulty = "Medium", count = 5, userId = "anonymous-user" } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Missing required 'topic' property." });
  }

  const requestedCount = Math.max(1, Math.min(20, Number(count)));

  try {
    // 1. Fetch questions this user has already attempted to prevent any repetition!
    const attemptedIds = await getUserAttemptedQuestionIds(userId);

    // 2. Fetch all matching unattempted questions presently in the DB pool
    const matchingPool = await queryMatchingQuestions(topic, difficulty, attemptedIds);

    console.log(
      `[QuizGenius] Query: "${topic}" | Diff: ${difficulty} | User: ${userId} | Stored Unattempted Match Pool: ${matchingPool.length} | Desired: ${requestedCount}`
    );

    let questionsToReturn: DbQuestion[] = [];
    let reuseCount = 0;

    // Use up to 50% reuse if we have a robust matching pool, else generate freshly
    if (matchingPool.length >= requestedCount) {
      reuseCount = Math.floor(requestedCount / 2);
    } else if (matchingPool.length > 0) {
      reuseCount = matchingPool.length;
    }

    if (reuseCount > 0) {
      const shuffledPool = [...matchingPool].sort(() => 0.5 - Math.random());
      questionsToReturn = shuffledPool.slice(0, reuseCount);
    }

    const needCount = requestedCount - questionsToReturn.length;

    // If we don't need to generate any new questions, return instantly!
    if (needCount === 0 || !ai) {
      console.log(`[QuizGenius] Instantly reusing ${questionsToReturn.length} questions from local db storage.`);
      
      if (needCount > 0) {
        const fallbackQuiz = generateLocalFallbackQuiz(topic, difficulty, needCount, Array.from(attemptedIds));
        const formattedFallbacks: DbQuestion[] = fallbackQuiz.questions.map((q, idx) => ({
          id: `fallback-${Date.now()}-${idx}`,
          subject: fallbackQuiz.subject,
          topic: topic,
          question: q.question,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
          difficulty: difficulty as any,
          importance: (idx % 3 === 0 ? "unexpected" : idx % 3 === 1 ? "conceptual" : "high") as any,
          createdAt: new Date().toISOString()
        }));
        
        const savedFallbacks = await saveQuestions(formattedFallbacks);
        questionsToReturn = [...questionsToReturn, ...savedFallbacks];
      }

      return res.json({
        title: `${topic} Assessment`,
        subject: questionsToReturn[0]?.subject || "Contextual Evaluation",
        questions: questionsToReturn.map(shuffleQuestionOptions),
        source: needCount === 0 ? "Database Cache (Instant)" : "Hybrid Database / Local Creator",
        searchGroundingUsed: false,
      });
    }

    // 4. Generate the remaining needed questions from Gemini with Search Grounding
    console.log(`[QuizGenius] Generating ${needCount} new questions via Gemini 3.5-flash with Google Search Grounding.`);
    
    const existingExcludeText = questionsToReturn.map((q) => q.question);
    
    const systemPrompt = `You are an expert academic curriculum writer, examiner, and textbook compiler. 
Your task is to search and generate exactly ${needCount} highly engaging, accurate multiple-choice questions on the topic/subject: "${topic}".
These questions MUST be formulated according to actual competitive exam patterns, past year question formats (PYQs), important books, syllabus guidelines, and core internal concepts.

CRITICAL INSTRUCTIONS FOR BALANCED ASSESSMENT:
1. Difficulty Target: ${difficulty}. Modify question rigor, depth, and option choices to strictly match this standard.
2. Mix important and unexpected conceptual questions:
   - "high" yield: standard high-frequency exam patterns or PYQ direct concepts.
   - "conceptual": tests deep understanding of internal mechanisms, books, or theories.
   - "unexpected": edge cases, unexpected logical deductions, or surprising conceptual anomalies.
3. Each question MUST have exactly 4 plausible options alternatives and exactly 1 correct answer (specified as correctOptionIndex, 0 to 3).
4. Provide a short, highly readable educational explanation. The explanation must specifically explain why the correct answer is correct and add useful exam context. DO NOT use generic sentences, the quiz title, or the subject name only.
5. STRICTLY format the explanation in the exact format shown below (with "💡 Explanation:", "English:", and "Hindi:" on their own lines, separated by newlines):

💡 Explanation:
English:
[Clear, accurate English explanation of 2-4 lines]

Hindi:
[Simple, clean Hindi explanation of 2-4 lines in Devanagari script]

6. Absolute Requirement for Uniqueness: Ensure you do NOT duplicate or generate anything similar to these already existing questions:
   ${existingExcludeText.length > 0 ? existingExcludeText.map((t, idx) => `${idx + 1}. "${t}"`).join("\n") : "None"}.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "High-level name of the generated quiz (e.g. UPSC CSE Polity quiz, NEET Genetics assessment)",
        },
        subject: {
          type: Type.STRING,
          description: "Overarching educational subject path (e.g. UPSC, NEET, JEE, RAS, General Knowledge, Code, History)",
        },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The main text of the question. Based on factual exam patterns, books, and unexpected conceptual angles.",
              },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "Four plausible, high-quality choices. Exactly 4 options.",
              },
              correctOptionIndex: {
                type: Type.INTEGER,
                description: "The index of the correct option inside the options array (0 to 3).",
              },
              explanation: {
                type: Type.STRING,
                description: "Short and clear. Must follow the exact '💡 Explanation:\nEnglish:\n...\nHindi:\n...' structure.",
              },
              importance: {
                type: Type.STRING,
                description: "The taxonomy category. Must be exactly one of: 'high', 'conceptual', 'unexpected'."
              }
            },
            required: ["question", "options", "correctOptionIndex", "explanation", "importance"],
          },
        },
      },
      required: ["title", "subject", "questions"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Search and generate a highly accurate, professional trivia/multiple-choice quiz about "${topic}" in ${difficulty} difficulty mode. Generate exactly ${needCount} questions.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    const quizText = response.text || "";
    const parsedData = JSON.parse(quizText);

    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error("Gemini AI response was malformed or lacked questions array.");
    }

    const mockDbQuestions = parsedData.questions.map((q: any) => ({
      subject: parsedData.subject || "General Prep",
      topic: topic,
      question: q.question,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      difficulty: difficulty as any,
      importance: (q.importance || "high") as any,
    }));

    const newlySavedQuestions = await saveQuestions(mockDbQuestions);
    const finalQuestions = [...questionsToReturn, ...newlySavedQuestions];
    const searchQueriesGrounded = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    res.json({
      title: parsedData.title || `${topic} Assessment`,
      subject: parsedData.subject || "General Knowledge",
      questions: finalQuestions.map(shuffleQuestionOptions),
      source: questionsToReturn.length > 0 ? "Hybrid AI + Stored Library" : "Gemini AI Live Search Grounded",
      searchGroundingUsed: searchQueriesGrounded.length > 0,
      groundedQueries: searchQueriesGrounded,
    });

  } catch (err: any) {
    console.error("Gemini AI API execution failed, recovering gracefully via fallback generator:", err);
    
    // In case of any transient failure (e.g. rate limit, content block), solve with fallback
    const attemptedIds = await getUserAttemptedQuestionIds(userId);
    const fallbackQuiz = generateLocalFallbackQuiz(topic, difficulty, count, Array.from(attemptedIds));
    
    const formattedFallbacks: DbQuestion[] = fallbackQuiz.questions.map((q, idx) => ({
      id: `fallback-${Date.now()}-${idx}`,
      subject: fallbackQuiz.subject,
      topic: topic,
      question: q.question,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      difficulty: difficulty as any,
      importance: (idx % 3 === 0 ? "unexpected" : idx % 3 === 1 ? "conceptual" : "high") as any,
      createdAt: new Date().toISOString()
    }));

    const saved = await saveQuestions(formattedFallbacks);

    res.json({
      title: fallbackQuiz.title,
      subject: fallbackQuiz.subject,
      questions: saved.map(shuffleQuestionOptions),
      source: "Offline Recovery Engine",
      searchGroundingUsed: false,
    });
  }
});

// REST Endpoint to store quiz attempt details
app.post("/api/save-attempt", async (req, res) => {
  const { userId, topic, subject, difficulty, score, totalQuestions, accuracy, timeSpent, questions, answers, quizId } = req.body;
  
  if (!userId || !topic) {
    return res.status(400).json({ error: "Missing required properties on attempt save." });
  }

  try {
    const saved = await saveAttempt({
      userId,
      topic,
      subject,
      difficulty,
      score,
      totalQuestions,
      accuracy,
      timeSpent,
      questions,
      answers,
      quizId
    });
    res.json({ status: "success", attempt: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed saving candidate attempt." });
  }
});

// REST Endpoint to fetch complete history for a specific userId
app.get("/api/history", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: "Missing required userId parameter." });
  }

  try {
    const attempts = await getUserAttempts(userId);
    res.json({ attempts });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed reading attempts logs." });
  }
});

// Symmetrical local fallback data structure
function generateLocalFallbackQuiz(topic: string, difficulty: string, count: number, attempted: string[]) {
  const normTopic = topic.trim().toUpperCase();
  
  let matchGroup = "Universal Knowledge";
  let quizTitle = `${topic} Exam Roadmap`;
  
  if (normTopic.includes("UPSC") || normTopic.includes("IAS") || normTopic.includes("POLITY")) {
    matchGroup = "UPSC Civil Services Preparation";
    quizTitle = "UPSC Indian Polity & Constitutional Law";
  } else if (normTopic.includes("RAS") || normTopic.includes("RAJASTHAN")) {
    matchGroup = "RAS Rajasthan PSC Exam";
    quizTitle = "Rajasthan Freedom Fighter History & Culture";
  } else if (normTopic.includes("NEET") || normTopic.includes("BIOLOGY") || normTopic.includes("SCIENCE")) {
    matchGroup = "NEET Biology Competency";
    quizTitle = "Cytology Structure & DNA Replication Concepts";
  } else if (normTopic.includes("JEE") || normTopic.includes("MATHS") || normTopic.includes("PHYSICS")) {
    matchGroup = "JEE Advanced Engineering";
    quizTitle = "Complex Calculus Limits & Integration Techniques";
  } else if (normTopic.includes("GK") || normTopic.includes("GENERAL") || normTopic.includes("HISTORY")) {
    matchGroup = "General Knowledge Masterclass";
    quizTitle = "Global History Eras, Treaties & Strategic Cartography";
  }

  const questionPool = [
    {
      question: `Which textbook-derived core provision under ${quizTitle} is most relevant for a ${difficulty} level candidate?`,
      options: [
        "Unverified rot memory facts lacking systematic analytical context.",
        "Developing analytical skills to trace historic causes, policy consequences, and structures.",
        "Memorizing list titles sequentially without internal logical definitions.",
        "Relying and focusing purely on alphabetically random answer trends."
      ],
      correctOptionIndex: 1,
      explanation: "Diagnostic and historical exams emphasize multi-criteria analytical evaluation rather than raw textual repetition.\n\nनैदानिक और ऐतिहासिक परीक्षाएं कच्चे पाठ की पुनरावृत्ति के बजाय बहु-मानदंड विश्लेषणात्मक मूल्यांकन पर जोर देती हैं।"
    },
    {
      question: `What fundamental structural principle governs standard formulations under the scope of ${topic}?`,
      options: [
        "Adhering to obsolete assumptions that bypass objective analysis standards.",
        "Systematic experimentation, strict empirical testing, and validated logic paradigms.",
        "Refusing to recognize changing parameter variables under stress testing.",
        "Conducting all analysis on client side caching exclusively without server validations."
      ],
      correctOptionIndex: 1,
      explanation: "Rigorous scientific, math, or constitutional frameworks utilize verified facts, systemic checks, and logical validation.\n\nसख्त वैज्ञानिक, गणितीय या संवैधानिक ढांचे सत्यापित तथ्यों, प्रणालीगत जांच और तार्किक सत्यापन का उपयोग करते हैं।"
    },
    {
      question: `When deploying assessment questions under ${matchGroup}, what component aids candidate troubleshooting metrics?`,
      options: [
        "Discarding questions to avoid scoring penalties completely.",
        "Reading and digesting detailed educational explanations immediately after selecting a choice.",
        "Disabling the countdown timer and ignoring visual indicators.",
        "Editing background browser session cookie arrays."
      ],
      correctOptionIndex: 1,
      explanation: "Direct pedagogical feedback loops help candidates digest errors instantenously, solidifying memory paths.\n\nप्रत्यक्ष शैक्षणिक फीडबैक लूप उम्मीदवारों को गलतियों को तुरंत समझने में मदद करते हैं, जिससे स्मृति पथ मजबूत होते हैं।"
    },
    {
      question: `Under standard syllabus guidelines of ${topic}, which diagnostic feature delivers the highest educational merit?`,
      options: [
        "Attempting to solve exam files in under 2 seconds via cursor-clicking.",
        "Detailed performance history distributions outlining precise category strengths and flaws.",
        "Creating beautiful signatures on decorative digital certifications.",
        "Maximizing browser display viewport zoom percentages."
      ],
      correctOptionIndex: 1,
      explanation: "A candidate benefits most by targeting weak syllabus sub-topics revealed in comprehensive performance diagnostic trackers.\n\nएक उम्मीदवार को व्यापक प्रदर्शन नैदानिक ट्रैकर्स में सामने आए कमजोर पाठ्यक्रम उप-विषयों को लक्षित करने से सबसे अधिक लाभ होता है।"
    },
    {
      question: `What mechanism prevents the duplicate repetition of questions in a personalized ${topic} roadmap?`,
      options: [
        "Manually deleting the browser storage index file daily.",
        "Dynamic server-side history registries that record attempted question IDs and filter them out.",
        "Disabling admin control dashboards entirely.",
        "Re-generating identical template data continuously."
      ],
      disabled: false,
      correctOptionIndex: 1,
      explanation: "A robust back-end session tracking system filters previously attempted IDs out of candidate questions, preventing repetitive learning fatigue.\n\nएक मजबूत बैक-एंड सत्र ट्रैकिंग प्रणाली उम्मीदवार के प्रश्नों में से पहले से प्रयास किए गए प्रश्नों को फ़िल्टर करती है, जिससे बार-बार सीखने की थकान से बचा जा सकता है।"
    }
  ];

  const selectedQuestions = questionPool.slice(0, count);

  return {
    title: quizTitle,
    subject: matchGroup,
    questions: selectedQuestions,
  };
}

// Vite Server middleware integration loop
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware active.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static assets from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server successfully active on port ${PORT}`);
  });
}

initializeServer().catch((e) => {
  console.error("Failed to start server:", e);
});
