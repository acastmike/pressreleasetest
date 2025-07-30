// This is a Netlify Function that acts as a secure proxy to the Google Gemini API.
// It retrieves the API key from environment variables, so you don't expose it in the frontend code.

exports.handler = async function (event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'API key is not set on the server.' }),
            };
        }
        
        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No prompt provided.' }),
              };
        }

        // Note: I've updated the model to a current one to prevent future errors.
const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google API Error:', errorData);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorData.error.message || 'Failed to fetch from Google API.' }),
            };
        }

        const result = await response.json();
        const text = result.candidates[0]?.content?.parts[0]?.text;

        if (!text) {
             return {
                statusCode: 500,
                body: JSON.stringify({ error: 'API returned an invalid response structure.' }),
              };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        };
    } catch (error) {
        console.error('Proxy Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
