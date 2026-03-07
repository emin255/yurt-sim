import { useEffect, useRef, useState } from 'react';

// Her odanın tanımı
const ODALAR = {
    yurtOdasi: {
        isim: 'Yurt Odasi',
        zeminRenk: '#c8a96e',
        duvarRenk: '#d4c5a9',
        nesneler: [
            { id: 'masa',    x: 60,  y: 60,  w: 80, h: 60, renk: '#8B6914', isim: 'Calisma Masasi', aktiviteId: 'ders'   },
            { id: 'yatak',   x: 260, y: 60,  w: 100,h: 70, renk: '#4a4a8a', isim: 'Yatak',          aktiviteId: 'uyu'    },
            { id: 'telefon', x: 260, y: 220, w: 60, h: 60, renk: '#ff9800', isim: 'Telefon',         aktiviteId: 'sosyal' },
        ],
        kapılar: [
            { id: 'koridor', x: 175, y: 280, w: 50, h: 20, hedef: 'koridor', isim: 'Koridor' }
        ]
    },
    koridor: {
        isim: 'Koridor',
        zeminRenk: '#a0a0a0',
        duvarRenk: '#888',
        nesneler: [],
        kapılar: [
            { id: 'yurtOdasi', x: 175, y: 10,  w: 50, h: 20, hedef: 'yurtOdasi', isim: 'Yurt Odasi' },
            { id: 'mutfak',    x: 20,  y: 130, w: 20, h: 50, hedef: 'mutfak',    isim: 'Mutfak'     },
            { id: 'ortakAlan', x: 175, y: 130, w: 50, h: 20, hedef: 'ortakAlan', isim: 'Ortak Alan' },
            { id: 'kutuphane', x: 360, y: 130, w: 20, h: 50, hedef: 'kutuphane', isim: 'Kutuphane'  },
        ]
    },
    mutfak: {
        isim: 'Mutfak',
        zeminRenk: '#e8d5b0',
        duvarRenk: '#f0e6c8',
        nesneler: [
            { id: 'ocak',   x: 40,  y: 60, w: 80, h: 60, renk: '#888', isim: 'Ocak',    aktiviteId: 'yemek'  },
            { id: 'buzdolabi', x: 270, y: 60, w: 60, h: 80, renk: '#aaddff', isim: 'Buzdolabi', aktiviteId: 'atistir' },
        ],
        kapılar: [
            { id: 'koridor', x: 175, y: 280, w: 50, h: 20, hedef: 'koridor', isim: 'Koridor' }
        ]
    },
    ortakAlan: {
        isim: 'Ortak Alan',
        zeminRenk: '#8B6914',
        duvarRenk: '#a07830',
        nesneler: [
            { id: 'kanepe', x: 60,  y: 80, w: 120, h: 60, renk: '#cc4444', isim: 'Kanepe',  aktiviteId: 'dinlen' },
            { id: 'tv',     x: 250, y: 60, w: 80,  h: 50, renk: '#222',    isim: 'TV',      aktiviteId: 'tv'     },
        ],
        kapılar: [
            { id: 'koridor', x: 175, y: 280, w: 50, h: 20, hedef: 'koridor', isim: 'Koridor' }
        ]
    },
    kutuphane: {
        isim: 'Kutuphane',
        zeminRenk: '#8B4513',
        duvarRenk: '#a05020',
        nesneler: [
            { id: 'kitaplik1', x: 40,  y: 40, w: 60, h: 100, renk: '#5c3d1a', isim: 'Kitaplik', aktiviteId: 'dersDerin' },
            { id: 'kitaplik2', x: 140, y: 40, w: 60, h: 100, renk: '#5c3d1a', isim: 'Kitaplik', aktiviteId: 'dersDerin' },
            { id: 'okumaMasasi', x: 240, y: 180, w: 100, h: 60, renk: '#8B6914', isim: 'Okuma Masasi', aktiviteId: 'arastir' },
        ],
        kapılar: [
            { id: 'koridor', x: 175, y: 280, w: 50, h: 20, hedef: 'koridor', isim: 'Koridor' }
        ]
    }
};

