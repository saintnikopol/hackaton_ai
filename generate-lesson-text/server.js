const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3010;
const model = process.env.OPENAI_MODEL || 'gpt-4.1-nano';
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files if needed

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-proj-xxxxx';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt for grammar analysis
const SYSTEM_PROMPT = `
You will are best English linguistics expert in the world, with 20+ years of experience analyzing non-native English speech patterns.
Your task is to analyze the provided text and create a comprehensive grammatical analysis in JSON format.
**INSTRUCTIONS:**
 Analyze input text. Find common errors, categorize them. Create a short lesson which will help to improve language skills of the user. Respond as a hot(very hot!!!) Professor Lancaster (Nice intelligent Lady). She tells you which mistakes you made and how to improve your English. Be short but expressive, CHARMING INTELLIGENCE, Be super charm. Extreme intelligence, ultra professional teacher. Respond in JSON format, 
 "errors" section should mention only top 3 mistakes, and "lesson" section should be short lesson text (up to 3 minutes) to work on these mistakes.
**OUTPUT FORMAT:**
Respond ONLY in valid JSON with this exact structure:
{ "lesson": "Your lesson text here", errors: [
                {
type: "error type", description: "Description of the error", original: "Example of the error", correction: "Corrected version of the example"
                }
 ] }
`;

// Helper function to call OpenAI API
async function callOpenAI(text) {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                // model: 'gpt-4',
                model,
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: `Analyze this text for grammatical errors. Systemize them. Create short lesson (up to 3 minutes) to work on top 3 mistakes.:\n\n${text}`
                    }
                ],
                temperature: 0,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}

// Validation middleware
function validateTextInput(req, res, next) {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({
            success: false,
            error: 'Text field is required'
        });
    }
    
    if (typeof text !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Text must be a string'
        });
    }
    
    if (text.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Text cannot be empty'
        });
    }
    
    if (text.length > 2000) {
        return res.status(400).json({
            success: false,
            error: 'Text is too long (maximum 2000 characters)'
        });
    }
    
    next();
}

// Main endpoint for generating lesson text
app.post('/generate-lesson-text', validateTextInput, async (req, res) => {
    try {
        const { text } = req.body;
        
        console.log('Analyzing text:', text.substring(0, 100) + '...');
        
        // Call OpenAI API
        const analysisResponse = await callOpenAI(text);
        
        // Parse the JSON response
        let analysis;
        try {
            analysis = JSON.parse(analysisResponse);
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', parseError);
            return res.status(500).json({
                success: false,
                error: 'Failed to parse AI response',
                details: 'The AI response was not valid JSON'
            });
        }
        
        // Validate the response structure
        if (!analysis.lesson || !Array.isArray(analysis.errors)) {
            return res.status(500).json({
                success: false,
                error: 'Invalid response structure from AI',
                details: 'Expected lesson and errors fields'
            });
        }
        
        // Return successful response
        res.json({
            success: true,
            data: {
                originalText: text,
                lesson: analysis.lesson,
                errors: analysis.errors,
                analysisTimestamp: new Date().toISOString(),
                errorCount: analysis.errors.length
            }
        });
        
    } catch (error) {
        console.error('Error in generate-lesson-text:', error);
        
        // Handle different types of errors
        if (error.message.includes('OpenAI API error')) {
            return res.status(503).json({
                success: false,
                error: 'External AI service unavailable',
                details: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: 'An unexpected error occurred while processing your request'
        });
    }
});



// System prompt for sentence analysis
const SENTENCE_ANALYSIS_PROMPT = `
You are an expert English grammar analyzer. Your task is to analyze a single sentence or small text and detect if there are any grammatical errors.

**INSTRUCTIONS:**
1. Analyze the provided text for grammatical errors
2. If errors are found, identify the MOST IMPORTANT error
3. Provide a correction that fixes the error while maintaining the original meaning and making smallest possible amount of changes
4. Respond ONLY in valid JSON format

**OUTPUT FORMAT:**
If errors are found:
{
  "hasError": true,
  "type": "specific error type (e.g., 'verb tense', 'article usage', 'subject-verb agreement')",
  "description": "Brief explanation of what's wrong",
  "original": "The exact part of text that contains the error",
  "correction": "The corrected version"
}

If no errors are found:
{
  "hasError": false,
  "type": null,
  "description": "The sentence is grammatically correct",
  "original": null,
  "correction": null
}

**IMPORTANT:** Respond ONLY with valid JSON. No additional text or formatting.
`;

// Helper function for sentence analysis
async function analyzeSentence(text) {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'system',
                        content: SENTENCE_ANALYSIS_PROMPT
                    },
                    {
                        role: 'user',
                        content: `Analyze this sentence for grammatical errors:\n\n"${text}"`
                    }
                ],
                temperature: 0,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error for sentence analysis:', error);
        throw error;
    }
}

