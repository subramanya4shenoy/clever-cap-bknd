const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Middleware setup
app.use(bodyParser.json());

// Enable CORS with specific origins
app.use(
  cors({
    origin: [
      "https://6570227dca67f73f3aa9fc07--phenomenal-granita-024ec5.netlify.app",
      "http://localhost:3000", // Add other origins as needed
    ],
  })
);

app.post("/generate", async (req, res) => {
  console.log("Required type:", req.body.type);
  console.log("Entered keywords:", req.body.keywords);
  console.log("Entered tone:", req.body.tone);

  let prompt;

  if (req.body.type == "caption") {
    prompt = `Generate a ${req.body.tone} caption (up to 250 characters) without hashtags and also generate relevant hashtags separately for an Instagram post featuring ${req.body.keywords}. Format the result in JSON strictly as follows: {"data": "", "hashtag": ""}`;
  } else if (req.body.type == "comment") {
    prompt = `Generate a ${req.body.tone} first comment without hashtags for an Instagram post featuring ${req.body.keywords}. Format the result in JSON strictly as follows: {"data": ""}`;
  } else if (req.body.type == "title") {
    prompt = `Generate a title for a Pinterest post featuring ${req.body.keywords}. Format the result in JSON strictly as follows: {"data": ""}`;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_APIKEY}`,
        },
      }
    );

    const responseText = JSON.parse(response.data.choices[0].message.content);

    res.send({ response: responseText });
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("An error occurred while generating");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
