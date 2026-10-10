// netlify/functions/chat.js
//
// This is the "middleman" between your webpage and the Claude API.
// It runs on Netlify's servers, not in the visitor's browser — so your
// API key (read from an environment variable) is never exposed publicly.

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message, history } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'message' in request body" }),
      };
    }

    // Basic length guard — avoids abuse and keeps costs predictable
    if (message.length > 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message too long (max 1000 characters)" }),
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfigured: missing API key" }),
      };
    }

    // System prompt — defines who the assistant is and what it should talk about.
    // Edit this freely to match your own background and tone.
    const SYSTEM_PROMPT = `You are a friendly assistant answering questions on Vinay Kumar Godena's
personal portfolio website. Vinay is a Senior Test Specialist with experience across
complex, large-scale software applications in the IT sector, AI-certified, and
applying emerging AI expertise to quality engineering practices.

Here is Vinay's work history, which you should draw on for specific questions:

1. Netcompany — HMRC UK: Automatic Exchange of Information (Jan 2025 - to date)
   Systematic exchange of financial account information between the UK and other
   jurisdictions to combat tax evasion. Technologies: Scala, Kibana, Grafana, Splunk,
   JIRA, Bruno, GitHub, Jenkins, UAT/Performance/Smoke/Sanity testing. Personal
   development during this role: Python, AI tooling (Prompt Engineering, LLM, RAG,
   MCP, LangChain ecosystem), Gatling, Power BI. Certifications: AI for Everyone,
   OCI AI Foundations Associate.

2. APADMI — Native application development (Oct 2019 - Jan 2025)
   Native iOS and Android app development and testing for UK commercial clients
   including Domino's, Poundland, GreeneKing, Argos financial services and ID Mobile.
   Technologies: Java, Firebase, Google Analytics, Appium, Selenium WebDriver, TestNG,
   UAT/Smoke/Sanity testing, iOS, Android, Xcode, Android Studio, BrowserStack,
   TestRail, Postman, Newman, REST Assured API. Certification: Professional Scrum
   Master (PSM-1).

3. Livingston IT Consulting Ltd — Web based manual testing (Sep 2017 - Oct 2019)
   Functional testing, business process, and system architecture and design.
   Technologies: C#, E2E/Usability/Regression/UAT/Smoke/Sanity testing, TestRail,
   Postman, Newman, REST Assured API. Certification: ISTQB Certified Tester Foundation Level.

Answer visitor questions about Vinay's background, skills, and experience using the
details above. Keep answers brief (2-4 sentences) and friendly. If asked something
unrelated to Vinay or his work, politely redirect to topics you can help with. If a
specific detail genuinely isn't covered above, say so honestly rather than making
something up.`;

    // Build the conversation: prior history (if any) + the new message
    const messages = [
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Upstream API error" }),
      };
    }

    const data = await response.json();
    const reply = data.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
};
