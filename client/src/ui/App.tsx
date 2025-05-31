import { useEffect } from "react";
import { Alert, Button, Stack } from "@mui/material";

function App() {
  useEffect(() => {
    console.log("here");
    window.electron.subscribeStatistics((data) => console.log(data));
  }, []);

  return (
    <Stack gap={1} sx={{ width: "100%" }}>
      <Button>Start</Button>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity="success">This is a success Alert.</Alert>
        <Alert severity="info">This is an info Alert.</Alert>
        <Alert severity="warning">This is a warning Alert.</Alert>
        <Alert severity="error">This is an error Alert.</Alert>
      </Stack>
    </Stack>
  );
}

export default App;
