// This file is intentionally minimal for now.
// We'll add the chat widget's logic here in a later step.

console.log("Site loaded. Ready for the next step.");

// ============================================================
// AI Chat Widget
// ============================================================
(function () {
  const toggleBtn = document.getElementById("chat-toggle");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messagesEl = document.getElementById("chat-messages");

  if (!toggleBtn || !panel || !form) return; // widget not on this page

  let history = []; // conversation so far, sent with each request for context
  let isSending = false;

  function openPanel() {
    panel.classList.add("chat-panel--open");
    toggleBtn.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closePanel() {
    panel.classList.remove("chat-panel--open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  toggleBtn.addEventListener("click", () => {
    panel.classList.contains("chat-panel--open") ? closePanel() : openPanel();
  });
  closeBtn.addEventListener("click", closePanel);

  function addMessage(role, text) {
    const el = document.createElement("div");
    el.className = `chat-msg chat-msg--${role}`;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  async function sendMessage(text) {
    addMessage("user", text);
    history.push({ role: "user", content: text });

    const typingEl = addMessage("assistant", "…");
    isSending = true;

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history.slice(0, -1), // don't double-send the latest message
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        typingEl.textContent = "Sorry, something went wrong. Please try again.";
        console.error("Chat error:", data.error);
        return;
      }

      typingEl.textContent = data.reply;

      // Show which pieces of knowledge the answer was based on (RAG sources).
      if (Array.isArray(data.sources) && data.sources.length) {
        const src = document.createElement("div");
        src.className = "chat-sources";
        src.textContent = "Based on: " + data.sources.map((s) => s.label).join(", ");
        typingEl.appendChild(src);
      }
      messagesEl.scrollTop = messagesEl.scrollHeight;

      history.push({ role: "assistant", content: data.reply });
    } catch (err) {
      typingEl.textContent = "Sorry, I couldn't connect. Please try again.";
      console.error("Chat fetch failed:", err);
    } finally {
      isSending = false;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isSending) return;
    input.value = "";
    sendMessage(text);
  });
})();
