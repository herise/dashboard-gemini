export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metode tidak diizinkan' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Konfigurasi API Key di Vercel belum diset!' });
    }

    try {
        // Menggunakan model Gemini terbaru
        const response = await fetch(`https://googleapis.com{apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, tidak ada respon dari Gemini.';
        
        return res.status(200).json({ reply });
    } catch (error) {
        return res.status(500).json({ error: 'Gagal menghubungi server Gemini' });
    }
}
