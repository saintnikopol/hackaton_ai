import { Alert, Button, Stack, Paper, Typography } from "@mui/material";
import {
  useTranscribeSpeech,
  type UseTranscribeSpeechProps,
} from "@/features/transcribe-speech";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { analyseSegment } from "../../api/analyseSegment";
import type { AnalyzeSegmentResponse } from "../../model/types/segmentFeedback";

export function FeedbackList() {
  const [transcriptionSegments, setTranscriptionSegments] = useState<string[]>(
    [],
  );
  const [feedbacks, setFeedbacks] = useState<AnalyzeSegmentResponse[]>([]);

  const mutation = useMutation({
    mutationFn: analyseSegment,
  });

  const handleNewTranscriptionLine: UseTranscribeSpeechProps["onNewTranscriptionSegment"] =
    useCallback(
      (newSegment) => {
        console.log("newSegment", newSegment);
        if (newSegment.completed) {
          // __AUTO_GENERATED_PRINT_VAR_START__
          console.log(
            "FeedbackList#(anon)#if newSegment.completed:",
            newSegment.completed,
          ); // __AUTO_GENERATED_PRINT_VAR_END__
          setTranscriptionSegments((existingSegments) => [
            ...existingSegments,
            newSegment.text,
          ]);
          mutation.mutateAsync(newSegment.text).then((response) => {
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
      [mutation],
    );

  const { isCapturing, status, stopCapture, startCapture } =
    useTranscribeSpeech({
      onNewTranscriptionSegment: handleNewTranscriptionLine,
    });

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

        <Alert severity={isCapturing ? "info" : "warning"}>{status}</Alert>

        <Stack gap={2} sx={{ width: "100%" }}>
          {feedbacks.map(({ original, correction, description }, idx) => (
            <Alert
              key={idx}
              sx={{
                mb: idx === feedbacks.length - 1 ? 0 : 0.5,
              }}
              severity="warning"
            >
              <Typography
                component="span"
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-line", // ← honor "\n" as line breaks
                }}
              >
                {`${original}\n${correction}\n\n${description}`}
              </Typography>
            </Alert>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
