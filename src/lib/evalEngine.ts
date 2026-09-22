import type { DatasetRow, EvalResult } from '../context/EvalContext';

export function interpolatePrompt(prompt: string, row: DatasetRow): string {
  let interpolated = prompt;
  for (const [key, value] of Object.entries(row)) {
    const regex = new RegExp(`{{${key}}}`, 'gi');
    interpolated = interpolated.replace(regex, String(value));
  }
  return interpolated;
}

export async function generateModelResponse(
  systemPrompt: string, 
  userPrompt: string | null,
  model: string, 
  apiKey: string
): Promise<{ text: string, latencyMs: number }> {
  if (!apiKey) throw new Error('API Key is missing');

  const start = Date.now();
  
  const messages = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  if (userPrompt) messages.push({ role: 'user', content: userPrompt });

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.1
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const text = data.choices[0]?.message?.content || '';
  const latencyMs = Date.now() - start;

  return { text, latencyMs };
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
      const referenceAnswer = referenceColumn ? (row[referenceColumn] || '') : '';
      
      const { text: aiAnswer, latencyMs } = await generateModelResponse(prompt, null, selectedModel, apiKey);
      
      const grade = await gradeOutput(
        aiAnswer, referenceAnswer, evalCriteria, targetValue, judgeRubric, row, selectedModel, apiKey
      );

      results.push({
        exampleId: row._id,
        inputData: row,
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
      results.push({
        exampleId: row._id,
        inputData: row,
        aiAnswer: 'ERROR',
        referenceAnswer: referenceColumn ? String(row[referenceColumn]) : '',
        status: 'FAIL',
        score: 0,
        reason: e.message,
        latencyMs: 0
      });
      setEvalResults([...results]);
    }
  }
}
