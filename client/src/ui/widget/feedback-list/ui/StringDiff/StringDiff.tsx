import { Typography } from "@mui/material";
import { diffWords } from "diff";

interface StringDiffProps {
  /**
   * The “original” string (i.e., before editing).
   * E.g. "I can look very busy"
   */
  original: string;

  /**
   * The “modified” string (i.e., after editing).
   * E.g. "I can looking very busy"
   */
  modified: string;
}

/**
 * Renders two lines showing word-level differences between `original` and `modified`.
 * Added words in `modified` are bolded in the top line.
 * Removed words in `original` are bolded in the bottom line.
 */
export function StringDiff({ original, modified }: StringDiffProps) {
  // Compute a word-level diff array
  // Each part has: { value: string; added?: boolean; removed?: boolean }
  const diffParts = diffWords(original, modified);

  // Build two arrays of React nodes:
  //  • `modifiedNodes`: show all parts that are not “removed.”
  //      – if part.added: wrap in bold
  //      – otherwise: render normally
  //  • `originalNodes`: show all parts that are not “added.”
  //      – if part.removed: wrap in bold
  //      – otherwise: render normally
  const modifiedNodes = diffParts.map((part, idx) => {
    if (part.removed) {
      // skip removed pieces in the “modified” line
      return null;
    }
    if (part.added) {
      return (
        <Typography component="span" fontWeight="bold" key={idx}>
          {part.value}
        </Typography>
      );
    }
    // unchanged
    return (
      <Typography component="span" key={idx}>
        {part.value}
      </Typography>
    );
  });

  const originalNodes = diffParts.map((part, idx) => {
    if (part.added) {
      // skip added pieces in the “original” line
      return null;
    }
    if (part.removed) {
      return (
        <Typography component="span" fontWeight="bold" key={idx}>
          {part.value}
        </Typography>
      );
    }
    // unchanged
    return (
      <Typography component="span" key={idx}>
        {part.value}
      </Typography>
    );
  });

  return (
    <>
      {/* Original string (with removals bolded) */}
      <Typography
        variant="body1"
        sx={{
          "&::first-letter": { textTransform: "uppercase" },
        }}
      >
        {originalNodes}
      </Typography>

      {/* Modified string (with additions bolded) */}
      <Typography
        variant="body1"
        sx={{
          "&::first-letter": { textTransform: "uppercase" },
        }}
      >
        {modifiedNodes}
      </Typography>
    </>
  );
}

export default StringDiff;