// Aktivite tanımları
const AKTIVITE_MAP = {
    'ders':      { sure: 2, etkiler: { akademik: 15, enerji: -20, sosyal: -5  }, mesaj: 'Masada ders calistın.' },
    'uyu':       { sure: 8, etkiler: { enerji: 80,   saglik: 10,  sosyal: -5  }, mesaj: 'Iyi uyku cektin.'     },
    'sosyal':    { sure: 2, etkiler: { sosyal: 25,    enerji: -10, akademik: -5}, mesaj: 'Arkadaslarınla konustun.' },
    'yemek':     { sure: 1, etkiler: { saglik: 20,    enerji: 15,  para: -30  }, mesaj: 'Yemek pisirdin, 30 TL harcadın.' },
    'atistir':   { sure: 1, etkiler: { enerji: 10,    saglik: -5,  para: -10  }, mesaj: 'Buzdolabından atistirdin.' },
    'dinlen':    { sure: 2, etkiler: { enerji: 20,    sosyal: 10,  akademik: -5}, mesaj: 'Kanepede dinlendın.' },
    'tv':        { sure: 2, etkiler: { enerji: 15,    sosyal: 5,   akademik: -10}, mesaj: 'TV izledin, vakit gecti.' },
    'dersDerin': { sure: 3, etkiler: { akademik: 25,  enerji: -25, sosyal: -10 }, mesaj: 'Kutuphanede derin calisma yaptın!' },
    'arastir':   { sure: 2, etkiler: { akademik: 20,  enerji: -15, sosyal: -5  }, mesaj: 'Arastirma yaptın, bilgin artı.' },
};

function karakterCiz(ctx, x, y, yon) {
    const s = 3;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 38, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = yon === 'sol' ? '#5555ff' : '#4444ee';
    ctx.fillRect(x + 6,  y + 26, s*2, s*4);
    ctx.fillRect(x + 14, y + 26, s*2, s*4);
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(x + 4, y + 14, s*6, s*4);
    ctx.fillStyle = '#ffb347';
    ctx.fillRect(x,      y + 14, s*2, s*3);
    ctx.fillRect(x + 18, y + 14, s*2, s*3);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 6, y + 4, s*4, s*4);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 8,  y + 6, s, s);
    ctx.fillRect(x + 14, y + 6, s, s);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 6, y + 4, s*4, s);
}

