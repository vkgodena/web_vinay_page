// netlify/functions/lib/knowledge.js
//
// STEP 1 OF RAG: CHUNKING
// Each object below is one "chunk": a small, self-contained piece of knowledge.
// Every chunk repeats its own context (company, dates) so it still makes sense
// when it is retrieved on its own, without the other chunks next to it.

module.exports = [
  {
    id: "profile",
    title: "Professional profile and working style",
    text: `Vinay Kumar Godena is a Senior Test Specialist with hands-on experience
testing complex, large-scale software applications across the IT sector. He is
AI-certified and applies emerging AI expertise to evolving quality engineering
practices. He regularly contributes to team presentations and knowledge-sharing
sessions, helping colleagues stay current with tools and approaches. He is a
collaborative communicator with strong analytical and problem-solving abilities,
comfortable working independently or leading discussions within a team. Beyond
day-to-day delivery he is actively involved in organising company events and
volunteering for internal and external initiatives, and he enjoys bringing people
together. He is always keen to explore new technology and keep pace with industry
developments.`,
  },
  {
    id: "interests",
    title: "Personal interests and hobbies",
    text: `Outside of work, Vinay enjoys driving, playing cricket, walking, and
swimming. It is a mix of activities that keep things active and social.`,
  },
  {
    id: "career-timeline",
    title: "Career timeline and employers",
    text: `Vinay's career in software testing runs from September 2017 to the present.
Livingston IT Consulting Ltd (September 2017 to October 2019): web based manual
testing. APADMI (October 2019 to January 2025): native iOS and Android application
development and testing. Netcompany (January 2025 to date): the HMRC UK Automatic
Exchange of Information project.`,
  },
  {
    id: "skills-overview",
    title: "Programming languages and tools overview",
    text: `Programming languages: Scala (Netcompany, HMRC project), Java (APADMI),
C# (Livingston IT Consulting) and Python (personal development). Test automation and
API tools: Appium, Selenium WebDriver, TestNG, Postman, Newman, REST Assured, Bruno.
Test management and delivery tools: JIRA, TestRail, GitHub, Jenkins. Monitoring and
analytics tools: Kibana, Grafana, Splunk, Firebase. Reporting and performance:
Gatling and Power BI. AI tooling: prompt engineering, LLMs, RAG, MCP and the
LangChain ecosystem.`,
  },
  {
    id: "certifications",
    title: "Certifications",
    text: `Vinay holds these certifications: AI for Everyone, OCI AI Foundations
Associate, and Professional Scrum Master (PSM-1).`,
  },
  {
    id: "netcompany-hmrc",
    title: "Netcompany: HMRC UK, Automatic Exchange of Information (January 2025 to date)",
    text: `At Netcompany, Vinay works on the HMRC UK Automatic Exchange of Information
project: the systematic exchange of financial account information between the UK and
other jurisdictions to combat tax evasion. Project technology: Scala; analytic tools
Kibana, Grafana and Splunk; test automation covering UAT, performance, smoke and
sanity testing; testing tools JIRA, Bruno, GitHub and Jenkins. Personal development
during this role: Python; AI tooling and frameworks including prompt engineering,
LLMs, RAG, MCP and the LangChain ecosystem; test reporting with Gatling and Power BI.
Certifications: AI for Everyone and OCI AI Foundations Associate.`,
  },
  {
    id: "apadmi",
    title: "APADMI: native application development (October 2019 to January 2025)",
    text: `At APADMI, Vinay did native iOS and Android app development and testing for UK
commercial clients including Domino's, Poundland, GreeneKing, Argos financial services
and ID Mobile. Project technology: Java; analytic tools Firebase and Google; test
automation with Appium, Selenium WebDriver, TestNG, UAT, smoke and sanity testing;
mobile platforms and tools iOS, Android, Xcode, Android Studio and BrowserStack;
testing tools TestRail, Postman, Newman and REST Assured API. Certification:
Professional Scrum Master (PSM-1).`,
  },
  {
    id: "livingston",
    title: "Livingston IT Consulting Ltd: web based manual testing (September 2017 to October 2019)",
    text: `At Livingston IT Consulting Ltd, Vinay did web based manual testing: functional
testing, business process, and system architecture and design. Project technology: C#;
end-to-end, usability, regression, UAT, smoke and sanity testing; testing tools
TestRail, Postman, Newman and REST Assured API. Certification: ISTQB Certified Tester Foundation Level.`,
  },
];
