import type { DatasetRow, EvalResult } from '../context/EvalContext';

export function interpolatePrompt(prompt: string, row: DatasetRow): string {
  let interpolated = prompt;
  for (const [key, value] of Object.entries(row)) {
    const regex = new RegExp(`{{${key}}}`, 'gi');
    interpolated = interpolated.replace(regex, String(value));
  }
  return interpolated;
}

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateModelResponse(
  systemPrompt: string, 
  userPrompt: string | null,
  model: string, 
  apiKey: string
): Promise<{ text: string, latencyMs: number }> {
  if (!apiKey && !model.includes('llama') && !model.includes('mistral')) {
    throw new Error('API Key is missing');
  }

  const start = Date.now();
  let aiAnswer = '';

  try {
    // 1. Groq — gsk_ key always wins, regardless of model name format
    if (apiKey.startsWith('gsk_')) {
      const groq = new OpenAI({ 
        apiKey, 
        baseURL: 'https://api.groq.com/openai/v1',
        dangerouslyAllowBrowser: true
      });
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      if (userPrompt) messages.push({ role: 'user', content: userPrompt });

      const res = await groq.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.1
      });
      aiAnswer = res.choices[0]?.message?.content || '';
    }
    // 2. OpenRouter — model IDs contain '/' (e.g. meta-llama/llama-3...)
    else if (model.includes('/')) {
      const openai = new OpenAI({ 
        apiKey, 
        baseURL: 'https://openrouter.ai/api/v1',
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          'HTTP-Referer': window.location.origin,
          'X-Title': 'EvalOS'
        }
      });
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      if (userPrompt) messages.push({ role: 'user', content: userPrompt });

      const res = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.1
      });
      aiAnswer = res.choices[0]?.message?.content || '';
    }
    // 3. OpenAI — gpt model + sk- key
    else if (model.includes('gpt')) {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      if (userPrompt) messages.push({ role: 'user', content: userPrompt });

      const res = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.1
      });
      aiAnswer = res.choices[0]?.message?.content || '';
    }
    // 3. Anthropic
    else if (model.includes('claude')) {
      const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const messages: any[] = [];
      if (userPrompt) messages.push({ role: 'user', content: userPrompt });
      else messages.push({ role: 'user', content: 'Continue.' });

      const res = await anthropic.messages.create({
        model: model,
        max_tokens: 1024,
        messages: messages,
        ...(systemPrompt ? { system: systemPrompt } : {})
      });
      aiAnswer = (res.content[0] as any)?.text || '';
    }
    // 4. Google
    else if (model.includes('gemini')) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ 
        model: model,
        ...(systemPrompt ? { systemInstruction: systemPrompt } : {})
      });
      const res = await geminiModel.generateContent(userPrompt || '');
      aiAnswer = res.response.text();
    }
    // 5. Local Ollama Fallback
    else {
      const fullPrompt = `${systemPrompt ? systemPrompt + '\n\n' : ''}${userPrompt || ''}`;
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: fullPrompt,
          stream: false
        })
      });
      if (!res.ok) throw new Error('Local Ollama request failed');
      const data = await res.json();
      aiAnswer = data.response;
    }

    return {
      text: aiAnswer,
      latencyMs: Date.now() - start
    };
  } catch (error: any) {
    throw new Error(`[API Error]: ${error.message}`);
  }
}

