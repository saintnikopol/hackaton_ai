import { Alert, Button, Stack, Paper, Typography } from "@mui/material";
import { useTranscribeSpeech } from "./features/transcribe-speech";

export default function App() {
  const { isCapturing, transcriptLines, status, stopCapture, startCapture } =
    useTranscribeSpeech();

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
          {transcriptLines.length === 0 ? (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontStyle: "italic" }}
            >
              (No speech detected yet…)
            </Typography>
          ) : (
            transcriptLines.map((line, idx) => (
              <Typography
                key={idx}
                variant={idx === transcriptLines.length - 1 ? "h6" : "body1"}
                sx={{
                  wordBreak: "break-word",
                  mb: idx === transcriptLines.length - 1 ? 0 : 0.5,
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
