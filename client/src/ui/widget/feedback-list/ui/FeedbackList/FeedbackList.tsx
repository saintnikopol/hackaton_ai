import { Alert, Button, Stack, Paper, Typography } from "@mui/material";
import { useTranscribeSpeech } from "@/features/transcribe-speech";
import { useState } from "react";

export function FeedbackList() {
  const { isCapturing, status, stopCapture, startCapture } =
    useTranscribeSpeech({ onNewTranscriptionLine: () => {} });
  const [transcriptionLines, setTranscriptionLines] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<string[]>([]);

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

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            minHeight: 120,
            bgcolor: "#fafafa",
            overflowY: "auto",
          }}
        >
          {feedbacks.length === 0 ? (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontStyle: "italic" }}
            >
              (No speech detected yet…)
            </Typography>
          ) : (
            feedbacks.map((line, idx) => (
              <Typography
                key={idx}
                variant={idx === feedbacks.length - 1 ? "h6" : "body1"}
                sx={{
                  wordBreak: "break-word",
                  mb: idx === feedbacks.length - 1 ? 0 : 0.5,
                }}
              >
                {line}
              </Typography>
            ))
          )}
        </Paper>
      </Stack>
    </Paper>
  );
}
