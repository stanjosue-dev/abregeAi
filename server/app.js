const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const allowedOrigins = [
    'https://stanjosue-dev.github.io'
];

const corsOptions = {
  origin: function (origin, callback) {

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    if (origin && origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
};

app.use(cors(corsOptions));
app.use(express.json());


app.post('/api/abrege', async (req, res) => {
    const text = req.body.text ;
    if (!text) {
    return res.status(400).json({ error: 'Champ "text" manquant dans le body.' });
    };

    const geminiBody = {
    contents: [{
        parts: [
          {
            text: `Résume ce mail en quelques phrases claires et concises en listant uniquement les point importants si nécéssaire. Donne directement la réponse et en Français. le mail: <<\n\n${text} >>`,
          },
        ],
      },
    ],
  };

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': process.env.API_KEY,
      },
      body: JSON.stringify(geminiBody),
    })
    .then(resObj => resObj.json())
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(500).json({ error: err.message }));
          
})


const PORT = process.env.PORT || 3000 ;
app.listen(PORT, ()=>{
    console.log(`serveur démarré sur le port : ${PORT}`)
});