export async function gradeOutput(
  aiAnswer: string,
  referenceAnswer: string,
  criteria: string,
  targetValue: string,
  judgeRubric: string,
  row: DatasetRow,
  model: string,
  apiKey: string
): Promise<{ status: 'PASS' | 'FAIL', score: number, reason: string }> {
  
  if (criteria === 'Exact Match') {
    const pass = aiAnswer.trim().toLowerCase() === referenceAnswer.trim().toLowerCase();
    return {
      status: pass ? 'PASS' : 'FAIL',
      score: pass ? 1 : 0,
      reason: pass ? 'Matches reference answer exactly.' : 'Does not match reference answer.'
    };
  }
  
  if (criteria === 'Contains Keyword') {
    const pass = aiAnswer.toLowerCase().includes(targetValue.toLowerCase());
    return {
      status: pass ? 'PASS' : 'FAIL',
      score: pass ? 1 : 0,
      reason: pass ? `Contains keyword: ${targetValue}` : `Missing keyword: ${targetValue}`
    };
  }

  if (criteria === 'Valid JSON') {
    try {
      JSON.parse(aiAnswer);
      return { status: 'PASS', score: 1, reason: 'Valid JSON format.' };
    } catch (e: any) {
      return { status: 'FAIL', score: 0, reason: `Invalid JSON: ${e.message}` };
    }
  }

  if (criteria === 'LLM-as-a-Judge') {
    const judgePrompt = `You are an impartial evaluator grading a candidate answer against a reference answer.
Rubric: ${judgeRubric}

Original Row Data: ${JSON.stringify(row)}
Reference Answer: ${referenceAnswer}
Candidate Answer: ${aiAnswer}

Return a JSON object with strictly these keys:
{
  "verdict": "PASS" or "FAIL",
  "score": 1 or 0,
  "reason": "A one-sentence explanation"
}`;
    
    try {
      const { text } = await generateModelResponse(judgePrompt, null, model, apiKey);
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        if (text.includes('```json')) {
           const match = text.match(/```json\n([\s\S]*?)\n```/);
           if (match) parsed = JSON.parse(match[1]);
        }
      }

      if (!parsed) throw new Error('Could not parse judge response as JSON');

      return {
        status: parsed.verdict === 'PASS' ? 'PASS' : 'FAIL',
        score: parsed.score || 0,
        reason: parsed.reason || 'No reason provided.'
      };
    } catch (e: any) {
      return { status: 'FAIL', score: 0, reason: `Judge LLM Error: ${e.message}` };
    }
  }

  return { status: 'FAIL', score: 0, reason: 'Unknown criteria' };
}

export async function runBatchEvaluation(
  context: any,
  onProgress: (current: number, total: number) => void
) {
  const { 
    datasetRows, apiKey, selectedModel, systemPrompt, 
    evalCriteria, targetValue, judgeRubric, referenceColumn,
    setEvalResults
  } = context;

  const results: EvalResult[] = [];
  
  for (let i = 0; i < datasetRows.length; i++) {
    const row = datasetRows[i];
    onProgress(i + 1, datasetRows.length);

    try {
      const prompt = interpolatePrompt(systemPrompt, row);
      
      // Standardized fallback chains for reference and input
      const referenceAnswer = referenceColumn 
        ? (row[referenceColumn] || '') 
        : (row.expected_output || row.reference_answer || row.expectedOutput || '');
      
      const inputVal = row.input || row.user_request || row.userRequest || row.query || row.question || '';
      
      const { text: aiAnswer, latencyMs } = await generateModelResponse(prompt, null, selectedModel, apiKey);
      
      const grade = await gradeOutput(
        aiAnswer, referenceAnswer, evalCriteria, targetValue, judgeRubric, row, selectedModel, apiKey
      );

      results.push({
        exampleId: row._id,
        inputData: row,
        inputVal,
        aiAnswer,
        referenceAnswer,
        status: grade.status,
        score: grade.score,
        reason: grade.reason,
        latencyMs
      });
      
      // Update state incrementally
      setEvalResults([...results]);

    } catch (e: any) {
      const referenceAnswer = referenceColumn ? String(row[referenceColumn] || '') : (row.expected_output || row.reference_answer || '');
      const inputVal = row.input || row.user_request || '';
      results.push({
        exampleId: row._id,
        inputData: row,
        inputVal,
        aiAnswer: 'ERROR',
        referenceAnswer,
        status: 'FAIL',
        score: 0,
        reason: e.message,
        latencyMs: 0
      });
      setEvalResults([...results]);
    }
  }
}
