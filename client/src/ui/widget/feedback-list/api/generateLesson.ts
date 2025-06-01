// Represents a single grammatical error in the analysis
export interface GenerateTextLessonError {
  type: string;
  description: string;
  original: string;
  correction: string;
}

export interface GenerateTextLessonData {
  originalText: string;
  lesson: string;
  errors: GenerateTextLessonError[];
  analysisTimestamp: string; // ISO 8601 timestamp
  errorCount: number;
}

export interface GenerateTextLessonResponse {
  success: boolean;
  data: GenerateTextLessonData | null;
}

export interface GenerateVideoLessonResponse {
  url: string;
  fileName: string;
  fileSize: number;
  reqId: string;
}

const mockVideoLessonData: GenerateVideoLessonResponse = {
  url: "https://v3.fal.media/files/panda/3wAloLKlwe0Xs6U0sOu7u_tmpod93mdw2.mp4",
  fileName: "",
  fileSize: 0,
  reqId: "",
};

const mockVideoLessonDataDemo: GenerateVideoLessonResponse = {
  url: "https://v3.fal.media/files/panda/Jf-j2R8y5rB4QF__dpkBv_tmpjhjinwmt.mp4",
  fileName: "tmpjhjinwmt.mp4",
  fileSize: 21486342,
  reqId: "2cb0fb97-e3b5-4b53-9aef-d8cc0e63304b",
};

export async function generateLesson(callTranscript: string) {
  const generateLessonResponse = await fetch(
    "http://localhost:3010/generate-lesson-text",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: callTranscript,
      }),
    },
  );
  const textLessonData =
    (await generateLessonResponse.json()) as GenerateTextLessonResponse;

  // const generateVideoLessonResponse = await fetch(
  //   "http://localhost:3000/audiovideogen",
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       text: textLessonData.data?.lesson,
  //     }),
  //   },
  // );
  // const videoLessonData =
  //   (await generateVideoLessonResponse.json()) as GenerateVideoLessonResponse;
  return {
    textLessonData,
    videoLessonData: mockVideoLessonDataDemo,
  };
}
