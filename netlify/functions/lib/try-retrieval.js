// A small playground. From your project folder run:
//   node netlify/functions/lib/try-retrieval.js "What did Vinay do at APADMI?"
// It prints how closely every chunk matches your question (1.000 = perfect).

const { rankAll } = require("./retrieve");

const question = process.argv.slice(2).join(" ");
if (!question) {
  console.log('Usage: node try-retrieval.js "your question"');
  process.exit(0);
}

console.log(`\nQuestion: ${question}\n`);
rankAll(question).forEach((r) => {
  const bar = "#".repeat(Math.round(r.score * 30));
  console.log(`${r.score.toFixed(3)}  ${r.id.padEnd(16)} ${bar}`);
});
console.log("");
