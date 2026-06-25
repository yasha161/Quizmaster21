import crypto from "crypto";
import fs from "fs";
import path from "path";
import pg from "pg";

// Interfaces
export interface DbQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  importance: "high" | "conceptual" | "unexpected";
  createdAt: string;
  questionId?: string;
  quizId?: string;
  subjectId?: string;
  correctAnswer?: string;
  explanationEnglish?: string;
  explanationHindi?: string;
  sourceFile?: string;
}

export interface DbAttempt {
  id: string;
  userId: string;
  topic: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number;
  timestamp: string;
  questions: string[];
  answers: number[];
  attemptId?: string;
  quizId?: string;
  correctAnswers?: number;
  wrongAnswers?: number;
  timeTaken?: number;
  createdAt?: string;
}

export interface DbSubject {
  id: string;
  name: string;
  createdAt: string;
  subjectId?: string;
  category?: string;
  icon?: string;
}

export interface DbQuiz {
  id: string;
  subjectId: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  published: boolean;
  questions: DbQuestion[];
  createdAt: string;
  quizId?: string;
  title?: string;
  totalQuestions?: number;
  status?: string;
}

export function splitExplanation(explanation: string) {
  if (!explanation) return { english: "", hindi: "" };
  const parts = explanation.split(/\n\n+/);
  if (parts.length >= 2) {
    return {
      english: parts[0].trim(),
      hindi: parts[1].trim()
    };
  }
  const hasHindi = /[\u0900-\u097F]/.test(explanation);
  if (hasHindi) {
    return { english: "", hindi: explanation.trim() };
  }
  return { english: explanation.trim(), hindi: "" };
}

export function generateQuestionHash(questionText: string): string {
  const normalized = questionText.toLowerCase().replace(/[^a-z0-9]/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

// DATABASE CONNECTION SETUP
const dbPath = path.join(process.cwd(), "db.json");
let pgPool: pg.Pool | null = null;
let usePostgres = false;

function getPoolConfig(url: string): pg.PoolConfig {
  const match = url.match(/postgresql?:\/\/([^:]+):\[([^\]]+)\]@([^:]+):(\d+)\/(.+)/);
  if (match) {
    return {
      user: match[1],
      password: match[2],
      host: match[3],
      port: parseInt(match[4], 10),
      database: match[5],
      ssl: { rejectUnauthorized: false }
    };
  }

  try {
    const rawUrl = new URL(url);
    return {
      user: rawUrl.username ? decodeURIComponent(rawUrl.username) : undefined,
      password: rawUrl.password ? decodeURIComponent(rawUrl.password) : undefined,
      host: rawUrl.hostname,
      port: rawUrl.port ? parseInt(rawUrl.port, 10) : 5432,
      database: rawUrl.pathname ? rawUrl.pathname.slice(1) : undefined,
      ssl: { rejectUnauthorized: false }
    };
  } catch {
    return {
      connectionString: url,
      ssl: { rejectUnauthorized: false }
    };
  }
}

const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const poolConfig = getPoolConfig(dbUrl);
    pgPool = new pg.Pool(poolConfig);
    console.log("[Database] Connecting to PostgreSQL database at:", poolConfig.host);
    usePostgres = true;
  } catch (err) {
    console.error("[Database] Failed to initialize PostgreSQL pool, falling back to local storage:", err);
    usePostgres = false;
  }
}

