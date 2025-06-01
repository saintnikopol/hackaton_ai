import { Alert, Button, Stack, Paper, Typography, Box } from "@mui/material";
import {
  useTranscribeSpeech,
  type UseTranscribeSpeechProps,
} from "@/features/transcribe-speech";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { analyseSegment } from "../../api/analyseSegment";
import type { AnalyzeSegmentResponse } from "../../model/types/segmentFeedback";
import { generateLesson } from "../../api/generateLesson";
import { StringDiff } from "../StringDiff/StringDiff";
import ReactPlayer from "react-player";

export function FeedbackList() {
  const [transcriptionSegments, setTranscriptionSegments] = useState<string[]>(
    [],
  );
  const [feedbacks, setFeedbacks] = useState<AnalyzeSegmentResponse[]>([]);

  const analyseSegmentMunation = useMutation({
    mutationFn: analyseSegment,
  });
  const generateLessonMutation = useMutation({
    mutationFn: generateLesson,
  });

  const handleNewTranscriptionLine: UseTranscribeSpeechProps["onNewTranscriptionSegment"] =
    useCallback(
      (newSegment) => {
        console.log("newSegment", newSegment);
        if (true) {
          // __AUTO_GENERATED_PRINT_VAR_START__
          console.log(
            "FeedbackList#(anon)#if newSegment.completed:",
            newSegment.completed,
          ); // __AUTO_GENERATED_PRINT_VAR_END__
          setTranscriptionSegments((existingSegments) => [
            ...existingSegments,
            newSegment.text,
          ]);
          analyseSegmentMunation
            .mutateAsync(newSegment.text)
            .then((response) => {
              // __AUTO_GENERATED_PRINT_VAR_START__
              console.log("FeedbackList#(anon)#if#(anon) response:", response); // __AUTO_GENERATED_PRINT_VAR_END__
              if (!response.hasError) return;
              setFeedbacks((existingFeedbacks) => [
                ...existingFeedbacks,
                response,
              ]);
            });
        }
      },
      [analyseSegmentMunation],
    );

  const { isCapturing, status, stopCapture, startCapture } =
    useTranscribeSpeech({
      onNewTranscriptionSegment: handleNewTranscriptionLine,
    });

  const handleGenerateLesson = useCallback(() => {
    const lessonTranscription = transcriptionSegments.join("\n");
    generateLessonMutation.mutate(lessonTranscription);
  }, [generateLessonMutation, transcriptionSegments]);

  if (generateLessonMutation.isSuccess && !isCapturing) {
    return (
      <Stack
        elevation={3}
        sx={{
          p: 2,
          margin: "40px auto",
          borderRadius: 2,
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        {/* <ReactPlayer url={generateLessonMutation.data.videoLessonData.url} /> */}
        <ReactPlayer
          url={generateLessonMutation.data.videoLessonData.url}
          controls={true} // ← додаємо контрол (керування)
          width="400px" // (опціонально) заповнює ширину контейнера
          height="auto" // (опціонально) зберігає співвідношення сторін
        />
        <Stack>
          <Typography>
            {generateLessonMutation.data.textLessonData.data?.lesson}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Top 3 Biggest Mistakes
          </Typography>
          <Typography
            component="ul"
            variant="body1"
            sx={{
              listStyleType: "disc",
              pl: 2, // add left padding so bullets aren’t flush left
              m: 0, // remove default margins if you want
            }}
          >
            {generateLessonMutation.data.textLessonData.errors.map(
              (error, idx) => {
                return (
                  <Alert
                    key={idx}
                    sx={{
                      mb: idx === feedbacks.length - 1 ? 0 : 0.5,
                    }}
                    severity="info"
                  >
                    <Box display="flex" flexDirection="column" gap={1}>
                      <StringDiff
                        original={error.original}
                        modified={error.correction}
                      />
                      <Typography variant="body2">
                        {error.description}
                      </Typography>
                    </Box>
                  </Alert>
                );
              },
            )}
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        maxWidth: 600,
        margin: "40px auto",
        borderRadius: 2,
      }}
    >
      <Stack gap={2} sx={{ width: "100%" }}>
        <Button
          variant="contained"
          color={isCapturing ? "error" : "primary"}
          onClick={isCapturing ? stopCapture : startCapture}
        >
          {isCapturing ? "Stop" : "Start"}
        </Button>
        {!isCapturing && (
          <Button onClick={handleGenerateLesson}>Generate lesson</Button>
        )}

        <Alert severity={isCapturing ? "info" : "warning"}>{status}</Alert>

        <Stack gap={2} sx={{ width: "100%", flexDirection: "column-reverse" }}>
          {feedbacks.map(({ original, correction, description }, idx) => (
            <Alert
              key={idx}
              sx={{
                mb: idx === feedbacks.length - 1 ? 0 : 0.5,
              }}
              severity="warning"
            >
              <StringDiff original={original} modified={correction} />
              {description}
            </Alert>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
