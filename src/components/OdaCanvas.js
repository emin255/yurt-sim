import { useEffect, useRef } from 'react';

// Oda nesneleri — her biri bir aktiviteyle bağlantılı
const NESNELER = [
    { id: 'masa',  x: 80,  y: 60,  w: 80, h: 60, renk: '#8B6914', isim: 'Calisma Masasi', aktiviteId: 'ders' },
    { id: 'yatak', x: 260, w: 100, y: 60,  h: 70, renk: '#4a4a8a', isim: 'Yatak',          aktiviteId: 'uyu'  },
    { id: 'spor',  x: 80,  y: 220, w: 70,  h: 70, renk: '#2196F3', isim: 'Spor Aleti',     aktiviteId: 'spor' },
    { id: 'telefon', x: 260, y: 220, w: 60, h: 60, renk: '#ff9800', isim: 'Telefon',       aktiviteId: 'sosyal' },
];

// Piksel karakter renkleri
function karakterCiz(ctx, x, y, yon) {
    const s = 3; // Piksel boyutu

    // Gölge
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 38, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bacaklar
    ctx.fillStyle = yon === 'sol' ? '#5555ff' : '#4444ee';
    ctx.fillRect(x + 6,  y + 26, s*2, s*4);
    ctx.fillRect(x + 14, y + 26, s*2, s*4);

    // Gövde
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(x + 4, y + 14, s*6, s*4);

    // Kollar
    ctx.fillStyle = '#ffb347';
    ctx.fillRect(x,      y + 14, s*2, s*3);
    ctx.fillRect(x + 18, y + 14, s*2, s*3);

    // Baş
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 6, y + 4, s*4, s*4);

    // Gözler
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 8,  y + 6, s, s);
    ctx.fillRect(x + 14, y + 6, s, s);

    // Saç
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 6, y + 4, s*4, s);
}

function OdaCanvas({ aktiviteYap, statlar }) {
    const canvasRef = useRef(null);
    const karakterRef = useRef({ x: 160, y: 150, yon: 'sag' });
    const tuslarRef = useRef({});
    const yakinNesneRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Klavye dinle
        const tusBasildi = (e) => {
            tuslarRef.current[e.key] = true;
            e.preventDefault();
        };
        const tusBirakti = (e) => {
            tuslarRef.current[e.key] = false;
        };

        window.addEventListener('keydown', tusBasildi);
        window.addEventListener('keyup', tusBirakti);

        // Oyun döngüsü
        let animFrame;
        function ciz() {
            const kar = karakterRef.current;
            const tuslar = tuslarRef.current;
            const hiz = 2;

            // Hareket
            if (tuslar['ArrowLeft']  || tuslar['a']) { kar.x -= hiz; kar.yon = 'sol'; }
            if (tuslar['ArrowRight'] || tuslar['d']) { kar.x += hiz; kar.yon = 'sag'; }
            if (tuslar['ArrowUp']    || tuslar['w']) kar.y -= hiz;
            if (tuslar['ArrowDown']  || tuslar['s']) kar.y += hiz;

            // Sınır kontrolü
            kar.x = Math.max(0, Math.min(canvas.width - 24, kar.x));
            kar.y = Math.max(0, Math.min(canvas.height - 40, kar.y));

            // Yakın nesne kontrolü
            yakinNesneRef.current = null;
            for (let nesne of NESNELER) {
                const dx = (kar.x + 12) - (nesne.x + nesne.w / 2);
                const dy = (kar.y + 20) - (nesne.y + nesne.h / 2);
                const mesafe = Math.sqrt(dx * dx + dy * dy);
                if (mesafe < 60) {
                    yakinNesneRef.current = nesne;
                    break;
                }
            }

            // --- ÇİZİM ---

            // Zemin
            ctx.fillStyle = '#c8a96e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Zemin çizgileri (tahta desen)
            ctx.strokeStyle = '#b8996e';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }

            // Duvarlar
            ctx.fillStyle = '#d4c5a9';
            ctx.fillRect(0, 0, canvas.width, 50);

            // Duvar deseni
            ctx.strokeStyle = '#c4b599';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.strokeRect(i, 0, 40, 25);
                ctx.strokeRect(i + 20, 25, 40, 25);
            }

            // Nesneleri çiz
            for (let nesne of NESNELER) {
                const yakin = yakinNesneRef.current?.id === nesne.id;

                // Gölge
                ctx.fillStyle = 'rgba(0,0,0,0.15)';
                ctx.fillRect(nesne.x + 4, nesne.y + 4, nesne.w, nesne.h);

                // Nesne
                ctx.fillStyle = yakin ? '#fff' : nesne.renk;
                ctx.fillRect(nesne.x, nesne.y, nesne.w, nesne.h);

                // Kenarlık
                ctx.strokeStyle = yakin ? '#ffd700' : 'rgba(0,0,0,0.3)';
                ctx.lineWidth = yakin ? 3 : 1;
                ctx.strokeRect(nesne.x, nesne.y, nesne.w, nesne.h);

                // İsim
                ctx.fillStyle = yakin ? '#ffd700' : '#fff';
                ctx.font = `${yakin ? 'bold ' : ''}11px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(nesne.isim, nesne.x + nesne.w/2, nesne.y + nesne.h/2 + 4);
            }

            // Karakter
            karakterCiz(ctx, kar.x, kar.y, kar.yon);

            // Yakın nesne ipucu
            if (yakinNesneRef.current) {
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(canvas.width/2 - 80, canvas.height - 35, 160, 28);
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(
                    `[E] ${yakinNesneRef.current.isim}`,
                    canvas.width/2,
                    canvas.height - 16
                );
            }

            animFrame = requestAnimationFrame(ciz);
        }

        // E tuşu — aktivite tetikle
        const eBasildi = (e) => {
            if (e.key === 'e' || e.key === 'E') {
                const yakin = yakinNesneRef.current;
                if (!yakin) return;

                const aktiviteMap = {
                    'ders':   { id:'ders',   isim:'Ders Calis',           sure:2, etkiler:{ akademik:15, enerji:-20, sosyal:-5  }, mesaj:'Masaya oturup ders calistın.' },
                    'uyu':    { id:'uyu',    isim:'Uyu',                  sure:8, etkiler:{ enerji:80,   saglik:10,  sosyal:-5  }, mesaj:'Iyi bir uyku cektin.'          },
                    'spor':   { id:'spor',   isim:'Spor Yap',             sure:1, etkiler:{ saglik:20,   enerji:-25, sosyal:5   }, mesaj:'Spor aleti kullandın.'         },
                    'sosyal': { id:'sosyal', isim:'Arkadaslarla Takilma', sure:2, etkiler:{ sosyal:25