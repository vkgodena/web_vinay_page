// netlify/functions/lib/retrieve.js
//
// STEP 2 OF RAG: RETRIEVAL
//
// 1. Turn every chunk into a vector (a list of numbers) using TF-IDF.
// 2. Turn the visitor's question into a vector the same way.
// 3. Compare the question vector against every chunk vector (cosine similarity).
// 4. Return the closest chunks.
//
// TF-IDF vectors are built from WORDS, so this is keyword-style search. Real
// embedding models build vectors from MEANING. The pipeline is identical; later
// we swap only the "text -> vector" step. Everything else stays the same.

const chunks = require("./knowledge");

// Very common words carry no signal, so we ignore them.
const STOPWORDS = new Set(
  `a an and are as at be but by can for from has have he her him his how i if in is it
  its me my of on or our she so than that the their them there these they this to was
  were what when where which who why will with would you your about tell did does do
  vinay godena kumar`.split(/\s+/)
);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#'\s]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/'s$/, "").replace(/'/g, ""))
    .map((t) => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t))
    .filter((t) => t && !STOPWORDS.has(t));
}

// Build the vocabulary statistics once, when the function starts.
const docTokens = chunks.map((c) => tokenize(`${c.title} ${c.title} ${c.text}`)); // title counted twice
const docFreq = new Map();
docTokens.forEach((tokens) =>
  new Set(tokens).forEach((t) => docFreq.set(t, (docFreq.get(t) || 0) + 1))
);
const N = chunks.length;
const idf = new Map();
// IDF: words that appear in few chunks are more informative than words in many.
docFreq.forEach((df, t) => idf.set(t, Math.log((N + 1) / (df + 1)) + 1));

function toVector(tokens) {
  const counts = new Map();
  tokens.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
  const vec = new Map();
  let norm = 0;
  counts.forEach((count, t) => {
    if (!idf.has(t)) return; // word never seen in any chunk: ignore
    const weight = (1 + Math.log(count)) * idf.get(t);
    vec.set(t, weight);
    norm += weight * weight;
  });
  norm = Math.sqrt(norm) || 1;
  vec.forEach((w, t) => vec.set(t, w / norm)); // unit length
  return vec;
}

function cosine(a, b) {
  let dot = 0;
  a.forEach((w, t) => {
    if (b.has(t)) dot += w * b.get(t);
  });
  return dot; // both vectors are unit length, so the dot product IS the cosine
}

const chunkVectors = docTokens.map(toVector);

// Score every chunk against the question. If the visitor's previous question is
// supplied, it counts at half weight so follow-ups like "what tools did he use
// there?" still find the right chunk.
function rankAll(question, previousQuestion = "") {
  const q = toVector(tokenize(question));
  const p = previousQuestion ? toVector(tokenize(previousQuestion)) : null;
  return chunks
    .map((chunk, i) => {
      let score = cosine(q, chunkVectors[i]);
      if (p) score += 0.5 * cosine(p, chunkVectors[i]);
      return { id: chunk.id, title: chunk.title, text: chunk.text, score };
    })
    .sort((x, y) => y.score - x.score);
}

// The top-k chunks above a minimum score. If nothing matches at all, fall back
// to the general profile chunk so the assistant still has something to work with.
function retrieve(question, { k = 2, minScore = 0.10, previousQuestion = "" } = {}) {
  const ranked = rankAll(question, previousQuestion);
  const top = ranked.filter((r) => r.score >= minScore).slice(0, k);
  if (top.length) return top;
  return ranked.filter((r) => r.id === "profile").map((r) => ({ ...r, fallback: true }));
}

module.exports = { retrieve, rankAll };
