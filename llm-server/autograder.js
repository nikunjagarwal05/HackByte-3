const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const fs = require("node:fs");
  const mime = require("mime-types");
  
  require('dotenv').config();
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
      You are an evaluation assistant for a gamified, hands-on lab designed to onboard new Wikipedia editors. Your task is to grade user responses against a set of predefined Wikipedia policies, ensuring that their answers adhere to Wikipedia’s content and conduct standards. 

      - Output only the raw JSON content without code block formatting or language tags.
      - Do NOT use backticks or ANY Markdown formatting in your output.

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
          - *respectsEditorBoundaries*: Confirm that the language respects other editors’ boundaries.
          - *offersSupportiveTone*: Verify that the tone is supportive and non-threatening.

      For each user response, analyze the text and output a structured JSON evaluation. Each criterion should be marked with one of the following values:
      - "yes" (fully meets the requirement),
      - "no" (does not meet the requirement)

      Your final output should strictly be a well-formatted JSON object:

      {
        "WikimediaPolicies": {
          "ContentPolicies": {
            "NeutralPointOfView": {
              "balancedPresentation": "<yes|no>",
              "avoidsBiasedLanguage": "<yes|no>",
              "comparesToGoodExample": "<yes|no>"
            },
            "Verifiability": {
              "includesReliableSource": "<yes|no>",
              "specificDetails": "<yes|no>",
              "sourceAttribution": "<yes|no>"
            },
            "NoOriginalResearch": {
              "avoidsPersonalOpinions": "<yes|no>",
              "referencesPublishedWork": "<yes|no>",
              "matchesGoodExample": "<yes|no>"
            },
            "Copyrights": {
              "noExcessiveCopying": "<yes|no>",
              "providesProperAttribution": "<yes|no>",
              "respectsPublicDomainOrLicense": "<yes|no>"
            },
            "BiographiesOfLivingPersons": {
              "avoidsDefamatoryLanguage": "<yes|no>",
              "includesVerifiableSources": "<yes|no>",
              "respectsPrivacy": "<yes|no>"
            }
          },
          "ConductPolicies": {
            "Civility": {
              "politeLanguage": "<yes|no>",
              "invitesCollaboration": "<yes|no>"
            },
            "NoPersonalAttacks": {
              "contentFocusedCriticism": "<yes|no>",
              "avoidsInsults": "<yes|no>"
            },
            "EditWarring": {
              "avoidsRepeatedReverts": "<yes|no>",
              "promotesConsensus": "<yes|no>"
            },
            "Vandalism": {
              "constructiveSuggestions": "<yes|no>",
              "noDestructiveIntent": "<yes|no>"
            },
            "OwnershipOfContent": {
              "acceptsCollaborativeEditing": "<yes|no>",
              "avoidsExclusiveClaims": "<yes|no>"
            },
            "Harassment": {
              "respectsEditorBoundaries": "<yes|no>",
              "offersSupportiveTone": "<yes|no>"
            }
          }
        }
      }

      Instructions:
      - Parse the user’s response carefully.
      - For each criterion, determine if the response fully meets ("yes"), does not meet ("no"), or only partially meets ("partial") the requirement.
      - Ensure that your response strictly follows the JSON format above.
      - Do not provide any additional commentary outside of the JSON object.
      - Your answer should only contain the JSON evaluation object.
    `

  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [
    ],
    responseMimeType: "text/plain",
  };
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  
    const input_prompt = "The recent policy implemented by the city council is an utter failure, and its supporters are clearly misguided. This policy, which some claim improves public safety, is nothing more than a ploy for political gain."
    const result = await chatSession.sendMessage(input_prompt);
    const candidates = result.response.candidates;
    for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
      for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
        const part = candidates[candidate_index].content.parts[part_index];
        if(part.inlineData) {
          try {
            const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
            fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
            console.log(`Output written to: ${filename}`);
          } catch (err) {
            console.error(err);
          }
        }
      }
    }

    const res = result.response.text();
    const cleaned = res.replace(/^```json\n|\n```$/g, '').trim();

    console.log(cleaned)
  }
  
  run();