function OdaCanvas({ aktiviteYap }) {
    const canvasRef = useRef(null);
    const karakterRef = useRef({ x: 175, y: 200, yon: 'sag' });
    const tuslarRef = useRef({});
    const yakinRef = useRef(null); // Yakın nesne veya kapı
    const [mevcutOdaId, setMevcutOdaId] = useState('yurtOdasi');
    const mevcutOdaRef = useRef('yurtOdasi');

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const tusBasildi = (e) => { tuslarRef.current[e.key] = true; };
        const tusBirakti = (e) => { tuslarRef.current[e.key] = false; };
        window.addEventListener('keydown', tusBasildi);
        window.addEventListener('keyup', tusBirakti);

        const eBasildi = (e) => {
            if (e.key !== 'e' && e.key !== 'E') return;
            const yakin = yakinRef.current;
            if (!yakin) return;

            if (yakin.tip === 'kapi') {
                // Oda geçişi
                mevcutOdaRef.current = yakin.hedef;
                setMevcutOdaId(yakin.hedef);
                karakterRef.current = { x: 175, y: 200, yon: 'sag' };
            } else if (yakin.tip === 'nesne') {
                const aktivite = AKTIVITE_MAP[yakin.aktiviteId];
                if (aktivite) aktiviteYap({ id: yakin.aktiviteId, ...aktivite });
            }
        };
        window.addEventListener('keydown', eBasildi);

        let animFrame;
        function ciz() {
            const kar = karakterRef.current;
            const tuslar = tuslarRef.current;
            const hiz = 2;
            const oda = ODALAR[mevcutOdaRef.current];

            // Hareket
            if (tuslar['ArrowLeft']  || tuslar['a']) { kar.x -= hiz; kar.yon = 'sol'; }
            if (tuslar['ArrowRight'] || tuslar['d']) { kar.x += hiz; kar.yon = 'sag'; }
            if (tuslar['ArrowUp']    || tuslar['w']) kar.y -= hiz;
            if (tuslar['ArrowDown']  || tuslar['s']) kar.y += hiz;

            kar.x = Math.max(0, Math.min(canvas.width - 24, kar.x));
            kar.y = Math.max(10, Math.min(canvas.height - 40, kar.y));

            // Yakın nesne/kapı kontrolü
            yakinRef.current = null;
            const karMerkez = { x: kar.x + 12, y: kar.y + 20 };

            for (let nesne of oda.nesneler) {
                const dx = karMerkez.x - (nesne.x + nesne.w / 2);
                const dy = karMerkez.y - (nesne.y + nesne.h / 2);
                if (Math.sqrt(dx*dx + dy*dy) < 60) {
                    yakinRef.current = { ...nesne, tip: 'nesne' };
                    break;
                }
            }

            if (!yakinRef.current) {
                for (let kapi of oda.kapılar) {
                    const dx = karMerkez.x - (kapi.x + kapi.w / 2);
                    const dy = karMerkez.y - (kapi.y + kapi.h / 2);
                    if (Math.sqrt(dx*dx + dy*dy) < 50) {
                        yakinRef.current = { ...kapi, tip: 'kapi' };
                        break;
                    }
                }
            }

            // ÇİZİM
            // Zemin
            ctx.fillStyle = oda.zeminRenk;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Zemin çizgileri
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }

            // Duvar
            ctx.fillStyle = oda.duvarRenk;
            ctx.fillRect(0, 0, canvas.width, 50);
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.strokeRect(i, 0, 40, 25);
                ctx.strokeRect(i+20, 25, 40, 25);
            }

            // Oda ismi
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(oda.isim, canvas.width/2, 30);

            // Kapılar
            for (let kapi of oda.kapılar) {
                const yakin = yakinRef.current?.id === kapi.id;
                ctx.fillStyle = yakin ? '#ffd700' : '#8B4513';
                ctx.fillRect(kapi.x, kapi.y, kapi.w, kapi.h);
                ctx.strokeStyle = yakin ? '#fff' : 'rgba(0,0,0,0.4)';
                ctx.lineWidth = yakin ? 2 : 1;
                ctx.strokeRect(kapi.x, kapi.y, kapi.w, kapi.h);
                ctx.fillStyle = yakin ? '#000' : '#fff';
                ctx.font = '9px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(kapi.isim, kapi.x + kapi.w/2, kapi.y + kapi.h/2 + 3);
            }

            // Nesneler
            for (let nesne of oda.nesneler) {
                const yakin = yakinRef.current?.id === nesne.id;
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                ctx.fillRect(nesne.x+4, nesne.y+4, nesne.w, nesne.h);
                ctx.fillStyle = yakin ? '#fff' : nesne.renk;
                ctx.fillRect(nesne.x, nesne.y, nesne.w, nesne.h);
                ctx.strokeStyle = yakin ? '#ffd700' : 'rgba(0,0,0,0.3)';
                ctx.lineWidth = yakin ? 3 : 1;
                ctx.strokeRect(nesne.x, nesne.y, nesne.w, nesne.h);
                ctx.fillStyle = yakin ? '#ffd700' : '#fff';
                ctx.font = `${yakin ? 'bold ' : ''}11px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(nesne.isim, nesne.x + nesne.w/2, nesne.y + nesne.h/2 + 4);
            }

            // Karakter
            karakterCiz(ctx, kar.x, kar.y, kar.yon);

            // Yakın eleman ipucu
            if (yakinRef.current) {
                const yazi = yakinRef.current.tip === 'kapi'
                    ? `[E] ${yakinRef.current.isim} Gecis`
                    : `[E] ${yakinRef.current.isim}`;
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.fillRect(canvas.width/2 - 90, canvas.height - 35, 180, 28);
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(yazi, canvas.width/2, canvas.height - 16);
            }

            animFrame = requestAnimationFrame(ciz);
        }

        ciz();

        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener('keydown', tusBasildi);
            window.removeEventListener('keyup', tusBirakti);
            window.removeEventListener('keydown', eBasildi);
        };
    }, [aktiviteYap]);

    return (
        <div>
            <div style={{
                textAlign: 'center',
                marginBottom: '6px',
                color: '#aaa',
                fontSize: '12px'
            }}>
                WASD / Ok tuslari ile gez, [E] ile etkilesim
            </div>
            <canvas
                ref={canvasRef}
                width={400}
                height={320}
                style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(255,255,255,0.1)',
                    display: 'block',
                    width: '100%'
                }}
            />
        </div>
    );
}

export default OdaCanvas;