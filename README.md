# EvalLITE ⚡️

**A lightweight, zero-setup AI evaluation engine for developers. Pure frontend. Bring your own keys.**

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-emerald?style=for-the-badge)](#)
[![Loom Video](https://img.shields.io/badge/Video-Loom_Walkthrough-blue?style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

Enterprise AI evaluation platforms are incredibly powerful, but they are often too heavy, expensive, and complex for solo developers building lightweight LLM wrappers. 

**EvalLITE** is a portfolio-ready MVP built to solve this exact problem. It is a completely local, browser-based evaluation platform. There are no databases to spin up, no Docker containers to run, and no backend servers. You paste your API key, upload your test data, and start grading your prompts instantly.

## 🚧 The Problem It Solves

* **Vibe-Based Deployments:** Developers often test prompts by typing a few questions manually and guessing if the new model is "better." EvalLITE replaces guessing with hard metrics (Pass Rates & Error Logs).
* **Data Privacy:** Sending proprietary customer data to third-party evaluation dashboards is a compliance risk. EvalLITE keeps all test data strictly inside your local browser state.
* **CORS & Frontend Limitations:** Direct API calls from browsers are usually blocked. EvalLITE implements an internal Provider Router that safely bypasses browser CORS constraints for BYOK (Bring Your Own Key) tools.

## ✨ Core Features

* **Bring Your Own Key (BYOK):** Supports OpenAI, Anthropic, Google Gemini, OpenRouter, and local Ollama models natively.
* **Variable Interpolation:** Upload a standard CSV and inject variables directly into your system prompts (e.g., `Customer Request: {{input}}`).
* **Rule-Based Grading:** Instantly grade model outputs using deterministic rules like *Exact Match*, *Contains Keyword*, or *Valid JSON*.
* **LLM-as-a-Judge:** Bring your own custom grading rubric and let an LLM evaluate semantic meaning, tone, and accuracy.
* **Click-to-Inspect Dashboard:** A clean, developer-focused results table to drill down into failed rows and isolate prompt weaknesses.

## 🔄 Workflow

1. **Ingest:** Upload a `.csv` dataset containing `input` and `expected_output` (ground truth) columns.
2. **Draft:** Write your system prompt in the Playground and inject your dataset variables.
3. **Configure:** Select your AI provider, paste your API key, and choose your evaluation criteria (e.g., Exact Match).
4. **Execute:** Run the batch engine. EvalLITE fetches live responses from the LLM and grades them in real-time.
5. **Analyze:** Filter the main dashboard by `FAIL` to pinpoint exactly which edge cases your prompt missed.

## 🛠️ Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS (Dark-mode, developer-focused UI)
* **Architecture:** 100% Client-Side. No backend infrastructure.
* **State Management:** React Context / Local Component State
* **File Parsing:** PapaParse (Client-side CSV processing)

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone [https://github.com/yourusername/eval-lite.git](https://github.com/yourusername/eval-lite.git)

# 2. Navigate to the directory
cd eval-lite

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
