//  curl -X POST http://localhost:3010/analyze-sentence \
//   -H "Content-Type: application/json" \
//   -d '{
  // "text": "I can looking very busy when I actually doing nothing important."
//   }'


//  curl -X POST http://localhost:3010/analyze-sentence \
//   -H "Content-Type: application/json" \
//   -d '{
//   "text": "I can looking very busy when I actually doing nothing important."
//   }'



const response = {
  hasError: true,
  type: "verb form and tense",
  description:
    "Incorrect verb forms after 'can' and 'doing' are used; 'can' should be followed by the base form 'look', and 'doing' should be 'am doing' for correct tense.",
  original:
    "I can looking very busy when I actually doing nothing important.",
  correction:
    "I can look very busy when I am actually doing nothing important.",
};




// curl -X POST http://localhost:3010/analyze-sentence \
//   -H "Content-Type: application/json" \
//   -d '{
//   "text": "I can look very busy when I am actually doing nothing important."
//   }'
const responseNoErrors = {
  hasError: false,
  type: null,
  description: "The sentence is grammatically correct",
  original: null,
  correction: null,
};