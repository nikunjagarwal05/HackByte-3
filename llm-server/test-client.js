const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Try to read port from server.port file if it exists (created by debug script)
let portFromFile;
try {
  if (fs.existsSync('server.port')) {
    portFromFile = parseInt(fs.readFileSync('server.port', 'utf8').trim());
    console.log(`Found server port from file: ${portFromFile}`);
  }
} catch (err) {
  console.log('No server.port file found, using environment variables');
}

// Configuration
const API_PORT = portFromFile || parseInt(process.env.TEST_PORT || process.env.PORT || 3001);
const API_HOST = process.env.API_HOST || 'localhost';
const API_URL = `http://${API_HOST}:3001`;
const SCORE_URL = `${API_URL}/score`;

// Example test cases
const testCases = [
  {
    name: "Biased content (should fail)",
    text: "The recent policy implemented by the city council is an utter failure, and its supporters are clearly misguided. This policy, which some claim improves public safety, is nothing more than a ploy for political gain."
  },
  {
    name: "Neutral content (should pass)",
    text: "The city council implemented a new public safety policy on January 15, 2023. According to city statistics, emergency response times have decreased by 12% since implementation. However, a study by Urban Policy Institute found that costs increased by 8%, and some community members have expressed concerns about implementation challenges. Council member Garcia stated that 'we're monitoring the results closely,' while opposition leader Chen argued that 'alternative approaches should be considered.'"
  }
];

// Check if server is running
async function checkServerStatus() {
  try {
    console.log(`Checking server status at ${API_URL}...`);
    const response = await fetch(API_URL, {
      method: 'GET',
      timeout: 5000,
    });
    
    if (response.ok) {
      console.log('Server is running! ✓');
      return true;
    } else {
      console.error(`Server returned status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`Error connecting to server: ${error.message}`);
    console.log('Make sure the server is running and the port configuration is correct.');
    console.log(`Expected server at: ${API_URL}`);
    
    // Try some alternative ports if the main port fails
    for (let portOffset = 1; portOffset <= 5; portOffset++) {
      const altPort = API_PORT + portOffset;
      const altUrl = `http://${API_HOST}:3001`;
      
      try {
        console.log(`Trying alternative port: ${altPort}`);
        const altResponse = await fetch(altUrl, {
          method: 'GET',
          timeout: 3000,
        });
        
        if (altResponse.ok) {
          console.log(`Found server running on alternative port: ${altPort}`);
          console.log(`Please update your TEST_PORT to ${altPort} or use: TEST_PORT=${altPort} npm test`);
          return false;
        }
      } catch (e) {
        // Continue trying other ports
      }
    }
    
    return false;
  }
}

async function runTest(test) {
  console.log(`Running test: ${test.name}`);
  
  try {
    console.log(`Sending request with text (${test.text.length} chars)`);
    
    // Try the /score endpoint first
    let response = await fetch(SCORE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: test.text }),
    });
    
    // If that fails, try the root endpoint
    if (!response.ok && response.status === 404) {
      console.log('Score endpoint returned 404, trying root endpoint...');
      response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: test.text }),
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText.substring(0, 150)}...`);
    }
    
    const result = await response.json();
    
    console.log(`Status: ${result.status}`);
    console.log(`Score: ${result.score}%`);
    console.log(`Passed: ${result.criteria.passed}/${result.criteria.total} criteria`);
    console.log(`Feedback: ${result.feedback}`);
    console.log("----------------------------------------\n");
    return true;
  } catch (error) {
    console.error(`Error with test "${test.name}":`, error.message);
    console.log("----------------------------------------\n");
    return false;
  }
}

async function testAPI() {
  console.log(`\nTesting LLM Server API at ${API_URL}...\n`);
  
  // First check if the server is running
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    console.error('Aborting tests as server is not reachable');
    process.exit(1);
    return;
  }
  
  let passedTests = 0;
  for (const test of testCases) {
    if (await runTest(test)) {
      passedTests++;
    }
  }
  
  console.log(`Test summary: ${passedTests}/${testCases.length} tests passed`);
  
  // Exit with appropriate code
  process.exit(passedTests === testCases.length ? 0 : 1);
}

// Run the tests
testAPI(); 