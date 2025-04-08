# LLM Server for Wikipedia Editor Training

This server provides an API endpoint for evaluating user responses against Wikipedia's content and conduct policies using Google's Gemini 2.0 Flash model.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/)
   - Sign in with your Google account
   - Click on "Get API key" or "Manage API keys" if you already have one
   - Create a new API key and copy it

3. Create a `.env` file in the root directory (or edit the existing one) with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
PORT=3001
TEST_PORT=3001
API_HOST=localhost
```

4. Start the server:
```bash
# For production
npm start

# For development with auto-reload
npm run dev

# To run the test client (with server already running)
npm test

# To run both server and test client in debug mode
npm run debug
```

## API Usage

### Score Endpoint

**URL**: `/score`
**Method**: `POST`
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "text": "The text content to evaluate against Wikipedia policies",
  "goodExample": "(Optional) A good example to compare against"
}
```

**Response**:
```json
{
  "status": "pass" or "fail",
  "score": "95.24", // Percentage score
  "criteria": {
    "total": 27, // Total criteria evaluated
    "passed": 26 // Number of criteria passed
  },
  "feedback": "Your response meets Wikipedia's standards!", // Or feedback on what to improve
  "evaluation": { ... } // Full evaluation details
}
```

## Evaluation Logic

- Each criterion is scored as either "yes" (1 point) or "no" (0 points)
- The total score is calculated as a percentage of passed criteria
- A score of 90% or higher is required to pass
- The response includes detailed feedback on which criteria failed if applicable

## Error Handling

- Missing `text` field: 400 Bad Request
- API errors: 500 Internal Server Error with error message

## Troubleshooting

### API Key Issues

If you see errors related to the Gemini API:
1. Make sure you've created a valid API key in [Google AI Studio](https://makersuite.google.com/)
2. Check that you've correctly pasted your API key in the `.env` file
3. Verify that your API key has access to the Gemini 2.0 Flash model
4. If using a free tier, check for any usage limits that might be affecting your requests

### Port Already in Use

If you see an error like `EADDRINUSE: address already in use`, the server will automatically try the next available port:

```
Port 3001 is busy, trying port 3002
```

To ensure your test client connects to the right port:
1. Check the console output for the actual port being used
2. Update your .env file with the correct TEST_PORT
3. Or manually specify the port when testing: `TEST_PORT=3002 npm test`

### API Connection Issues

If the test client can't connect to the server:
1. Ensure the server is running in another terminal
2. Verify that the ports match between server and client
3. Check for any firewall or network issues
4. Run the debug script to start both simultaneously: `npm run debug` 