async function initPgTables() {
  if (!pgPool || !usePostgres) return;

  const client = await pgPool.connect();
  try {
    console.log("[Database] Initializing database tables in PostgreSQL...");
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id VARCHAR(50) PRIMARY KEY,
        subject_id VARCHAR(50),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) DEFAULT 'Government Exams',
        icon VARCHAR(50) DEFAULT 'award',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(50) PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        topic VARCHAR(255) DEFAULT 'General Prep',
        question TEXT NOT NULL,
        options TEXT[] NOT NULL,
        correct_option_index INTEGER NOT NULL,
        explanation TEXT,
        difficulty VARCHAR(50) NOT NULL,
        importance VARCHAR(50) DEFAULT 'high',
        question_id VARCHAR(50),
        quiz_id VARCHAR(50),
        subject_id VARCHAR(50),
        correct_answer TEXT,
        explanation_english TEXT,
        explanation_hindi TEXT,
        source_file TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS attempts (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        accuracy NUMERIC NOT NULL,
        time_spent INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        questions VARCHAR(50)[] NOT NULL,
        answers INTEGER[] NOT NULL,
        attempt_id VARCHAR(50),
        quiz_id VARCHAR(50),
        correct_answers INTEGER,
        wrong_answers INTEGER,
        time_taken INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(50) PRIMARY KEY,
        subject_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        published BOOLEAN DEFAULT FALSE,
        questions JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        quiz_id VARCHAR(50),
        title VARCHAR(255),
        total_questions INTEGER,
        status VARCHAR(50) DEFAULT 'draft'
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS question_history (
        user_id VARCHAR(255) NOT NULL,
        question_id VARCHAR(50) NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, question_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("[Database] PostgreSQL tables verified and active.");
  } catch (err) {
    console.error("[Database] Error establishing PostgreSQL schema, disabling Postgres fallback:", err);
    usePostgres = false;
  } finally {
    client.release();
  }
}

if (usePostgres) {
  initPgTables().catch(err => {
    console.error("[Database] Async initPgTables failed:", err);
    usePostgres = false;
  });
}

// LOCAL JSON DATABASE ENGINE (FALLBACK)
interface LocalDb {
  subjects: DbSubject[];
  quizzes: DbQuiz[];
  questions: DbQuestion[];
  attempts: DbAttempt[];
  questionHistory: { userId: string; questionId: string; attemptedAt: string }[];
  jobs: Record<string, any>;
}

function readDb(): LocalDb {
  if (!fs.existsSync(dbPath)) {
    const initial: LocalDb = {
      subjects: [],
      quizzes: [],
      questions: [],
      attempts: [],
      questionHistory: [],
      jobs: {}
    };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      subjects: parsed.subjects || [],
      quizzes: parsed.quizzes || [],
      questions: parsed.questions || [],
      attempts: parsed.attempts || [],
      questionHistory: parsed.questionHistory || [],
      jobs: parsed.jobs || {}
    };
  } catch (err) {
    console.error("Error reading db.json, returning empty structure:", err);
    return {
      subjects: [],
      quizzes: [],
      questions: [],
      attempts: [],
      questionHistory: [],
      jobs: {}
    };
  }
}

function writeDb(data: LocalDb) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

const DEFAULT_SUBJECTS = [
  { id: "sub-upsc", name: "UPSC IAS Civils", category: "Government Exams", icon: "book" },
  { id: "sub-ssc-cgl", name: "SSC CGL Exam", category: "Government Exams", icon: "award" },
  { id: "sub-rrb-ntpc", name: "RRB NTPC", category: "Government Exams", icon: "train" },
  { id: "sub-state-pcs", name: "State PCS Exam", category: "Government Exams", icon: "map" },
  { id: "sub-banking", name: "Banking PO Exams", category: "Government Exams", icon: "globe" },
  { id: "sub-nda-cds", name: "NDA & CDS Exams", category: "Government Exams", icon: "shield" },
  { id: "sub-ugc-net", name: "UGC NET Paper 1", category: "Government Exams", icon: "graduation-cap" },
  { id: "sub-ctet", name: "CTET Pedagogy", category: "Government Exams", icon: "school" },
  { id: "sub-lic-aao", name: "LIC AAO Exam", category: "Government Exams", icon: "shield" },
  { id: "sub-police-si", name: "State Police SI", category: "Government Exams", icon: "shield" },
  { id: "sub-capf", name: "UPSC CAPF Forces", category: "Government Exams", icon: "shield" },
  { id: "sub-rbi-grade-b", name: "RBI Grade B Officer", category: "Government Exams", icon: "trending-up" },
  { id: "sub-ib-acio", name: "IB ACIO Intelligence", category: "Government Exams", icon: "eye" },
  { id: "sub-sebi-grade-a", name: "SEBI Grade A", category: "Government Exams", icon: "dollar-sign" },
  { id: "sub-epfo", name: "EPFO Enforcement", category: "Government Exams", icon: "briefcase" },
  { id: "sub-ifs", name: "Indian Forest Service", category: "Government Exams", icon: "trees" },
  { id: "sub-jee", name: "JEE", category: "Engineering", icon: "binary" },
  { id: "sub-neet", name: "NEET", category: "Medical", icon: "activity" },
  { id: "sub-gk", name: "General Knowledge", category: "General", icon: "globe" },
  { id: "sub-current-affairs", name: "Current Affairs", category: "General", icon: "clock" }
];

