//  curl -X POST http://localhost:3010/generate-lesson-text \
//   -H "Content-Type: application/json" \
//   -d '{
//     "text": "My biggest strength is I am very good at sleeping with eyes open during meetings. Also, I can looking very busy when I actually doing nothing important."
//   }'


const z = {
  success: true,
  data: {
    originalText:
      "My biggest strength is I am very good at sleeping with eyes open during meetings. Also, I can looking very busy when I actually doing nothing important.",
    lesson:
      "Darling, your sentence is charming but contains some delightful grammatical quirks. First, remember that after 'My biggest strength is,' you should use a noun or noun phrase, not a clause starting with 'I am.' Second, 'can looking' is incorrect; it should be 'can look' because 'can' is followed by the base form of the verb. Third, 'doing' should be 'do' in this context, as it follows 'am actually.' Practice these points by constructing sentences with proper verb forms and sentence structures. Keep practicing, and your English will sparkle even brighter!",
    errors: [
      {
        type: "sentence structure",
        description:
          "Incorrect use of a clause after 'My biggest strength is'.",
        original:
          "My biggest strength is I am very good at sleeping with eyes open during meetings.",
        correction:
          "My biggest strength is being very good at sleeping with eyes open during meetings.",
      },
      {
        type: "verb form",
        description: "Incorrect verb form after 'can'.",
        original: "I can looking very busy",
        correction: "I can look very busy",
      },
      {
        type: "verb tense",
        description: "Incorrect verb form after 'actually'.",
        original: "when I actually doing nothing important",
        correction: "when I am actually doing nothing important",
      },
    ],
    analysisTimestamp: "2025-05-31T18:19:56.822Z",
    errorCount: 3,
  },
};