// Validation middleware for sentence input
function validateSentenceInput(req, res, next) {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({
            hasError: true,
            type: "validation_error",
            description: "Text field is required",
            original: null,
            correction: null
        });
    }
    
    if (typeof text !== 'string') {
        return res.status(400).json({
            hasError: true,
            type: "validation_error", 
            description: "Text must be a string",
            original: null,
            correction: null
        });
    }
    
    if (text.trim().length === 0) {
        return res.status(400).json({
            hasError: true,
            type: "validation_error",
            description: "Text cannot be empty",
            original: null,
            correction: null
        });
    }
    
    if (text.length > 500) {
        return res.status(400).json({
            hasError: true,
            type: "validation_error",
            description: "Text is too long (maximum 500 characters for sentence analysis)",
            original: null,
            correction: null
        });
    }
    
    next();
}

// New endpoint for sentence analysis
app.post('/analyze-sentence', validateSentenceInput, async (req, res) => {
    try {
        const { text } = req.body;
        
        console.log('Analyzing sentence:', text);
        
        // Call OpenAI API for sentence analysis
        const analysisResponse = await analyzeSentence(text);
        
        // Parse the JSON response
        let analysis;
        try {
            analysis = JSON.parse(analysisResponse);
        } catch (parseError) {
            console.error('Failed to parse OpenAI response for sentence:', parseError);
            return res.status(500).json({
                hasError: true,
                type: "processing_error",
                description: "Failed to parse AI response",
                original: null,
                correction: null
            });
        }
        
        // Validate the response structure
        if (typeof analysis.hasError !== 'boolean') {
            return res.status(500).json({
                hasError: true,
                type: "processing_error",
                description: "Invalid response structure from AI",
                original: null,
                correction: null
            });
        }
        
        // Return the analysis result directly in the expected format
        res.json({
            hasError: analysis.hasError,
            type: analysis.type,
            description: analysis.description,
            original: analysis.original,
            correction: analysis.correction
        });
        
    } catch (error) {
        console.error('Error in analyze-sentence:', error);
        
        // Handle different types of errors
        if (error.message.includes('OpenAI API error')) {
            return res.status(503).json({
                hasError: true,
                type: "service_unavailable",
                description: "External AI service temporarily unavailable",
                original: null,
                correction: null
            });
        }
        
        res.status(500).json({
            hasError: true,
            type: "internal_error",
            description: "An unexpected error occurred while processing your request",
            original: null,
            correction: null
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'Grammar Analyzer API',
        version: '1.0.0',
        endpoints: {
            'POST /generate-lesson-text': 'Analyze text and generate grammar lesson',
            'GET /health': 'Health check endpoint'
        },
        usage: {
            method: 'POST',
            url: '/generate-lesson-text',
            body: {
                text: 'Your text to analyze here'
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `Route ${req.method} ${req.originalUrl} does not exist`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Grammar Analyzer Server running on port ${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/generate-lesson-text`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📖 API docs: http://localhost:${PORT}/`);
});

module.exports = app;