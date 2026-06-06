const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const allowedOrigins = [
    'chrome-extension://gajblfjpihgdlmodooglmbclcdieenof'
];

app.use(cors({
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
}));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "Accès interdit : Origine non autorisée." });
    }
    if (!origin) {
        return res.status(403).json({ error: "Accès interdit : Les requêtes directes ne sont pas autorisées." });
    }
    next();
});


app.use(express.json());

app.post('/api/abrege', async (req, res) => {
    const text = req.body.text ;
    if (!text) {
    return res.status(400).json({ error: 'Champ "text" manquant dans le body.' });
    };

    const geminiBody = {
    contents: [{ parts: [{
            text: `Résume ce mail en un bloc claires et concis, liste les point importants si nécéssaire. Donne directement le contenu du mail résumé et en Français. le mail: <<\n\n${text} >>`,
          }],
      }],
  };

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,{
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    })
    .then(resObj => resObj.json())
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(500).json({ error: err.message }));
          
});


const PORT = process.env.PORT || 3000 ;
app.listen(PORT, ()=>{
    console.log(`serveur démarré sur le port : ${PORT}`)
});