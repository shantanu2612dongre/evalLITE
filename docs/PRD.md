# Product Requirements Document (PRD): EvalLITE

**Document Status:** Approved | **Date:** September 2026  
**Product Manager:** Shantanu Dongre  

---

## 1. Executive Summary
EvalLITE is a lightweight, zero-setup AI evaluation engine designed for developers and indie hackers. It runs entirely in the browser, allowing users to evaluate Large Language Model (LLM) prompts using their own API keys (BYOK) and local datasets without setting up a backend, database, or complex SDKs. 

## 2. Problem Statement
As LLM adoption accelerates, developers struggle to measure prompt accuracy. They typically face two bad options:
1. **"Vibe-Based" Testing:** Manually typing 3-4 prompts into ChatGPT and guessing if the new prompt is better. This doesn't scale and lacks empirical metrics.
2. **Enterprise Eval Platforms:** Tools like LangSmith or Arize are powerful but require backend integration, Docker containers, and complex SDKs. Furthermore, sending proprietary data (e.g., medical logs, legal contracts) to third-party dashboards introduces severe security and compliance risks.

**The Gap:** There is no "plug-and-play" evaluation tool for rapid, privacy-first, local testing.

## 3. Target Persona
* **Solo Developers & Indie Hackers:** Building lightweight AI wrappers or side projects. They want fast iteration and zero infrastructure costs.
* **Enterprise Prototypers:** Engineers prototyping internal AI tools who cannot send sensitive corporate data to external evaluation platforms.

## 4. Value Proposition
* **Zero Setup:** No logins, no databases, no SDKs. Just open the URL and start testing.
* **100% Data Privacy:** Built as a pure frontend React app. Data never leaves the browser's local state.
* **Bring Your Own Key (BYOK):** Supports OpenAI, Anthropic, Gemini, and local Ollama models directly via client-side routing.

## 5. Scope & Requirements (MVP)

### 5.1 In-Scope (Must Have)
* **Data Ingestion:** Upload standard `.csv` files mapping `input` to `expected_output`.
* **Prompt Playground:** A text area with variable interpolation (e.g., `{{input}}`) to draft system prompts.
* **Provider Router:** Dynamically handle CORS bypasses for OpenAI, Anthropic, and Google generative AI SDKs based on user selection.
* **Evaluation Engine:** 
  * Deterministic Grading: *Exact Match*.
  * Semantic Grading: *LLM-as-a-Judge* (allowing users to inject a custom grading rubric).
* **Results Dashboard:** A real-time data table showing the raw input, expected output, AI output, and a PASS/FAIL badge.

### 5.2 Out of Scope (Deferred to V2)
* User authentication and persistent accounts.
* Cloud database storage for historical evaluation runs.
* Export functionality (CSV/JSON).
* Pre-built LLM evaluator templates (e.g., Tone Analyzer, Toxicity Checker).

## 6. PM Strategy: Key Trade-offs & Scoping Decisions

To ship the MVP rapidly while maintaining high user value, the following strategic product decisions were made:

1. **Local State vs. Cloud Database:** 
   * *Decision:* Abandoned Postgres/Supabase in favor of local React state. 
   * *Why:* Reduced engineering timeline by 60% and created a unique selling point (USP)—total data privacy for enterprise prototypers.
2. **"Bring Your Own Rubric" vs. Pre-Built Evaluator Hub:** 
   * *Decision:* Cut the feature of offering 10+ pre-built grading templates.
   * *Why:* Audience research indicated developers prefer writing custom grading logic specific to their edge cases. A simple text area for custom rubrics eliminated backend complexity while providing infinite flexibility.
3. **No Auth/Onboarding:**
   * *Decision:* Users land directly on the functional playground.
   * *Why:* Reduces "Time to First Value" (TTFV) to under 10 seconds.

## 7. Success Metrics
Since there is no backend tracking, success will be measured via frontend analytics (e.g., Vercel/Netlify Analytics, PostHog):
* **Activation:** Number of users who successfully complete a batch evaluation run.
* **Time to First Value (TTFV):** Time elapsed between landing on the URL and generating the first `PASS/FAIL` result (Target: < 30 seconds).
* **Adoption:** Number of GitHub stars and repository clones.

## 8. Future Roadmap (V2)
* **Export to CSV:** Allow users to download evaluation results for external reporting.
* **Human-in-the-Loop (HITL) Tagging:** Add an interactive annotations tab for PMs to manually override PASS/FAIL results and tag hallucination edge cases.
* **Cost Estimator:** Display token usage and estimated API cost per batch run.
