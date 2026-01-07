"use server";

type districtData = {
  city : string,
  city_count_total : number,
  number_of_guguns : number,
  erdsgn : number,
  avg_old : number,
};

const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY;

export async function generateAnalysis({city, city_count_total, number_of_guguns, erdsgn, avg_old} : districtData): Promise<{ ok: boolean; data?: string; error?: string }> {
  if (!apiKey) {
    return { ok: false, error: "Google Generative AI Key is missing" };
  }

  const prompt = `너는 도시 인프라 안전 진단 및 공공 정책 전문가야. "${city} 행정 구역의 현황 : 시설 ${city_count_total}개, ${number_of_guguns}개 관할구역. 내진설계 시설 ${erdsgn}개, 시설 노후도 ${avg_old}%" 이 데이터를 분석하여 ${city}의 '공공 체육 시설 안전 진단 리포트'를 3문장 이내로 작성해줘.`
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          return { ok: false, error: "No text generated from API" };
        }
        return { ok: true, data: text }; // Success
      }

      // Check for specific overload error to retry
      if (response.status === 503 && attempt < maxRetries) {
        console.warn(`Attempt ${attempt} failed with 503. Retrying in ${retryDelay / 1000}s...`);
        await new Promise(res => setTimeout(res, retryDelay));
        continue; // Go to next attempt
      }

      // For other errors or if it's the last attempt, return error
      const errorData = await response.json();
      console.error("Gemini API Error Data:", JSON.stringify(errorData, null, 2));
      return { ok: false, error: errorData.error?.message || `API request failed with status ${response.status}` };

    } catch (error: any) {
      console.error(`Attempt ${attempt} failed with error:`, error);
      if (attempt < maxRetries) {
        await new Promise(res => setTimeout(res, retryDelay));
        continue;
      }
      return { ok: false, error: error.message || "An unknown network error occurred" };
    }
  }

  return { ok: false, error: "Failed to generate analisis after multiple retries." };
}
