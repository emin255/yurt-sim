import { useEffect, useRef, useState } from 'react';

const TILE = 40;
const W = 15;
const H = 13;
const TEPSI_KAPASITESI = 3;

const YEMEKLER = ['🍔','🍕','🌮','🥗','🍝','🍜','🍣','🧆'];

// Harita: 0=zemin, 1=duvar, 4=mutfak tezgahı
const HARITA = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// 6 masa konumu (tx, ty = masa tile pozisyonu)
const MASA_KONUMLARI = [
    { id:0, tx:2,  ty:2 },
    { id:1, tx:6,  ty:2 },
    { id:2, tx:10, ty:2 },
    { id:3, tx:2,  ty:6 },
    { id:4, tx:6,  ty:6 },
    { id:5, tx:10, ty:6 },
];

function rastgeleYemek() {
    return YEMEKLER[Math.floor(Math.random() * YEMEKLER.length)];
}

export default function GarsonlukOyunu({ onBitis }) {
    const canvasRef = useRef(null);

    // Tüm oyun state'i ref'te — canvas loop içinde kullanılacak
    const stateRef = useRef({
        oyuncu: { x: 7 * TILE + TILE/2, y: 9 * TILE, hiz: 4 },
        masalar: MASA_KONUMLARI.map((m, i) => ({
            ...m,
            durum: i < 3 ? 'siparis' : 'bos',
            siparis: i < 3 ? rastgeleYemek() : null,
            sabir: 100,
        })),
        tepsi: [],          // { masaId, yemek } — elde taşınan yemekler
        mutfakKuyruk: [],   // siparişi alınmış ama henüz tepside değil
        puan: 0,
        sure: 90,
        bitti: false,
        tuslar: {},
        mesaj: '',
        mesajKalan: 0,
    });

    const [ui, setUi] = useState({ puan: 0, sure: 90, tepsi: [], mesaj: '' });
    const [bitti, setBitti] = useState(false);
    const [sonucPuan, setSonucPuan] = useState(0);
    const animRef = useRef(null);

    useEffect(() => {
        const s = stateRef.current;

        // Yeni müşteri timer
        const musterTimer = setInterval(() => {
            s.masalar.forEach(m => {
                if (m.durum === 'bos' && Math.random() > 0.55) {
                    m.durum = 'siparis';
                    m.siparis = rastgeleYemek();
                    m.sabir = 100;
                }
            });
        }, 3500);

        // Sabır timer
        const sabirTimer = setInterval(() => {
            s.masalar.forEach(m => {
                if (m.durum === 'siparis' || m.durum === 'hazirlaniyor') {
                    m.sabir = Math.max(0, m.sabir - 2);
                    if (m.sabir === 0) {
                        // Müşteri gitti, tepside varsa temizle
                        s.tepsi = s.tepsi.filter(t => t.masaId !== m.id);
                        s.mutfakKuyruk = s.mutfakKuyruk.filter(t => t.masaId !== m.id);
                        m.durum = 'bos';
                        m.siparis = null;
                        setMesaj(s, '😤 Müşteri sabırsızlandı ve gitti!');
                    }
                }
            });
        }, 500);

        // Süre timer
        const sureTimer = setInterval(() => {
            s.sure -= 1;
            if (s.sure <= 0) {
                s.bitti = true;
                setBitti(true);
                setSonucPuan(s.puan);
            }
            setUi(u => ({ ...u, sure: s.sure }));
        }, 1000);

        // Klavye
        const keyDown = (e) => {
            e.stopPropagation();
            const anahtar = e.key.toLowerCase();
            s.tuslar[anahtar] = true;
            s.tuslar[e.key] = true;
            if (anahtar === 'e') etkilesim(s);
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','s','d','W','A','S','D'].includes(e.key))
                e.preventDefault();
        };
        const keyUp = (e) => {
            e.stopPropagation();
            const anahtar = e.key.toLowerCase();
            s.tuslar[anahtar] = false;
            s.tuslar[e.key] = false;
        };
        const blur = () => {
            s.tuslar = {};
        };
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        window.addEventListener('blur', blur);

        // Oyun döngüsü
        let frame = 0;
        function loop() {
            frame++;
            if (!s.bitti) {
                hareket(s);
                if (frame % 2 === 0) ciz(s);
                if (s.mesajKalan > 0) {
                    s.mesajKalan--;
                    if (s.mesajKalan % 10 === 0)
                        setUi(u => ({ ...u, mesaj: s.mesajKalan > 0 ? s.mesaj : '', tepsi: [...s.tepsi] }));
                }
            }
            animRef.current = requestAnimationFrame(loop);
        }
        animRef.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animRef.current);
            clearInterval(musterTimer);
            clearInterval(sabirTimer);
            clearInterval(sureTimer);
            window.removeEventListener('keydown', keyDown);
            window.removeEventListener('keyup', keyUp);
            window.removeEventListener('blur', blur);
        };
    }, []);

    function setMesaj(s, msg) {
        s.mesaj = msg;
        s.mesajKalan = 80;
        setUi(u => ({ ...u, mesaj: msg }));
    }

    function hareket(s) {
        const o = s.oyuncu;
        const t = s.tuslar;
        let dx = 0, dy = 0;
        if (t['w'] || t['W'] || t['ArrowUp'])    dy = -o.hiz;
        if (t['s'] || t['S'] || t['ArrowDown'])  dy =  o.hiz;
        if (t['a'] || t['A'] || t['ArrowLeft'])  dx = -o.hiz;
        if (t['d'] || t['D'] || t['ArrowRight']) dx =  o.hiz;

        const r = 14;
        const nx = o.x + dx;
        const ny = o.y + dy;

        if (gec(nx, o.y, r)) o.x = nx;
        if (gec(o.x, ny, r)) o.y = ny;
        o.x = Math.max(r, Math.min(W*TILE - r, o.x));
        o.y = Math.max(r, Math.min(H*TILE - r, o.y));
    }

    function gec(x, y, r) {
        for (const [cx, cy] of [[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r]]) {
            const tx = Math.floor(cx / TILE);
            const ty = Math.floor(cy / TILE);
            if (ty < 0 || ty >= H || tx < 0 || tx >= W) return false;
            if (HARITA[ty][tx] === 1) return false;
        }
        return true;
    }

    function etkilesim(s) {
        const o = s.oyuncu;

        // Mutfak tezgahı — y > 10*TILE
        if (o.y > 10 * TILE - 20) {
            if (s.mutfakKuyruk.length === 0) {
                setMesaj(s, '🍳 Mutfakta hazır sipariş yok.');
                return;
            }
            if (s.tepsi.length >= TEPSI_KAPASITESI) {
                setMesaj(s, `⚠️ Tepsi dolu! (Max ${TEPSI_KAPASITESI})`);
                return;
            }
            // Kuyruktan al, tepsiye ekle
            const alinacak = s.mutfakKuyruk.splice(0, TEPSI_KAPASITESI - s.tepsi.length);
            s.tepsi.push(...alinacak);
            setMesaj(s, `✅ ${alinacak.length} yemek tepsiye alındı! Masalara götür!`);
            setUi(u => ({ ...u, tepsi: [...s.tepsi] }));
            return;
        }

        // Masa kontrolü
        for (const masa of s.masalar) {
            const mx = masa.tx * TILE + TILE;
            const my = masa.ty * TILE + TILE;
            const dist = Math.hypot(o.x - mx, o.y - my);

            if (dist < TILE * 1.6) {
                if (masa.durum === 'siparis') {
                    // Siparişi al, mutfak kuyruğuna ekle
                    if (s.mutfakKuyruk.find(k => k.masaId === masa.id)) {
                        setMesaj(s, '⏳ Bu masa zaten sırada!');
                        return;
                    }
                    masa.durum = 'hazirlaniyor';
                    s.mutfakKuyruk.push({ masaId: masa.id, yemek: masa.siparis });
                    setMesaj(s, `📝 Sipariş alındı! ${masa.siparis} — Mutfağa git!`);
                    return;
                }

                if (masa.durum === 'hazirlaniyor') {
                    // Tepside bu masanın yemeği var mı?
                    const idx = s.tepsi.findIndex(t => t.masaId === masa.id);
                    if (idx !== -1) {
                        s.tepsi.splice(idx, 1);
                        const bonus = masa.sabir > 60 ? 2 : 1;
                        s.puan += bonus;
                        masa.durum = 'yiyor';
                        masa.siparis = null;
                        setMesaj(s, bonus === 2 ? `⚡ Süper hızlı! +${bonus} puan!` : `✅ Teslim! +${bonus} puan!`);
                        setUi(u => ({ ...u, puan: s.puan, tepsi: [...s.tepsi] }));
                        // 4s sonra masa boşalsın
                        setTimeout(() => {
                            masa.durum = 'bos';
                            masa.siparis = null;
                        }, 4000);
                        return;
                    } else {
                        setMesaj(s, `🍽 Önce mutfaktan ${masa.siparis} al!`);
                        return;
                    }
                }
            }
        }
    }

    function ciz(s) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const o = s.oyuncu;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Zemin
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const tile = HARITA[y][x];
                if (tile === 1) {
                    ctx.fillStyle = '#1a1a2e';
                } else if (tile === 4) {
                    ctx.fillStyle = (x+y)%2===0 ? '#1e3a2a' : '#254d38';
                } else {
                    ctx.fillStyle = (x+y)%2===0 ? '#3a2a1a' : '#332518';
                }
                ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
            }
        }

        // Mutfak yazısı
        ctx.fillStyle = '#2a6a4a';
        ctx.fillRect(TILE, 11*TILE, (W-2)*TILE, TILE);
        ctx.fillStyle = '#aaffcc';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🍳 MUTFAK — E ile al', (W/2)*TILE, 11*TILE + 26);

        // Mutfak kuyruğu göster
        if (s.mutfakKuyruk.length > 0) {
            s.mutfakKuyruk.forEach((k, i) => {
                ctx.font = '18px serif';
                ctx.fillText(k.yemek, TILE*2 + i*30, 11*TILE + 26);
            });
        }

        // Masalar
        for (const masa of s.masalar) {
            const px = masa.tx * TILE;
            const py = masa.ty * TILE;
            const cx = px + TILE;
            const cy = py + TILE;

            // Masa zemini
            ctx.fillStyle = masa.durum === 'yiyor' ? '#3a5a1a' : '#5c3d1e';
            ctx.fillRect(px+2, py+2, TILE*2-4, TILE*2-4);
            ctx.fillStyle = masa.durum === 'yiyor' ? '#4a7a2a' : '#7a5230';
            ctx.fillRect(px+6, py+6, TILE*2-12, TILE*2-12);

            if (masa.durum === 'siparis' || masa.durum === 'hazirlaniyor') {
                // Müşteri dairesi
                ctx.fillStyle = '#4da6ff';
                ctx.beginPath();
                ctx.arc(cx, py - 12, 10, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = '11px serif';
                ctx.textAlign = 'center';
                ctx.fillText('😐', cx, py - 8);

                // Sipariş baloncuğu
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.beginPath();
                ctx.roundRect(cx - 20, py - 42, 40, 24, 6);
                ctx.fill();

                if (masa.durum === 'siparis') {
                    ctx.font = '16px serif';
                    ctx.fillText(masa.siparis, cx, py - 24);
                } else {
                    // Tepside var mı?
                    const varMi = s.tepsi.find(t => t.masaId === masa.id);
                    ctx.font = varMi ? '14px serif' : '11px monospace';
                    ctx.fillStyle = varMi ? '#50c878' : '#f0c040';
                    ctx.fillText(varMi ? '🚶 geliyor!' : '⏳ bekliyor', cx, py - 24);
                    ctx.fillStyle = '#fff';
                }

                // Sabır barı
                const bw = TILE*2 - 6;
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(px+3, py + TILE*2 - 8, bw, 5);
                const sc = masa.sabir > 60 ? '#50c878' : masa.sabir > 30 ? '#f0c040' : '#ff5555';
                ctx.fillStyle = sc;
                ctx.fillRect(px+3, py + TILE*2 - 8, bw * (masa.sabir/100), 5);

            } else if (masa.durum === 'yiyor') {
                ctx.font = '20px serif';
                ctx.textAlign = 'center';
                ctx.fillText('😋', cx, py + TILE);
            }

            // Yakınsa sarı çerçeve
            const dist = Math.hypot(o.x - cx, o.y - cy);
            if (dist < TILE * 1.6 && (masa.durum === 'siparis' || masa.durum === 'hazirlaniyor')) {
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2;
                ctx.strokeRect(px+2, py+2, TILE*2-4, TILE*2-4);
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(cx - 30, py + TILE*2 + 4, 60, 16);
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('[E] Etkileş', cx, py + TILE*2 + 14);
            }
        }

        // Oyuncu
        const px = o.x, py = o.y;

        // Gölge
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(px, py + 14, 12, 5, 0, 0, Math.PI*2);
        ctx.fill();

        // Vücut (garson kıyafeti - siyah beyaz)
        ctx.fillStyle = '#1a1a1a'; // siyah pantolon
        ctx.fillRect(px-7, py+2, 6, 12);
        ctx.fillRect(px+1, py+2, 6, 12);
        ctx.fillStyle = '#fff';   // beyaz gömlek
        ctx.fillRect(px-8, py-8, 16, 12);
        ctx.fillStyle = '#cc2222'; // kırmızı papyon
        ctx.fillRect(px-4, py-9, 8, 3);
        ctx.fillStyle = '#ffc09a'; // yüz
        ctx.beginPath();
        ctx.arc(px, py-14, 9, 0, Math.PI*2);
        ctx.fill();

        // Tepsi (varsa)
        if (s.tepsi.length > 0) {
            ctx.fillStyle = 'rgba(200,160,80,0.9)';
            ctx.fillRect(px + 10, py - 20, 24, 16);
            ctx.strokeStyle = '#a07030';
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 10, py - 20, 24, 16);
            // Yemekleri göster
            s.tepsi.forEach((t, i) => {
                ctx.font = '10px serif';
                ctx.textAlign = 'center';
                ctx.fillText(t.yemek, px + 10 + 8 + i * 8, py - 8);
            });
        }

        // Mutfağa yakınsa ipucu
        if (o.y > 10 * TILE - 40) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(px - 40, py - 32, 80, 14);
            ctx.fillStyle = '#aaffcc';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('[E] Yemekleri al', px, py - 22);
        }
    }

    const handleSonuc = () => onBitis(sonucPuan >= 5);

    return (
        <div style={{ position: 'relative', userSelect: 'none' }}>
            {/* UI */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: '#f0c040', fontSize: 13 }}>⭐ {ui.puan} puan</span>
                <span style={{ color: ui.sure <= 20 ? '#ff5555' : '#aaa', fontSize: 13 }}>⏱ {ui.sure}s</span>
                <span style={{ color: '#50c878', fontSize: 12 }}>Hedef: 5+</span>
            </div>

            {/* Tepsi göstergesi */}
            <div style={{
                display: 'flex', gap: 6, alignItems: 'center',
                background: 'rgba(255,255,255,0.04)', borderRadius: 8,
                padding: '4px 10px', marginBottom: 6, minHeight: 32
            }}>
                <span style={{ color: '#888', fontSize: 11 }}>Tepsi:</span>
                {ui.tepsi.length === 0
                    ? <span style={{ color: '#444', fontSize: 11 }}>Boş</span>
                    : ui.tepsi.map((t, i) => (
                        <span key={i} style={{ fontSize: 18 }}>{t.yemek}</span>
                    ))
                }
                <span style={{ color: '#555', fontSize: 10, marginLeft: 'auto' }}>
                    {ui.tepsi.length}/{TEPSI_KAPASITESI}
                </span>
            </div>

            {/* Mesaj */}
            {ui.mesaj && (
                <div style={{
                    background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.2)',
                    borderRadius: 6, padding: '4px 10px', marginBottom: 6,
                    fontSize: 11, color: '#f0c040', textAlign: 'center'
                }}>{ui.mesaj}</div>
            )}

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={W * TILE}
                height={H * TILE}
                style={{ display: 'block', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
            />

            <div style={{ marginTop: 5, fontSize: 10, color: '#444', textAlign: 'center' }}>
                WASD / Ok — hareket &nbsp;|&nbsp; E — etkileşim
            </div>

            {/* Adım adım rehber */}
            <div style={{
                display: 'flex', gap: 8, justifyContent: 'center',
                marginTop: 6, fontSize: 10, color: '#555'
            }}>
                <span>1️⃣ Masaya git → E</span>
                <span>2️⃣ Mutfağa git → E</span>
                <span>3️⃣ Masaya geri dön → E</span>
            </div>

            {/* Sonuç overlay */}
            {bitti && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.88)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', borderRadius: 8
                }}>
                    <div style={{ fontSize: 44, marginBottom: 8 }}>
                        {sonucPuan >= 5 ? '🏆' : '😅'}
                    </div>
                    <p style={{ color: sonucPuan >= 5 ? '#50c878' : '#ff5555', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                        {sonucPuan >= 5 ? 'Harika garson!' : 'Biraz daha pratik lazım...'}
                    </p>
                    <p style={{ color: '#aaa', fontSize: 13, marginBottom: 16 }}>
                        {sonucPuan} puan toplandı
                    </p>
                    <button onClick={handleSonuc} style={{
                        background: '#ff8c42', border: 'none', color: '#fff',
                        padding: '10px 28px', borderRadius: 8, cursor: 'pointer', fontSize: 14
                    }}>Devam</button>
                </div>
            )}
        </div>
    );
}