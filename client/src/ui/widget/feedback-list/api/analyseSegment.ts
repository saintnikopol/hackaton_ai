import type { AnalyzeSegmentResponse } from "../model/types/segmentFeedback";

export async function analyseSegment(segmentText: string) {
  const response = await fetch("http://localhost:3010/analyze-sentence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: segmentText,
    }),
  });
  return (await response.json()) as AnalyzeSegmentResponse;
}