let defaultSubjectsSeeded = false;

export async function ensureDefaultSubjectsExist() {
  if (defaultSubjectsSeeded) return;

  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query("SELECT COUNT(*) FROM subjects");
      if (parseInt(res.rows[0].count, 10) === 0) {
        console.log("[Database] Seeding default subjects into PostgreSQL...");
        for (const sub of DEFAULT_SUBJECTS) {
          await pgPool.query(
            `INSERT INTO subjects (id, subject_id, name, category, icon, created_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [sub.id, sub.id, sub.name, sub.category, sub.icon, new Date().toISOString()]
          );
        }
      }
      defaultSubjectsSeeded = true;
      return;
    } catch (err) {
      console.error("[Database] Seeding default subjects failed, trying local fallback:", err);
    }
  }

  const dbData = readDb();
  let modified = false;
  for (const sub of DEFAULT_SUBJECTS) {
    const exists = dbData.subjects.some((s: any) => s.id === sub.id || s.subjectId === sub.id);
    if (!exists) {
      dbData.subjects.push({
        id: sub.id,
        subjectId: sub.id,
        name: sub.name,
        category: sub.category,
        icon: sub.icon,
        createdAt: new Date().toISOString()
      });
      modified = true;
    }
  }
  if (modified) {
    writeDb(dbData);
  }
  defaultSubjectsSeeded = true;
}

// CORE QUESTIONS INTERACTION
export async function getAllQuestions(): Promise<DbQuestion[]> {
  await ensureDefaultSubjectsExist();
  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query("SELECT * FROM questions");
      return res.rows.map(row => ({
        id: row.id,
        subject: row.subject,
        topic: row.topic,
        question: row.question,
        options: row.options,
        correctOptionIndex: row.correct_option_index,
        explanation: row.explanation,
        difficulty: row.difficulty,
        importance: row.importance,
        questionId: row.question_id,
        quizId: row.quiz_id,
        subjectId: row.subject_id,
        correctAnswer: row.correct_answer,
        explanationEnglish: row.explanation_english,
        explanationHindi: row.explanation_hindi,
        sourceFile: row.source_file,
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : ""
      }));
    } catch (err) {
      console.error("[Database] PostgreSQL getAllQuestions failed, trying local fallback:", err);
    }
  }

  const dbData = readDb();
  return dbData.questions;
}

export async function saveQuestions(questions: Omit<DbQuestion, "id" | "createdAt">[]): Promise<DbQuestion[]> {
  await ensureDefaultSubjectsExist();
  const saved: DbQuestion[] = [];

  for (const q of questions) {
    const questionId = generateQuestionHash(q.question);
    const explanationSplit = splitExplanation(q.explanation);

    const questionData: DbQuestion = {
      id: questionId,
      subject: q.subject,
      topic: q.topic || "General Prep",
      question: q.question,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      difficulty: q.difficulty,
      importance: q.importance || "high",
      questionId: questionId,
      quizId: q.quizId || "",
      subjectId: q.subjectId || "",
      correctAnswer: q.options[q.correctOptionIndex] || "",
      explanationEnglish: explanationSplit.english,
      explanationHindi: explanationSplit.hindi,
      sourceFile: q.sourceFile || "",
      createdAt: new Date().toISOString()
    };

    if (usePostgres && pgPool) {
      try {
        await pgPool.query(
          `INSERT INTO questions (id, subject, topic, question, options, correct_option_index, explanation, difficulty, importance, question_id, quiz_id, subject_id, correct_answer, explanation_english, explanation_hindi, source_file, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
           ON CONFLICT (id) DO UPDATE SET subject = EXCLUDED.subject, topic = EXCLUDED.topic, question = EXCLUDED.question, options = EXCLUDED.options, correct_option_index = EXCLUDED.correct_option_index, explanation = EXCLUDED.explanation, difficulty = EXCLUDED.difficulty, importance = EXCLUDED.importance`,
          [questionData.id, questionData.subject, questionData.topic, questionData.question, questionData.options, questionData.correctOptionIndex, questionData.explanation, questionData.difficulty, questionData.importance, questionData.questionId, questionData.quizId, questionData.subjectId, questionData.correctAnswer, questionData.explanationEnglish, questionData.explanationHindi, questionData.sourceFile, questionData.createdAt]
        );
        saved.push(questionData);
        continue;
      } catch (err) {
        console.error("[Database] PostgreSQL saveQuestions failed, falling back:", err);
      }
    }

    const dbData = readDb();
    const existingIdx = dbData.questions.findIndex(item => item.id === questionId);
    if (existingIdx !== -1) {
      questionData.createdAt = dbData.questions[existingIdx].createdAt || questionData.createdAt;
      dbData.questions[existingIdx] = questionData;
    } else {
      dbData.questions.push(questionData);
    }
    writeDb(dbData);
    saved.push(questionData);
  }

  return saved;
}

export async function getUserAttemptedQuestionIds(userId: string): Promise<Set<string>> {
  await ensureDefaultSubjectsExist();
  const attempted = new Set<string>();
  const lowerUser = userId.toLowerCase();

  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query("SELECT question_id FROM question_history WHERE LOWER(user_id) = $1", [lowerUser]);
      for (const row of res.rows) {
        attempted.add(row.question_id);
      }
      return attempted;
    } catch (err) {
      console.error("[Database] PostgreSQL getUserAttemptedQuestionIds failed:", err);
    }
  }

  const dbData = readDb();
  for (const entry of dbData.questionHistory) {
    if (entry.userId === lowerUser) {
      attempted.add(entry.questionId);
    }
  }
  return attempted;
}

export async function saveAttempt(attempt: Omit<DbAttempt, "id" | "timestamp">): Promise<DbAttempt> {
  await ensureDefaultSubjectsExist();
  const attemptId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const wrongCount = attempt.totalQuestions - attempt.score;

  const attemptData: DbAttempt = {
    id: attemptId,
    userId: attempt.userId,
    topic: attempt.topic,
    subject: attempt.subject,
    difficulty: attempt.difficulty,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    accuracy: attempt.accuracy,
    timeSpent: attempt.timeSpent,
    timestamp: timestamp,
    questions: attempt.questions,
    answers: attempt.answers,
    attemptId: attemptId,
    quizId: attempt.quizId || "",
    correctAnswers: attempt.score,
    wrongAnswers: wrongCount >= 0 ? wrongCount : 0,
    timeTaken: attempt.timeSpent,
    createdAt: timestamp
  };

  if (usePostgres && pgPool) {
    const client = await pgPool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`INSERT INTO attempts (id, user_id, topic, subject, difficulty, score, total_questions, accuracy, time_spent, timestamp, questions, answers, attempt_id, quiz_id, correct_answers, wrong_answers, time_taken, created_at)
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [attemptData.id, attemptData.userId, attemptData.topic, attemptData.subject, attemptData.difficulty, attemptData.score, attemptData.totalQuestions, attemptData.accuracy, attemptData.timeSpent, attemptData.timestamp, attemptData.questions, attemptData.answers, attemptData.attemptId, attemptData.quizId, attemptData.correctAnswers, attemptData.wrongAnswers, attemptData.timeTaken, attemptData.createdAt]
      );
      const lowerUser = attempt.userId.toLowerCase();
      for (const qId of attempt.questions) {
        await client.query(`INSERT INTO question_history (user_id, question_id, attempted_at) VALUES ($1, $2, $3) ON CONFLICT (user_id, question_id) DO NOTHING`, [lowerUser, qId, timestamp]);
      }
      await client.query("COMMIT");
      return attemptData;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("[Database] PostgreSQL saveAttempt failed, falling back:", err);
    } finally {
      client.release();
    }
  }

  const dbData = readDb();
  dbData.attempts.push(attemptData);
  const lowerUser = attempt.userId.toLowerCase();
  for (const qId of attempt.questions) {
    const existing = dbData.questionHistory.some(h => h.userId === lowerUser && h.questionId === qId);
    if (!existing) {
      dbData.questionHistory.push({ userId: lowerUser, questionId: qId, attemptedAt: timestamp });
    }
  }
  writeDb(dbData);
  return attemptData;
}

export async function getUserAttempts(userId: string): Promise<DbAttempt[]> {
  await ensureDefaultSubjectsExist();

  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query("SELECT * FROM attempts WHERE user_id = $1 ORDER BY timestamp DESC", [userId]);
      return res.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        topic: row.topic,
        subject: row.subject,
        difficulty: row.difficulty,
        score: row.score,
        totalQuestions: row.total_questions,
        accuracy: parseFloat(row.accuracy),
        timeSpent: row.time_spent,
        timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : "",
        questions: row.questions,
        answers: row.answers,
        attemptId: row.attempt_id,
        quizId: row.quiz_id,
        correctAnswers: row.correct_answers,
        wrongAnswers: row.wrong_answers,
        timeTaken: row.time_taken,
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : ""
      }));
    } catch (err) {
      console.error("[Database] PostgreSQL getUserAttempts failed:", err);
    }
  }

  const dbData = readDb();
  const results = dbData.attempts.filter(att => att.userId === userId);
  return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function queryMatchingQuestions(topicQuery: string, difficulty: "Easy" | "Medium" | "Hard", skipIds: Set<string>): Promise<DbQuestion[]> {
  const all = await getAllQuestions();
  const queryWords = topicQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  if (queryWords.length === 0) {
    return all.filter(q => q.difficulty === difficulty && !skipIds.has(q.id));
  }

  return all.filter((q) => {
    if (skipIds.has(q.id)) return false;
    if (q.difficulty !== difficulty) return false;

    const normQuestion = q.question.toLowerCase();
    const normTopic = q.topic.toLowerCase();
    const normSubject = q.subject.toLowerCase();
    
    let matchScore = 0;
    for (const word of queryWords) {
      if (normQuestion.includes(word)) matchScore += 1;
      if (normTopic.includes(word)) matchScore += 3;
      if (normSubject.includes(word)) matchScore += 2;
    }

    return matchScore > 0;
  });
}

