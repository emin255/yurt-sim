const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });
const app = express();

app.use(cors());
app.use(express.json());

const JSON_FORMAT = `SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:
{
  "mesaj": "Senin söylediğin tek cümle",
  "secenekler": [
    { "metin": "Kısa yanıt", "etkiler": { "sosyal": 5 } },
    { "metin": "Başka kısa yanıt", "etkiler": { "sosyal": -2 } }
  ]
}`;

function buildKantinGorevlisiPrompt({ npcIsim, gecmis, tur }) {
    const ailevDert = Math.random() < 0.15; // %15 ihtimalle ailevi dert

    if (!gecmis) {
        const konu = ailevDert
            ? `Bugün aklında ailevi bir şey var — çocuğun hasta, kocayla tartıştın ya da köydeki annen aradı gibi küçük kişisel bir dert. Bunu mutfak sohbeti arasında hafifçe, tek cümleyle dile getir.`
            : `Bugünün yemek menüsünden bahset — mercimek çorbası, tavuk sote, taze meyve gibi bir şey söyle ya da bir yemeği tavsiye et.`;

        return `Sen "${npcIsim}" adında bir yurt kantini görevlisisin. Orta yaşlı, samimi, yılların verdiği tecrübeyle konuşan birisin.
${konu}
TEK CÜMLELIK kısa bir selamlama/başlangıç yap.
2 kısa yanıt seçeneği üret (her biri en fazla 5 kelime).
Her seçenek için uygun stat etkisi belirle (saglik, sosyal, enerji; -5 ile +5 arası).
${JSON_FORMAT}`;
    }

    const sonTur = tur >= 3;
    return `Sen "${npcIsim}" adında bir yurt kantini görevlisisin.
Az önce şunu söyledin: "${gecmis.npcMesaj}"
Oyuncu şunu yanıtladı: "${gecmis.oyuncuYaniti}"
${sonTur
    ? 'Bu konuşmayı TEK CÜMLEYLE sıcak bir şekilde bitir. secenekler dizisi BOŞ olsun [].'
    : 'TEK CÜMLEYLE kısa bir cevap ver, konuşmanın havasına devam et. 2 kısa yanıt seçeneği üret (her biri en fazla 5 kelime). Uygun stat etkisi belirle (saglik, sosyal, enerji; -5 ile +5 arası).'}
${JSON_FORMAT}`;
}

function buildPrompt({ npcIsim, npcTip, statlar, gecmis, tur }) {
    if (npcTip === 'kantin_gorevlisi') {
        return buildKantinGorevlisiPrompt({ npcIsim, gecmis, tur });
    }

    const statBilgi = `Oyuncunun statları — Akademik: ${statlar.akademik}, Sosyal: ${statlar.sosyal}, Enerji: ${statlar.enerji}.`;

    if (!gecmis) {
        return `Sen "${npcIsim}" adında bir yurt öğrencisisin. Karakter tipin: ${npcTip}.
${statBilgi}
Karakterine uygun, TEK CÜMLELIK kısa bir selamlama yap.
Ardından 2 kısa yanıt seçeneği üret (her biri en fazla 5 kelime).
Her seçenek için uygun stat etkisi belirle (sosyal, akademik, enerji, saglik, para; -8 ile +8 arası).
${JSON_FORMAT}`;
    }

    const sonTur = tur >= 3;
    return `Sen "${npcIsim}" adında bir yurt öğrencisisin. Karakter tipin: ${npcTip}.
${statBilgi}
Az önce şunu söyledin: "${gecmis.npcMesaj}"
Oyuncu şunu yanıtladı: "${gecmis.oyuncuYaniti}"
${sonTur
    ? 'Bu konuşmayı TEK CÜMLEYLE doğal bir şekilde bitir (veda, teşekkür vb.). secenekler dizisi BOŞ olsun [].'
    : 'TEK CÜMLEYLE kısa bir cevap ver. 2 kısa yanıt seçeneği üret (her biri en fazla 5 kelime). Her seçenek için uygun stat etkisi belirle (sosyal, akademik, enerji, saglik, para; -8 ile +8 arası).'}
${JSON_FORMAT}`;
}

app.post('/api/npc-dialog', async (req, res) => {
    console.log('İstek geldi:', req.body);
    try {
        const { npcTip, statlar, npcIsim, tur } = req.body;

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
                    content: buildPrompt({ npcIsim, npcTip, statlar, gecmis: req.body.gecmis, tur })
                }]
            })
        });

        if (!response.ok) throw new Error(`API hatası: ${response.status}`);
        const data = await response.json();
        let rawText = data.content[0].text.trim();

        // Markdown kod bloğu varsa temizle (```json ... ``` veya ``` ... ```)
        rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch {
            // JSON parse edilemezse sadece mesaj olarak dön
            parsed = { mesaj: rawText, secenekler: [] };
        }

        console.log('AI yanıtı:', parsed);

        res.json(parsed);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const DERS_SORULAR_FORMAT = `SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:
{
  "sorular": [
    {
      "soru": "Soru metni buraya",
      "secenekler": ["Doğru cevap", "Yanlış cevap 1", "Yanlış cevap 2", "Yanlış cevap 3"],
      "dogru": 0
    }
  ]
}
Dikkat: "dogru" her zaman 0 olmalı (ilk seçenek doğru cevap). Oyun frontend'de karıştıracak.`;

app.post('/api/ders-sorular', async (req, res) => {
    const dersler = [
        'Veri Yapıları ve Algoritmalar',
        'İşletim Sistemleri',
        'Bilgisayar Ağları',
        'Nesne Yönelimli Programlama',
        'Veritabanı Yönetim Sistemleri',
        'Yazılım Mühendisliği',
        'Bilgisayar Mimarisi',
        'Programlama Dilleri',
        'Yapay Zeka',
        'Sayısal Analiz',
    ];
    const secilenDers = dersler[Math.floor(Math.random() * dersler.length)];

    const prompt = `Bilgisayar Mühendisliği lisans dersi olan "${secilenDers}" konusundan 3 adet çoktan seçmeli soru üret.
Sorular orta zorlukta olsun, gerçekten bu dersi okuyan bir öğrenciye yönelik olsun.
Her soruda 4 seçenek olsun. Doğru cevap her zaman ilk seçenek (index 0) olsun.
${DERS_SORULAR_FORMAT}`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 800,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) throw new Error(`API hatası: ${response.status}`);
        const data = await response.json();
        let rawText = data.content[0].text.trim();
        rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch {
            throw new Error('API geçersiz JSON döndürdü');
        }

        res.json({ ...parsed, ders: secilenDers });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3001, () => console.log('Server 3001de çalışıyor'));
