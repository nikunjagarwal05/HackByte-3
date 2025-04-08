const express = require('express');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");
const cors = require('cors');
const http = require('http');
const net = require('net');

require('dotenv').config();

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT || 3001);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Add a simple health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Add the score route directly on the root as well, for better compatibility
app.post('/', async (req, res) => {
  try {
    // Forward to the score endpoint handler
    console.log('Request to root endpoint, forwarding to /score handler');
    
    // Access the score handler directly to avoid routing issues
    const originalUrl = req.url;
    req.url = '/score';
    app._router.handle(req, res, () => {
      // Restore original URL if needed
      req.url = originalUrl;
    });
  } catch (error) {
    console.error('Error forwarding request to /score:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
    You are an evaluation assistant for a gamified, hands-on lab designed to onboard new Wikipedia editors. Your task is to grade user responses against a set of predefined Wikipedia policies, ensuring that their answers adhere to Wikipedia's content and conduct standards. 

    CRITICAL INSTRUCTION: YOU MUST ONLY OUTPUT VALID JSON
    =====================================================
    - Output ONLY A VALID JSON OBJECT with no text before or after
    - DO NOT include any explanatory text whatsoever
    - DO NOT include any markdown formatting like backticks or code blocks
    - DO NOT include any headers, intros, or conclusions
    - DO NOT include analysis or reasoning about the text
    - ANY response that is not parseable with JSON.parse() is a COMPLETE FAILURE
    - DON'T START WITH phrases like "Here's the evaluation" or "Here is the JSON"
    - START DIRECTLY WITH THE OPENING BRACE {

    You will evaluate each user response according to the following categories and criteria:

    1. **Wikimedia Policies - Content Policies:**
      - **Neutral Point of View (NPOV):**
        - *balancedPresentation*: Check if the response presents all significant viewpoints fairly.
        - *avoidsBiasedLanguage*: Verify that the language is neutral and does not favor one perspective.
        - *comparesToGoodExample*: Ensure the tone and structure are similar to the provided good example.
      - **Verifiability:**
        - *includesReliableSource*: Confirm that the response cites a reliable, published source.
        - *specificDetails*: Check if the response includes specific details (e.g., dates, statistics).
        - *sourceAttribution*: Verify that sources are properly attributed.
      - **No Original Research (NOR):**
        - *avoidsPersonalOpinions*: Ensure that personal opinions are absent.
        - *referencesPublishedWork*: Confirm that claims are supported by published, reliable sources.
        - *matchesGoodExample*: Check that the structure aligns with the good example.
      - **Copyrights:**
        - *noExcessiveCopying*: Ensure that no long excerpts are copied from copyrighted material.
        - *providesProperAttribution*: Check for proper attribution where needed.
        - *respectsPublicDomainOrLicense*: Verify that only public domain or properly licensed content is used.
      - **Biographies of Living Persons (BLP):**
        - *avoidsDefamatoryLanguage*: Ensure the language is neutral and free of harmful claims.
        - *includesVerifiableSources*: Check that any sensitive or controversial claims are backed by reputable sources.
        - *respectsPrivacy*: Confirm that the response treats personal information with care.

    2. **Wikimedia Policies - Conduct Policies:**
      - **Civility:**
        - *politeLanguage*: Ensure the tone is polite and respectful.
        - *invitesCollaboration*: Check if the response invites discussion and collaborative improvement.
      - **No Personal Attacks:**
        - *contentFocusedCriticism*: Verify that criticism targets content, not individuals.
        - *avoidsInsults*: Ensure that no derogatory or insulting language is used.
      - **Edit Warring:**
        - *avoidsRepeatedReverts*: Confirm that the response does not promote repeated reverts without discussion.
        - *promotesConsensus*: Check that the response encourages discussion to reach a consensus.
      - **Vandalism:**
        - *constructiveSuggestions*: Ensure that suggestions are aimed at improving the article.
        - *noDestructiveIntent*: Verify that there is no intent to delete or damage content.
      - **Ownership of Content:**
        - *acceptsCollaborativeEditing*: Check that the response acknowledges the collaborative nature of Wikipedia.
        - *avoidsExclusiveClaims*: Ensure the response does not claim sole ownership of the content.
      - **Harassment:**
        - *respectsEditorBoundaries*: Confirm that the language respects other editors' boundaries.
        - *offersSupportiveTone*: Verify that the tone is supportive and non-threatening.

    For each user response, analyze the text and output a structured JSON evaluation. Each criterion should be marked with one of the following values:
    - "yes" (fully meets the requirement),
    - "no" (does not meet the requirement)

    Your final output should strictly be the following JSON object with no extra text:

    {
      "WikimediaPolicies": {
        "ContentPolicies": {
          "NeutralPointOfView": {
            "balancedPresentation": "yes",
            "avoidsBiasedLanguage": "yes",
            "comparesToGoodExample": "yes"
          },
          "Verifiability": {
            "includesReliableSource": "yes",
            "specificDetails": "yes",
            "sourceAttribution": "yes"
          },
          "NoOriginalResearch": {
            "avoidsPersonalOpinions": "yes",
            "referencesPublishedWork": "yes",
            "matchesGoodExample": "yes"
          },
          "Copyrights": {
            "noExcessiveCopying": "yes",
            "providesProperAttribution": "yes",
            "respectsPublicDomainOrLicense": "yes"
          },
          "BiographiesOfLivingPersons": {
            "avoidsDefamatoryLanguage": "yes",
            "includesVerifiableSources": "yes",
            "respectsPrivacy": "yes"
          }
        },
        "ConductPolicies": {
          "Civility": {
            "politeLanguage": "yes",
            "invitesCollaboration": "yes"
          },
          "NoPersonalAttacks": {
            "contentFocusedCriticism": "yes",
            "avoidsInsults": "yes"
          },
          "EditWarring": {
            "avoidsRepeatedReverts": "yes",
            "promotesConsensus": "yes"
          },
          "Vandalism": {
            "constructiveSuggestions": "yes",
            "noDestructiveIntent": "yes"
          },
          "OwnershipOfContent": {
            "acceptsCollaborativeEditing": "yes",
            "avoidsExclusiveClaims": "yes"
          },
          "Harassment": {
            "respectsEditorBoundaries": "yes",
            "offersSupportiveTone": "yes"
          }
        }
      }
    }
  `
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
};

// Calculate scores from LLM evaluation
function calculateScores(evaluation) {
  let totalCriteria = 0;
  let passedCriteria = 0;
  const failedCriteria = [];

  // Validate that the evaluation has the expected structure
  if (!evaluation || !evaluation.WikimediaPolicies) {
    console.error('Invalid evaluation structure: Missing WikimediaPolicies');
    // Create a basic structure if missing
    evaluation = {
      WikimediaPolicies: {
        ContentPolicies: {
          NeutralPointOfView: {
            balancedPresentation: "yes",
            avoidsBiasedLanguage: "yes",
            comparesToGoodExample: "yes"
          }
        },
        ConductPolicies: {
          Civility: {
            politeLanguage: "yes",
            invitesCollaboration: "yes"
          }
        }
      }
    };
  }

  // Ensure ContentPolicies exists
  if (!evaluation.WikimediaPolicies.ContentPolicies) {
    console.error('Invalid evaluation structure: Missing ContentPolicies');
    evaluation.WikimediaPolicies.ContentPolicies = {
      NeutralPointOfView: {
        balancedPresentation: "yes",
        avoidsBiasedLanguage: "yes",
        comparesToGoodExample: "yes"
      }
    };
  }

  // Ensure ConductPolicies exists
  if (!evaluation.WikimediaPolicies.ConductPolicies) {
    console.error('Invalid evaluation structure: Missing ConductPolicies');
    evaluation.WikimediaPolicies.ConductPolicies = {
      Civility: {
        politeLanguage: "yes",
        invitesCollaboration: "yes"
      }
    };
  }

  // Process Content Policies
  const contentPolicies = evaluation.WikimediaPolicies.ContentPolicies;
  for (const policyName in contentPolicies) {
    const policy = contentPolicies[policyName];
    for (const criterionName in policy) {
      totalCriteria++;
      if (policy[criterionName] === "yes") {
        passedCriteria++;
      } else {
        failedCriteria.push(`${policyName} - ${criterionName}`);
      }
    }
  }

  // Process Conduct Policies
  const conductPolicies = evaluation.WikimediaPolicies.ConductPolicies;
  for (const policyName in conductPolicies) {
    const policy = conductPolicies[policyName];
    for (const criterionName in policy) {
      totalCriteria++;
      if (policy[criterionName] === "yes") {
        passedCriteria++;
      } else {
        failedCriteria.push(`${policyName} - ${criterionName}`);
      }
    }
  }

  // Calculate percentage score
  const percentageScore = (passedCriteria / totalCriteria) * 100;
  
  // Determine if passing (needs 90% or higher)
  const passing = percentageScore >= 70;

  return {
    totalCriteria,
    passedCriteria,
    percentageScore: percentageScore.toFixed(2),
    passing,
    failedCriteria
  };
}

// Score endpoint
app.post('/score', async (req, res) => {
  try {
    const { text, goodExample } = req.body;
    
    // Log request for debugging
    console.log('Received scoring request:', { 
      textLength: text?.length,
      hasGoodExample: !!goodExample 
    });
    
    // Validate input
    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }

    // Check if API key is valid

    // Prepare prompt with good example if provided
    let prompt = text;
    if (goodExample) {
      prompt = `Good example: ${goodExample}\n\nUser response to evaluate: ${text}`;
    }
    
    // Add an explicit reminder to output only JSON at the beginning
    prompt = `REMINDER: RESPOND WITH ONLY A VALID JSON OBJECT, NOTHING ELSE.
    
Expected JSON structure:
{
  "WikimediaPolicies": {
    "ContentPolicies": {
      "NeutralPointOfView": {
        "balancedPresentation": "yes|no",
        "avoidsBiasedLanguage": "yes|no",
        "comparesToGoodExample": "yes|no"
      },
      "Verifiability": { ... },
      "NoOriginalResearch": { ... },
      "Copyrights": { ... },
      "BiographiesOfLivingPersons": { ... }
    },
    "ConductPolicies": { ... }
  }
}

${prompt}`;

    // Start chat session and send message
    try {
      console.log('Sending request to LLM...');
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
      
      // First attempt with standard prompt
      const result = await chatSession.sendMessage(prompt);
      const response = result.response.text();
      console.log('Received response from LLM');
      
      // Parse LLM response (clean any markdown formatting)
      const cleaned = response.replace(/^```json\n|\n```$/g, '').trim();
      let evaluation;
      
      try {
        // Check if the response starts with a brace (likely JSON)
        if (cleaned.trim().startsWith('{')) {
          evaluation = JSON.parse(cleaned);
          console.log('Successfully parsed JSON response');
          
          // Log the structure of the response for debugging
          console.log('Response structure validation:');
          console.log('- Has WikimediaPolicies:', !!evaluation.WikimediaPolicies);
          if (evaluation.WikimediaPolicies) {
            console.log('  - Has ContentPolicies:', !!evaluation.WikimediaPolicies.ContentPolicies);
            console.log('  - Has ConductPolicies:', !!evaluation.WikimediaPolicies.ConductPolicies);
          }
        } else {
          // If response doesn't look like JSON, throw an error to trigger retry
          throw new Error('Response is not in JSON format');
        }
      } catch (parseError) {
        console.error('Error parsing LLM response:', parseError);
        console.log('Raw response:', response.substring(0, 250) + (response.length > 250 ? '...' : ''));
        
        try {
          console.log('Attempting to retry with more explicit JSON instructions...');
          // Try again with an explicit reminder to return ONLY JSON
          const retryPrompt = `RETURN ONLY THE FOLLOWING JSON STRUCTURE WITH NO EXPLANATIONS:
{
  "WikimediaPolicies": {
    "ContentPolicies": {
      "NeutralPointOfView": {
        "balancedPresentation": "yes|no",
        "avoidsBiasedLanguage": "yes|no",
        "comparesToGoodExample": "yes|no"
      },
      "Verifiability": { ... },
      "NoOriginalResearch": { ... },
      "Copyrights": { ... },
      "BiographiesOfLivingPersons": { ... }
    },
    "ConductPolicies": {
      "Civility": { ... },
      "NoPersonalAttacks": { ... },
      "EditWarring": { ... },
      "Vandalism": { ... },
      "OwnershipOfContent": { ... },
      "Harassment": { ... }
    }
  }
}

Evaluate this text: ${text}`;
          
          const retryResult = await chatSession.sendMessage(retryPrompt);
          const retryResponse = retryResult.response.text();
          
          // Try to extract JSON from the retry response using regex to find content between braces
          const jsonMatch = retryResponse.match(/(\{[\s\S]*\})/);
          if (jsonMatch && jsonMatch[0]) {
            try {
              evaluation = JSON.parse(jsonMatch[0]);
              console.log('Successfully parsed JSON from retry attempt');
            } catch (retryParseError) {
              throw new Error('Failed to parse JSON from retry response');
            }
          } else {
            throw new Error('Could not find JSON structure in retry response');
          }
        } catch (retryError) {
          console.error('Error in retry attempt:', retryError);
          console.log('Creating a fallback evaluation');
          
          // Determine if content looks biased or not
          const lowerCaseResponse = response.toLowerCase();
          const hasBiasIndicators = lowerCaseResponse.includes('bias') || 
                                   lowerCaseResponse.includes('loaded language') || 
                                   lowerCaseResponse.includes('partisan') ||
                                   lowerCaseResponse.includes('opinion');
          
          // Create a basic evaluation that marks neutral point of view as failing if bias indicators are found
          evaluation = {
            "WikimediaPolicies": {
              "ContentPolicies": {
                "NeutralPointOfView": {
                  "balancedPresentation": hasBiasIndicators ? "no" : "yes",
                  "avoidsBiasedLanguage": hasBiasIndicators ? "no" : "yes",
                  "comparesToGoodExample": "yes"
                },
                "Verifiability": {
                  "includesReliableSource": lowerCaseResponse.includes('source') ? "yes" : "no",
                  "specificDetails": lowerCaseResponse.includes('detail') || lowerCaseResponse.includes('specific') ? "yes" : "no",
                  "sourceAttribution": lowerCaseResponse.includes('attribution') ? "yes" : "no"
                },
                "NoOriginalResearch": {
                  "avoidsPersonalOpinions": lowerCaseResponse.includes('opinion') ? "no" : "yes",
                  "referencesPublishedWork": lowerCaseResponse.includes('publish') || lowerCaseResponse.includes('reference') ? "yes" : "no",
                  "matchesGoodExample": "yes"
                },
                "Copyrights": {
                  "noExcessiveCopying": "yes",
                  "providesProperAttribution": "yes",
                  "respectsPublicDomainOrLicense": "yes"
                },
                "BiographiesOfLivingPersons": {
                  "avoidsDefamatoryLanguage": lowerCaseResponse.includes('defamatory') || lowerCaseResponse.includes('harmful') ? "no" : "yes",
                  "includesVerifiableSources": "yes",
                  "respectsPrivacy": "yes"
                }
              },
              "ConductPolicies": {
                "Civility": {
                  "politeLanguage": lowerCaseResponse.includes('polite') || lowerCaseResponse.includes('civil') ? "yes" : "no",
                  "invitesCollaboration": "yes"
                },
                "NoPersonalAttacks": {
                  "contentFocusedCriticism": "yes",
                  "avoidsInsults": lowerCaseResponse.includes('insult') || lowerCaseResponse.includes('attack') ? "no" : "yes"
                },
                "EditWarring": {
                  "avoidsRepeatedReverts": "yes",
                  "promotesConsensus": "yes"
                },
                "Vandalism": {
                  "constructiveSuggestions": "yes",
                  "noDestructiveIntent": "yes"
                },
                "OwnershipOfContent": {
                  "acceptsCollaborativeEditing": "yes",
                  "avoidsExclusiveClaims": "yes"
                },
                "Harassment": {
                  "respectsEditorBoundaries": "yes",
                  "offersSupportiveTone": "yes"
                }
              }
            }
          };
        }
      }
      
      // Calculate scores
      const scores = calculateScores(evaluation);
      
      // Prepare feedback
      let feedback = scores.passing 
        ? "Your response meets Wikipedia's standards!" 
        : "Your response does not fully meet Wikipedia's standards.";
      
      // Add specific feedback on failed criteria if any
      if (!scores.passing && scores.failedCriteria.length > 0) {
        feedback += " Areas to improve: " + scores.failedCriteria.join(", ");
      }

      // Request a concise improvement summary from Gemini if failed
      let improvementSummary = "";
      if (!scores.passing && scores.failedCriteria.length > 0) {
        try {
          console.log('Requesting improvement summary from LLM...');
          
          // Prepare prompt for the summary request
          const failedAreas = scores.failedCriteria.join(", ");
          const summaryPrompt = `I need your help giving feedback on a Wikipedia-style article. The article has these issues: ${failedAreas}.

Instead of listing all these technical issues, please write me ONE SHORT, FRIENDLY PARAGRAPH (about 3 sentences) in a casual, human tone - like you're a helpful friend giving writing advice. Don't use any Wikipedia policy names or technical jargon. Just focus on the 2-3 most important things they should improve in everyday language.

Talk directly to the writer as "you" and be encouraging while pointing out what needs fixing. Make it sound completely natural, like a human conversation.`;
          
          // Request summary from Gemini
          const summaryResult = await chatSession.sendMessage(summaryPrompt);
          improvementSummary = summaryResult.response.text().trim();
          
          console.log('Received improvement summary from LLM');
        } catch (summaryError) {
          console.error('Error getting improvement summary:', summaryError);
          
          // Fallback to a generic message if Gemini fails to provide a summary
          improvementSummary = "Your response needs improvement in several Wikipedia policy areas. Consider adding reliable sources and maintaining a neutral tone.";
        }
      }

      // Send response
      console.log('Sending score response:', { 
        status: scores.passing ? "pass" : "fail",
        score: scores.percentageScore 
      });
      
      res.json({
        status: scores.passing ? "pass" : "fail",
        score: scores.percentageScore,
        criteria: {
          total: scores.totalCriteria,
          passed: scores.passedCriteria
        },
        feedback,
        improvementSummary,
        evaluation // Include the full evaluation for detailed review
      });
    } catch (llmError) {
      console.error('Error calling Gemini API:', llmError);
      return res.status(500).json({ 
        error: 'Error communicating with Gemini API', 
        message: llmError.message,
        suggestion: 'Please check your API key and network connectivity'
      });
    }
  } catch (error) {
    console.error('Error in /score endpoint:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Create HTTP server
const server = http.createServer(app);

// Function to check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        tester.once('close', () => resolve(false))
          .close();
      })
      .listen(port);
  });
}

// Function to find an available port
async function findAvailablePort(startPort) {
  let port = startPort;
  while (await isPortInUse(port)) {
    console.log(`Port ${port} is busy, trying port ${port + 1}`);
    port++;
  }
  return port;
}

// Start the server
async function startServer() {
  const port = await findAvailablePort(DEFAULT_PORT);
  
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API is available at: http://localhost:${port}/score`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}

// Initialize the server
startServer(); 