// ADMIN OPERATIONS
export async function getSubjects(): Promise<DbSubject[]> {
  await ensureDefaultSubjectsExist();
  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query("SELECT * FROM subjects ORDER BY name ASC");
      return res.rows.map(row => ({ id: row.id, name: row.name, category: row.category, icon: row.icon, createdAt: row.created_at ? new Date(row.created_at).toISOString() : "", subjectId: row.subject_id }));
    } catch (err) {
      console.error("[Database] PostgreSQL getSubjects failed:", err);
    }
  }
  const dbData = readDb();
  return dbData.subjects;
}

export async function saveSubject(name: string): Promise<DbSubject> {
  await ensureDefaultSubjectsExist();
  const id = "sub-" + crypto.randomUUID().slice(0, 8);
  const subjectData: DbSubject = { id, subjectId: id, name: name, category: "Government Exams", icon: "award", createdAt: new Date().toISOString() };

  if (usePostgres && pgPool) {
    try {
      await pgPool.query(`INSERT INTO subjects (id, subject_id, name, category, icon, created_at) VALUES ($1, $2, $3, $4, $5, $6)`, [subjectData.id, subjectData.subjectId, subjectData.name, subjectData.category, subjectData.icon, subjectData.createdAt]);
      return subjectData;
    } catch (err) {
      console.error("[Database] PostgreSQL saveSubject failed:", err);
    }
  }

  const dbData = readDb();
  dbData.subjects.push(subjectData);
  writeDb(dbData);
  return subjectData;
}

