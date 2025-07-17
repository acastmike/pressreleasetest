{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red77\green80\blue85;\red236\green241\blue247;\red0\green0\blue0;
\red111\green14\blue195;\red24\green112\blue43;\red164\green69\blue11;\red14\green110\blue109;}
{\*\expandedcolortbl;;\cssrgb\c37255\c38824\c40784;\cssrgb\c94118\c95686\c97647;\cssrgb\c0\c0\c0;
\cssrgb\c51765\c18824\c80784;\cssrgb\c9412\c50196\c21961;\cssrgb\c70980\c34902\c3137;\cssrgb\c0\c50196\c50196;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 // This is a Netlify Function that acts as a secure proxy to the Google Gemini API.\cf0 \cb1 \strokec4 \
\cf2 \cb3 \strokec2 // It retrieves the API key from environment variables, so you don't expose it in the frontend code.\cf0 \cb1 \strokec4 \
\
\pard\pardeftab720\partightenfactor0
\cf0 \cb3 \strokec4 exports.handler = \cf5 \strokec5 async\cf0 \strokec4  \cf5 \strokec5 function\cf0 \strokec4  (event, context) \{\cb1 \strokec4 \
\cb3 \strokec4   \cf2 \strokec2 // Only allow POST requests\cf0 \cb1 \strokec4 \
\cb3 \strokec4   \cf5 \strokec5 if\cf0 \strokec4  (event.httpMethod !== \cf6 \strokec6 'POST'\cf0 \strokec4 ) \{\cb1 \strokec4 \
\cb3 \strokec4     \cf5 \strokec5 return\cf0 \strokec4  \{ statusCode: \cf7 \strokec7 405\cf0 \strokec4 , body: \cf6 \strokec6 'Method Not Allowed'\cf0 \strokec4  \};\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\
\cb3 \strokec4   \cf5 \strokec5 try\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4     \cf5 \strokec5 const\cf0 \strokec4  \{ prompt \} = \cf8 \strokec8 JSON\cf0 \strokec4 .parse(event.body);\cb1 \strokec4 \
\cb3 \strokec4     \cf5 \strokec5 const\cf0 \strokec4  apiKey = process.env.\cf8 \strokec8 GEMINI_API_KEY\cf0 \strokec4 ;\cb1 \strokec4 \
\
\cb3 \strokec4     \cf5 \strokec5 if\cf0 \strokec4  (!apiKey) \{\cb1 \strokec4 \
\cb3 \strokec4       \cf5 \strokec5 return\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4         statusCode: \cf7 \strokec7 500\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4         body: \cf8 \strokec8 JSON\cf0 \strokec4 .stringify(\{ error: \cf6 \strokec6 'API key is not set on the server.'\cf0 \strokec4  \}),\cb1 \strokec4 \
\cb3 \strokec4       \};\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\cb3 \strokec4     \cb1 \strokec4 \
\cb3 \strokec4     \cf5 \strokec5 if\cf0 \strokec4  (!prompt) \{\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 return\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4           statusCode: \cf7 \strokec7 400\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4           body: \cf8 \strokec8 JSON\cf0 \strokec4 .stringify(\{ error: \cf6 \strokec6 'No prompt provided.'\cf0 \strokec4  \}),\cb1 \strokec4 \
\cb3 \strokec4         \};\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\
\cb3 \strokec4     \cf5 \strokec5 const\cf0 \strokec4  apiUrl = \cf6 \strokec6 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\cf0 \strokec4 $\{apiKey\}\cf6 \strokec6 `\cf0 \strokec4 ;\cb1 \strokec4 \
\cb3 \strokec4     \cb1 \strokec4 \
\cb3 \strokec4     \cf5 \strokec5 const\cf0 \strokec4  payload = \{\cb1 \strokec4 \
\cb3 \strokec4         contents: [\{ role: \cf6 \strokec6 "user"\cf0 \strokec4 , parts: [\{ text: prompt \}] \}],\cb1 \strokec4 \
\cb3 \strokec4     \};\cb1 \strokec4 \
\
\cb3 \strokec4     \cf5 \strokec5 const\cf0 \strokec4  response = \cf5 \strokec5 await\cf0 \strokec4  fetch(apiUrl, \{\cb1 \strokec4 \
\cb3 \strokec4       method: \cf6 \strokec6 'POST'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       headers: \{\cb1 \strokec4 \
\cb3 \strokec4         \cf6 \strokec6 'Content-Type'\cf0 \strokec4 : \cf6 \strokec6 'application/json'\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       \},\cb1 \strokec4 \
\cb3 \strokec4       body: \cf8 \strokec8 JSON\cf0 \strokec4 .stringify(payload),\cb1 \strokec4 \
\cb3 \strokec4     \});\cb1 \strokec4 \
\
\cb3 \strokec4     \cf5 \strokec5 if\cf0 \strokec4  (!response.ok) \{\cb1 \strokec4 \
\cb3 \strokec4       \cf5 \strokec5 const\cf0 \strokec4  errorData = \cf5 \strokec5 await\cf0 \strokec4  response.json();\cb1 \strokec4 \
\cb3 \strokec4       console.error(\cf6 \strokec6 'Google API Error:'\cf0 \strokec4 , errorData);\cb1 \strokec4 \
\cb3 \strokec4       \cf5 \strokec5 return\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4         statusCode: response.status,\cb1 \strokec4 \
\cb3 \strokec4         body: \cf8 \strokec8 JSON\cf0 \strokec4 .stringify(\{ error: errorData.error.message || \cf6 \strokec6 'Failed to fetch from Google API.'\cf0 \strokec4  \}),\cb1 \strokec4 \
\cb3 \strokec4       \};\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\
\cb3 \strokec4     \cf5 \strokec5 const\cf0 \strokec4  result = \cf5 \strokec5 await\cf0 \strokec4  response.json();\cb1 \strokec4 \
\cb3 \strokec4     \cf5 \strokec5 const\cf0 \strokec4  text = result.candidates[\cf7 \strokec7 0\cf0 \strokec4 ]?.content?.parts[\cf7 \strokec7 0\cf0 \strokec4 ]?.text;\cb1 \strokec4 \
\
\cb3 \strokec4     \cf5 \strokec5 if\cf0 \strokec4  (!text) \{\cb1 \strokec4 \
\cb3 \strokec4         \cf5 \strokec5 return\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4             statusCode: \cf7 \strokec7 500\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4             body: \cf8 \strokec8 JSON\cf0 \strokec4 .stringify(\{ error: \cf6 \strokec6 'API returned an invalid response structure.'\cf0 \strokec4  \}),\cb1 \strokec4 \
\cb3 \strokec4           \};\cb1 \strokec4 \
\cb3 \strokec4     \}\cb1 \strokec4 \
\
\cb3 \strokec4     \cf5 \strokec5 return\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4       statusCode: \cf7 \strokec7 200\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       headers: \{ \cf6 \strokec6 'Content-Type'\cf0 \strokec4 : \cf6 \strokec6 'application/json'\cf0 \strokec4  \},\cb1 \strokec4 \
\cb3 \strokec4       body: \cf8 \strokec8 JSON\cf0 \strokec4 .stringify(\{ text \}),\cb1 \strokec4 \
\cb3 \strokec4     \};\cb1 \strokec4 \
\cb3 \strokec4   \} \cf5 \strokec5 catch\cf0 \strokec4  (error) \{\cb1 \strokec4 \
\cb3 \strokec4     console.error(\cf6 \strokec6 'Proxy Error:'\cf0 \strokec4 , error);\cb1 \strokec4 \
\cb3 \strokec4     \cf5 \strokec5 return\cf0 \strokec4  \{\cb1 \strokec4 \
\cb3 \strokec4       statusCode: \cf7 \strokec7 500\cf0 \strokec4 ,\cb1 \strokec4 \
\cb3 \strokec4       body: \cf8 \strokec8 JSON\cf0 \strokec4 .stringify(\{ error: error.message \}),\cb1 \strokec4 \
\cb3 \strokec4     \};\cb1 \strokec4 \
\cb3 \strokec4   \}\cb1 \strokec4 \
\cb3 \strokec4 \};\cb1 \strokec4 \
\
}