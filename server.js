const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/npc-dialog', async (req, res) => {
    console.log('İstek geldi:', req.body);
    try {
        const { npcTip, statlar, npcIsim } = req.body;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 200,
                messages: [{
                    role: 'user',
                    content: `Sen "${npcIsim}" adında bir yurt öğrencisisin. Karakter tipin: ${npcTip}. 
Oyuncunun statları: Akademik: ${statlar.akademik}, Sosyal: ${statlar.sosyal}, Enerji: ${statlar.enerji}.
Statlarına bakarak kısa ve doğal bir selamlama cümlesi yaz. Sadece cümleyi yaz, başka bir şey ekleme.`
                }]
            })
        });

        if (!response.ok) throw new Error(`API hatası: ${response.status}`);
        const data = await response.json();
        res.json({ mesaj: data.content[0].text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3001, () => console.log('Server 3001de çalışıyor'));