export async function renameSubject(id: string, name: string): Promise<DbSubject | null> {
  await ensureDefaultSubjectsExist();
  
  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query(`UPDATE subjects SET name = $1 WHERE id = $2 OR subject_id = $2 RETURNING *`, [name, id]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return { id: row.id, name: row.name, category: row.category, icon: row.icon, createdAt: row.created_at ? new Date(row.created_at).toISOString() : "", subjectId: row.subject_id };
      }
      return null;
    } catch (err) {
      console.error("[Database] PostgreSQL renameSubject failed:", err);
    }
  }

  const dbData = readDb();
  const idx = dbData.subjects.findIndex(s => s.id === id || s.subjectId === id);
  if (idx === -1) return null;
  
  dbData.subjects[idx].name = name;
  writeDb(dbData);
  return dbData.subjects[idx];
}

export async function deleteSubject(id: string): Promise<boolean> {
  await ensureDefaultSubjectsExist();

  if (usePostgres && pgPool) {
    const client = await pgPool.connect();
    try {
      await client.query("BEGIN");
      const quizRes = await client.query("SELECT id FROM quizzes WHERE subject_id = $1", [id]);
      const quizIds = quizRes.rows.map(row => row.id);
      if (quizIds.length > 0) {
        await client.query("DELETE FROM attempts WHERE quiz_id = ANY($1)", [quizIds]);
      }

      const qRes = await client.query("SELECT id FROM questions WHERE subject_id = $1", [id]);
      const qIds = qRes.rows.map(row => row.id);
      if (qIds.length > 0) {
        await client.query("DELETE FROM question_history WHERE question_id = ANY($1)", [qIds]);
      }

      await client.query("DELETE FROM quizzes WHERE subject_id = $1", [id]);
      await client.query("DELETE FROM questions WHERE subject_id = $1", [id]);

      const res = await client.query("DELETE FROM subjects WHERE id = $1 OR subject_id = $1", [id]);
      const deleted = (res.rowCount ?? 0) > 0;
      
      await client.query("COMMIT");
      return deleted;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("[Database] PostgreSQL deleteSubject failed:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  const dbData = readDb();
  const initialLen = dbData.subjects.length;
  dbData.subjects = dbData.subjects.filter(s => s.id !== id && s.subjectId !== id);
  if (dbData.subjects.length !== initialLen) {
    const quizzesToDelete = dbData.quizzes.filter(q => q.subjectId === id);
    const quizIds = quizzesToDelete.map(q => q.id);
    dbData.quizzes = dbData.quizzes.filter(q => q.subjectId !== id);
    dbData.questions = dbData.questions.filter(q => q.subjectId !== id);
    if (dbData.attempts) {
      dbData.attempts = dbData.attempts.filter(a => !quizIds.includes(a.quizId || ""));
    }
    writeDb(dbData);
    return true;
  }
  return false;
}

export async function getQuizzes(): Promise<DbQuiz[]> {
  await ensureDefaultSubjectsExist();

  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query("SELECT * FROM quizzes ORDER BY created_at DESC");
      return res.rows.map(row => ({ id: row.id, subjectId: row.subject_id, name: row.name, difficulty: row.difficulty, published: row.published, questions: row.questions, createdAt: row.created_at ? new Date(row.created_at).toISOString() : "", quizId: row.quiz_id, title: row.title, totalQuestions: row.total_questions, status: row.status }));
    } catch (err) {
      console.error("[Database] PostgreSQL getQuizzes failed:", err);
    }
  }

  const dbData = readDb();
  return dbData.quizzes;
}

export async function saveQuiz(quiz: Omit<DbQuiz, "id" | "createdAt">): Promise<DbQuiz> {
  await ensureDefaultSubjectsExist();
  const id = "quiz-" + crypto.randomUUID().slice(0, 8);
  const createdAt = new Date().toISOString();

  const savedQuestions: DbQuestion[] = [];
  for (const q of quiz.questions) {
    const questionId = generateQuestionHash(q.question);
    const explanationSplit = splitExplanation(q.explanation);

    const questionData: DbQuestion = {
      id: questionId,
      subject: q.subject,
      topic: q.topic || "General Prep",
      question: q.question,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      difficulty: q.difficulty,
      importance: q.importance || "high",
      questionId: questionId,
      quizId: id,
      subjectId: quiz.subjectId,
      correctAnswer: q.options[q.correctOptionIndex] || "",
      explanationEnglish: explanationSplit.english,
      explanationHindi: explanationSplit.hindi,
      sourceFile: q.sourceFile || "",
      createdAt: new Date().toISOString()
    };

    savedQuestions.push(questionData);
  }

  await saveQuestions(savedQuestions);

  const quizData: DbQuiz = { id, quizId: id, subjectId: quiz.subjectId, name: quiz.name, difficulty: quiz.difficulty, published: quiz.published, questions: savedQuestions, createdAt, title: quiz.name, totalQuestions: savedQuestions.length, status: quiz.published ? "published" : "draft" };

  if (usePostgres && pgPool) {
    try {
      await pgPool.query(`INSERT INTO quizzes (id, subject_id, name, difficulty, published, questions, created_at, quiz_id, title, total_questions, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [quizData.id, quizData.subjectId, quizData.name, quizData.difficulty, quizData.published, JSON.stringify(quizData.questions), quizData.createdAt, quizData.quizId, quizData.title, quizData.totalQuestions, quizData.status]);
      return quizData;
    } catch (err) {
      console.error("[Database] PostgreSQL saveQuiz failed, falling back:", err);
    }
  }

  const dbData = readDb();
  dbData.quizzes.push(quizData);
  writeDb(dbData);
  return quizData;
}

export async function updateQuiz(id: string, updated: Partial<DbQuiz>): Promise<DbQuiz | null> {
  await ensureDefaultSubjectsExist();

  let currentQuiz: DbQuiz | null = null;

  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query("SELECT * FROM quizzes WHERE id = $1 OR quiz_id = $1", [id]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        currentQuiz = { id: row.id, subjectId: row.subject_id, name: row.name, difficulty: row.difficulty, published: row.published, questions: row.questions, createdAt: row.created_at ? new Date(row.created_at).toISOString() : "", quizId: row.quiz_id, title: row.title, totalQuestions: row.total_questions, status: row.status };
      }
    } catch (err) {
      console.error("[Database] PostgreSQL fetch current quiz for update failed:", err);
    }
  }

  if (!currentQuiz) {
    const dbData = readDb();
    const idx = dbData.quizzes.findIndex(q => q.id === id || q.quizId === id);
    if (idx !== -1) {
      currentQuiz = dbData.quizzes[idx];
    }
  }

  if (!currentQuiz) return null;

  if (updated.name !== undefined) {
    currentQuiz.name = updated.name;
    currentQuiz.title = updated.name;
  }
  if (updated.difficulty !== undefined) currentQuiz.difficulty = updated.difficulty;
  if (updated.published !== undefined) {
    currentQuiz.published = updated.published;
    currentQuiz.status = updated.published ? "published" : "draft";
  }
  if (updated.subjectId !== undefined) currentQuiz.subjectId = updated.subjectId;

  if (updated.questions) {
    if (usePostgres && pgPool) {
      try {
        await pgPool.query("DELETE FROM questions WHERE quiz_id = $1", [id]);
      } catch (err) {
        console.error("[Database] PostgreSQL clear old quiz questions failed:", err);
      }
    }

    const savedQuestions: DbQuestion[] = [];
    for (const q of updated.questions) {
      const questionId = generateQuestionHash(q.question);
      const explanationSplit = splitExplanation(q.explanation);

      const questionData: DbQuestion = {
        id: questionId,
        subject: q.subject,
        topic: q.topic || "General Prep",
        question: q.question,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        importance: q.importance || "high",
        questionId: questionId,
        quizId: id,
        subjectId: updated.subjectId || currentQuiz.subjectId || "",
        correctAnswer: q.options[q.correctOptionIndex] || "",
        explanationEnglish: explanationSplit.english,
        explanationHindi: explanationSplit.hindi,
        sourceFile: q.sourceFile || "",
        createdAt: new Date().toISOString()
      };

      savedQuestions.push(questionData);
    }
    
    await saveQuestions(savedQuestions);
    currentQuiz.questions = savedQuestions;
    currentQuiz.totalQuestions = savedQuestions.length;
  }

  if (usePostgres && pgPool) {
    try {
      await pgPool.query(`UPDATE quizzes SET subject_id = $1, name = $2, difficulty = $3, published = $4, questions = $5, title = $6, total_questions = $7, status = $8 WHERE id = $9 OR quiz_id = $9`, [currentQuiz.subjectId, currentQuiz.name, currentQuiz.difficulty, currentQuiz.published, JSON.stringify(currentQuiz.questions), currentQuiz.title, currentQuiz.totalQuestions, currentQuiz.status, id]);
      return currentQuiz;
    } catch (err) {
      console.error("[Database] PostgreSQL updateQuiz failed, falling back:", err);
    }
  }

  const dbData = readDb();
  const idx = dbData.quizzes.findIndex(q => q.id === id || q.quizId === id);
  if (idx !== -1) {
    dbData.quizzes[idx] = currentQuiz;
    dbData.questions = dbData.questions.filter(q => q.quizId !== id);
    if (currentQuiz.questions) {
      dbData.questions.push(...currentQuiz.questions);
    }
    writeDb(dbData);
  }

  return currentQuiz;
}

export async function deleteQuiz(id: string): Promise<boolean> {
  await ensureDefaultSubjectsExist();

  if (usePostgres && pgPool) {
    const client = await pgPool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM attempts WHERE quiz_id = $1", [id]);

      const qRes = await client.query("SELECT id FROM questions WHERE quiz_id = $1", [id]);
      const qIds = qRes.rows.map(row => row.id);
      if (qIds.length > 0) {
        await client.query("DELETE FROM question_history WHERE question_id = ANY($1)", [qIds]);
      }

      await client.query("DELETE FROM questions WHERE quiz_id = $1", [id]);

      const res = await client.query("DELETE FROM quizzes WHERE id = $1 OR quiz_id = $1", [id]);
      const deleted = (res.rowCount ?? 0) > 0;
      
      await client.query("COMMIT");
      return deleted;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("[Database] PostgreSQL deleteQuiz failed:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  const dbData = readDb();
  const initialLen = dbData.quizzes.length;
  
  dbData.quizzes = dbData.quizzes.filter(q => q.id !== id && q.quizId !== id);
  if (dbData.quizzes.length !== initialLen) {
    dbData.questions = dbData.questions.filter(q => q.quizId !== id);
    if (dbData.attempts) {
      dbData.attempts = dbData.attempts.filter(a => a.quizId !== id);
    }
    writeDb(dbData);
    return true;
  }
  return false;
}

// PROCESSING JOBS HELPER
export async function getJob(jobId: string): Promise<any> {
  if (usePostgres && pgPool) {
    try {
      const res = await pgPool.query("SELECT data FROM jobs WHERE id = $1", [jobId]);
      if (res.rows.length > 0) {
        return res.rows[0].data;
      }
      return null;
    } catch (err) {
      console.error("[Database] PostgreSQL getJob failed:", err);
    }
  }

  const dbData = readDb();
  return dbData.jobs[jobId] || null;
}

export async function saveJob(jobId: string, jobData: any): Promise<void> {
  if (usePostgres && pgPool) {
    try {
      const current = await getJob(jobId);
      const merged = { ...current, ...jobData, jobId };
      await pgPool.query(`INSERT INTO jobs (id, data, created_at) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`, [jobId, JSON.stringify(merged), new Date().toISOString()]);
      return;
    } catch (err) {
      console.error("[Database] PostgreSQL saveJob failed:", err);
    }
  }

  const dbData = readDb();
  dbData.jobs[jobId] = { ...dbData.jobs[jobId], ...jobData, jobId };
  writeDb(dbData);
}
