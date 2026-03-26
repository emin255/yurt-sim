import { useState, useEffect, useRef, useCallback } from 'react';
import GarsonlukOyunu from './GarsonlukOyunu';
// ============================================================
// CV HAZIRLAMA — İş Teklifi
// ============================================================
function CVHazırlama({ onBitis }) {
    const bolumler = [
        { id: 'egitim', baslik: '🎓 Eğitim', dogru: ['Üniversite', 'Bölüm', 'GPA'] },
        { id: 'deneyim', baslik: '💼 Deneyim', dogru: ['Staj', 'Proje', 'Görev'] },
        { id: 'beceri', baslik: '⚡ Beceriler', dogru: ['Python', 'Excel', 'Sunum'] },
    ];
    const tumKelimeler = [
        'Üniversite', 'Bölüm', 'GPA',
        'Staj', 'Proje', 'Görev',
        'Python', 'Excel', 'Sunum',
        'Hobi', 'Selfie', 'Oyun'
    ];
    const [karisik] = useState(() => [...tumKelimeler].sort(() => Math.random() - 0.5));
    const [yerlestirilen, setYerlestirilen] = useState({ egitim: [], deneyim: [], beceri: [] });
    const [secilen, setSecilen] = useState(null);
    const [sonuc, setSonuc] = useState(null);
    const [sure, setSure] = useState(45);
    const [kullanilan, setKullanilan] = useState([]);

    useEffect(() => {
        if (sonuc) return;
        const t = setInterval(() => setSure(s => {
            if (s <= 1) { setSonuc('basarisiz'); return 0; }
            return s - 1;
        }), 1000);
        return () => clearInterval(t);
    }, [sonuc]);

    const kelimeTikla = (k) => {
        if (kullanilan.includes(k)) return;
        setSecilen(k);
    };

    const bolumeTikla = (bolumId) => {
        if (!secilen) return;
        const bolum = bolumler.find(b => b.id === bolumId);
        if (yerlestirilen[bolumId].length >= 3) return;

        const yeni = { ...yerlestirilen, [bolumId]: [...yerlestirilen[bolumId], secilen] };
        setYerlestirilen(yeni);
        setKullanilan(k => [...k, secilen]);
        setSecilen(null);

        const tamam = Object.keys(yeni).every(k => yeni[k].length === 3);
        if (tamam) {
            let dogru = 0;
            bolumler.forEach(b => {
                yeni[b.id].forEach(k => { if (b.dogru.includes(k)) dogru++; });
            });
            setTimeout(() => setSonuc(dogru >= 7 ? 'basarili' : 'basarisiz'), 300);
        }
    };

    const kelimeCikar = (bolumId, k) => {
        setYerlestirilen(y => ({ ...y, [bolumId]: y[bolumId].filter(x => x !== k) }));
        setKullanilan(k2 => k2.filter(x => x !== k));
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#aaa', fontSize: 11, marginBottom: 12 }}>
                Kelimeleri doğru CV bölümlerine yerleştir! ⏱ <span style={{ color: sure <= 10 ? '#ff5555' : '#fff' }}>{sure}s</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
                {karisik.map(k => (
                    <button key={k} onClick={() => kelimeTikla(k)} style={{
                        padding: '6px 12px', borderRadius: 20, fontSize: 12,
                        cursor: kullanilan.includes(k) ? 'default' : 'pointer',
                        background: kullanilan.includes(k) ? 'rgba(255,255,255,0.03)' : secilen === k ? '#4da6ff' : 'rgba(255,255,255,0.1)',
                        border: `1px solid ${secilen === k ? '#4da6ff' : 'rgba(255,255,255,0.15)'}`,
                        color: kullanilan.includes(k) ? '#333' : '#fff',
                        transition: 'all 0.15s'
                    }}>{k}</button>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bolumler.map(b => (
                    <div key={b.id} onClick={() => bolumeTikla(b.id)} style={{
                        background: secilen ? 'rgba(77,166,255,0.08)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${secilen ? 'rgba(77,166,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 10, padding: '10px 14px',
                        cursor: secilen ? 'pointer' : 'default', transition: 'all 0.2s'
                    }}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 6, textAlign: 'left' }}>{b.baslik}</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 28 }}>
                            {yerlestirilen[b.id].map(k => (
                                <span key={k} onClick={(e) => { e.stopPropagation(); kelimeCikar(b.id, k); }} style={{
                                    padding: '4px 10px', borderRadius: 16, fontSize: 11,
                                    background: b.dogru.includes(k) ? 'rgba(80,200,120,0.2)' : 'rgba(255,85,85,0.2)',
                                    border: `1px solid ${b.dogru.includes(k) ? '#50c878' : '#ff5555'}`,
                                    color: '#fff', cursor: 'pointer'
                                }}>{k} ×</span>
                            ))}
                            {yerlestirilen[b.id].length < 3 && (
                                <span style={{ fontSize: 11, color: '#333', alignSelf: 'center' }}>
                                    {3 - yerlestirilen[b.id].length} boş
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {sonuc && (
                <div style={{ marginTop: 16 }}>
                    <p style={{ color: sonuc === 'basarili' ? '#50c878' : '#ff5555', fontSize: 15, fontWeight: 'bold' }}>
                        {sonuc === 'basarili' ? '🎉 CV hazır! İşe alındın!' : '❌ CV çok karışık oldu...'}
                    </p>
                    <button onClick={() => onBitis(sonuc === 'basarili')} style={{
                        marginTop: 10, background: '#4da6ff', border: 'none',
                        color: '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14
                    }}>Devam</button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// DİYALOG — Arkadaş Daveti
// ============================================================
function DiyalogOyunu({ onBitis }) {
    const senaryolar = [
        {
            durum: '😟 Arkadaşın üzgün görünüyor...',
            soyluyor: '"Bugün çok kötü bir gün geçirdim, sınav berbat gitti."',
            secenekler: [
                { yazi: '"Geçmiş olsun, anlat bakalım ne oldu?"', puan: 3, tepki: '😊 Arkadaşın rahatladı!' },
                { yazi: '"Ben de sınavda kötü yaptım zaten."', puan: 1, tepki: '😐 Arkadaşın biraz hayal kırıklığı yaşadı.' },
                { yazi: '"Daha çok çalışmalıydın."', puan: 0, tepki: '😠 Arkadaşın kızdı!' },
            ]
        },
        {
            durum: '🎂 Arkadaşının doğum günü!',
            soyluyor: '"Bugün doğum günüm, kutlamak ister misin?"',
            secenekler: [
                { yazi: '"Tabii! Ne yapmak istersin?"', puan: 3, tepki: '🎉 Arkadaşın çok mutlu oldu!' },
                { yazi: '"Bugün biraz meşgulüm ama uğrarım."', puan: 1, tepki: '🙂 Arkadaşın anlayış gösterdi.' },
                { yazi: '"Zaten her yıl kutluyoruz, gerek var mı?"', puan: 0, tepki: '😢 Arkadaşın üzüldü.' },
            ]
        },
        {
            durum: '🤔 Arkadaşın tavsiye istiyor...',
            soyluyor: '"Bölümümü değiştirmeyi düşünüyorum, ne dersin?"',
            secenekler: [
                { yazi: '"Artıları eksilerini düşün, sana yardım edeyim."', puan: 3, tepki: '😊 Arkadaşın çok memnun kaldı!' },
                { yazi: '"Bilmiyorum, senin bileceğin iş."', puan: 1, tepki: '😐 Arkadaşın beklediği cevabı alamadı.' },
                { yazi: '"Değiştirme, boşa para gider."', puan: 0, tepki: '😤 Arkadaşın sinirle ayrıldı.' },
            ]
        },
        {
            durum: '🎮 Arkadaşın oyun oynamak istiyor...',
            soyluyor: '"Bu akşam online oyun oynar mısın benimle?"',
            secenekler: [
                { yazi: '"Tabii! Saat kaçta başlıyoruz?"', puan: 3, tepki: '🎮 Harika bir gece geçirdiniz!' },
                { yazi: '"Belki, göreceğiz."', puan: 1, tepki: '🙂 Arkadaşın umutla bekledi.' },
                { yazi: '"Oyun oynamak zaman kaybı."', puan: 0, tepki: '😞 Arkadaşın çok üzüldü.' },
            ]
        },
    ];

    const [siradaki, setSiradaki] = useState(0);
    const [toplamPuan, setToplamPuan] = useState(0);
    const [sonTepki, setSonTepki] = useState(null);
    const [sonuc, setSonuc] = useState(null);
    const bekleyenPuan = useRef(0);

    const secimYap = (secenek) => {
        setSonTepki(secenek.tepki);
        bekleyenPuan.current += secenek.puan;
        setTimeout(() => {
            setSonTepki(null);
            const yeniSira = siradaki + 1;
            if (yeniSira >= senaryolar.length) {
                setToplamPuan(bekleyenPuan.current);
                setSonuc(bekleyenPuan.current >= 8 ? 'basarili' : 'basarisiz');
            } else {
                setToplamPuan(bekleyenPuan.current);
                setSiradaki(yeniSira);
            }
        }, 1500);
    };

    const senaryo = senaryolar[siradaki];

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#aaa', fontSize: 11 }}>Durum {siradaki + 1}/{senaryolar.length}</span>
                <span style={{ color: '#50c878', fontSize: 11 }}>❤️ İlişki: {toplamPuan}</span>
            </div>
            {!sonuc && (
                <>
                    <div style={{
                        background: 'rgba(181,123,238,0.08)', border: '1px solid rgba(181,123,238,0.25)',
                        borderRadius: 12, padding: 14, marginBottom: 12
                    }}>
                        <p style={{ color: '#b57bee', fontSize: 12, marginBottom: 8 }}>{senaryo.durum}</p>
                        <p style={{ color: '#ddd', fontSize: 13, fontStyle: 'italic' }}>{senaryo.soyluyor}</p>
                    </div>
                    {sonTepki ? (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)', borderRadius: 10,
                            padding: 16, fontSize: 14, color: '#f0c040', minHeight: 60,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>{sonTepki}</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {senaryo.secenekler.map((s, i) => (
                                <button key={i} onClick={() => secimYap(s)} style={{
                                    padding: '12px 16px', borderRadius: 10, textAlign: 'left',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                                    color: '#ddd', cursor: 'pointer', fontSize: 12, lineHeight: 1.5,
                                    transition: 'all 0.15s'
                                }}>{s.yazi}</button>
                            ))}
                        </div>
                    )}
                </>
            )}
            {sonuc && (
                <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>
                        {toplamPuan >= 10 ? '🏆' : toplamPuan >= 8 ? '😊' : toplamPuan >= 5 ? '😐' : '😞'}
                    </div>
                    <p style={{ color: sonuc === 'basarili' ? '#50c878' : '#ff5555', fontSize: 15, fontWeight: 'bold' }}>
                        {sonuc === 'basarili'
                            ? `Harika arkadaş! ${toplamPuan}/12 puan!`
                            : `Arkadaşlık biraz zorlandı... ${toplamPuan}/12`}
                    </p>
                    <button onClick={() => onBitis(sonuc === 'basarili')} style={{
                        marginTop: 12, background: '#50c878', border: 'none',
                        color: '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14
                    }}>Devam</button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// DANS RİTİM — Parti
// ============================================================
function DansRitim({ onBitis }) {
    const tuslar = [
        { id: 'ArrowUp',    emoji: '⬆️', renk: '#e74c3c' },
        { id: 'ArrowDown',  emoji: '⬇️', renk: '#3498db' },
        { id: 'ArrowLeft',  emoji: '⬅️', renk: '#2ecc71' },
        { id: 'ArrowRight', emoji: '➡️', renk: '#f39c12' },
    ];

    const [dizi, setDizi] = useState([]);
    const [parlayan, setParlayan] = useState(null);
    const [combo, setCombo] = useState(0);
    const [puan, setPuan] = useState(0);
    const [sonuc, setSonuc] = useState(null);
    const [sure, setSure] = useState(30);
    const [yanlis, setYanlis] = useState(false);
    const diziRef = useRef([]);
    const comboRef = useRef(0);
    const puanRef = useRef(0);

    useEffect(() => {
        if (sonuc) return;
        const t = setInterval(() => {
            const yeniTus = tuslar[Math.floor(Math.random() * 4)].id;
            diziRef.current = [...diziRef.current, yeniTus].slice(-6);
            setDizi([...diziRef.current]);
        }, 800);
        return () => clearInterval(t);
    }, [sonuc]);

    useEffect(() => {
        if (sonuc) return;
        const t = setInterval(() => setSure(s => {
            if (s <= 1) {
                setSonuc(puanRef.current >= 15 ? 'basarili' : 'basarisiz');
                return 0;
            }
            return s - 1;
        }), 1000);
        return () => clearInterval(t);
    }, [sonuc]);

    const tusBas = useCallback((tusId) => {
        if (diziRef.current.length === 0) return;
        setParlayan(tusId);
        setTimeout(() => setParlayan(null), 150);

        const hedef = diziRef.current[0];
        if (tusId === hedef) {
            comboRef.current += 1;
            const kazanilan = comboRef.current >= 3 ? 3 : 1;
            puanRef.current += kazanilan;
            setPuan(puanRef.current);
            setCombo(comboRef.current);
            diziRef.current = diziRef.current.slice(1);
            setDizi([...diziRef.current]);
            setYanlis(false);
        } else {
            comboRef.current = 0;
            setCombo(0);
            setYanlis(true);
            setTimeout(() => setYanlis(false), 300);
        }
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (tuslar.find(t => t.id === e.key)) { e.preventDefault(); tusBas(e.key); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [tusBas]);

    const hedefTus = tuslar.find(t => t.id === dizi[0]);

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#f0c040', fontSize: 12 }}>⭐ {puan}</span>
                <span style={{ color: sure <= 10 ? '#ff5555' : '#aaa', fontSize: 12 }}>⏱ {sure}s</span>
                <span style={{ color: combo >= 3 ? '#ff8c42' : '#aaa', fontSize: 12 }}>
                    {combo >= 3 ? `🔥 ${combo}x COMBO!` : `Combo: ${combo}`}
                </span>
            </div>
            <div style={{
                background: yanlis ? 'rgba(255,85,85,0.15)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${yanlis ? '#ff5555' : hedefTus ? hedefTus.renk + '66' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 16, padding: '20px 0', marginBottom: 12, transition: 'all 0.1s'
            }}>
                <p style={{ color: '#555', fontSize: 10, marginBottom: 8 }}>SIRADAKI</p>
                <div style={{ fontSize: 48 }}>{hedefTus ? hedefTus.emoji : '🎵'}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12, height: 32 }}>
                {dizi.slice(1, 5).map((d, i) => {
                    const t = tuslar.find(t => t.id === d);
                    return <span key={i} style={{ fontSize: 20, opacity: 1 - i * 0.2 }}>{t?.emoji}</span>;
                })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 200, margin: '0 auto' }}>
                {tuslar.map(t => (
                    <button key={t.id} onClick={() => tusBas(t.id)} style={{
                        height: 70, fontSize: 28, borderRadius: 12, border: 'none',
                        background: parlayan === t.id ? t.renk : t.renk + '33',
                        cursor: 'pointer', transition: 'all 0.1s',
                        transform: parlayan === t.id ? 'scale(0.95)' : 'scale(1)',
                        boxShadow: parlayan === t.id ? `0 0 20px ${t.renk}` : 'none'
                    }}>{t.emoji}</button>
                ))}
            </div>
            <p style={{ color: '#444', fontSize: 10, marginTop: 8 }}>Klavye ok tuşlarını da kullanabilirsin</p>
            {sonuc && (
                <div style={{ marginTop: 12 }}>
                    <p style={{ color: sonuc === 'basarili' ? '#50c878' : '#ff5555', fontSize: 15, fontWeight: 'bold' }}>
                        {sonuc === 'basarili' ? `🕺 Dans pistini yaktın! ${puan} puan!` : `😅 Ritmi tutturamadın. ${puan}/15`}
                    </p>
                    <button onClick={() => onBitis(sonuc === 'basarili')} style={{
                        marginTop: 10, background: '#b57bee', border: 'none',
                        color: '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14
                    }}>Devam</button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// KODLAMA / YAZMA — Sınav / Hackathon
// ============================================================
function KodlamaOyunu({ onBitis }) {
    const kelimeler = ['react', 'state', 'props', 'hook', 'canvas', 'render', 'bug', 'debug', 'deploy', 'github', 'commit'];
    const [aktifKelimeler, setAktifKelimeler] = useState([]);
    const [yazilan, setYazilan] = useState('');
    const [puan, setPuan] = useState(0);
    const [sure, setSure] = useState(30);
    const [sonuc, setSonuc] = useState(null);
    const puanRef = useRef(0);
    const yazilanRef = useRef('');
    const aktifKelimelerRef = useRef([]);
    const sonucRef = useRef(null);

    const kelimeUret = useCallback(() => {
        const kelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];
        const x = Math.random() * 80 + 10; // %10 ile %90 arası x pozisyonu
        return { id: Math.random().toString(), metin: kelime, y: -10, x, hiz: Math.random() * 1.5 + 0.5 };
    }, []);

    useEffect(() => {
        if (sonuc) return;
        const uretici = setInterval(() => {
            setAktifKelimeler(k => [...k, kelimeUret()]);
        }, 1500);
        return () => clearInterval(uretici);
    }, [sonuc, kelimeUret]);

    useEffect(() => {
        if (sonuc) return;
        let p = puanRef.current;
        const dongu = setInterval(() => {
            setAktifKelimeler(kel => {
                const yeni = kel.map(k => ({ ...k, y: k.y + k.hiz }));
                // Aşağı düşenleri sil ve puan kır
                const kacanlar = yeni.filter(k => k.y > 105);
                if (kacanlar.length > 0) {
                    puanRef.current = Math.max(0, puanRef.current - kacanlar.length * 2);
                    setPuan(puanRef.current);
                }
                return yeni.filter(k => k.y <= 105);
            });
        }, 50);
        return () => clearInterval(dongu);
    }, [sonuc]);

    useEffect(() => {
        if (sonuc) return;
        const t = setInterval(() => setSure(s => {
            if (s <= 1) {
                setSonuc(puanRef.current >= 20 ? 'basarili' : 'basarisiz');
                return 0;
            }
            return s - 1;
        }), 1000);
        return () => clearInterval(t);
    }, [sonuc]);

    useEffect(() => { yazilanRef.current = yazilan; }, [yazilan]);
    useEffect(() => { aktifKelimelerRef.current = aktifKelimeler; }, [aktifKelimeler]);
    useEffect(() => { sonucRef.current = sonuc; }, [sonuc]);

    const tusBas = useCallback((e) => {
        if (sonucRef.current) return;
        const harf = e.key.toLowerCase();
        if (harf.length !== 1 || !harf.match(/[a-z]/)) return;

        const yeniYazilan = yazilanRef.current + harf;
        setYazilan(yeniYazilan);

        // Eşleşen var mı?
        const eslesen = aktifKelimelerRef.current.find(k => k.metin === yeniYazilan);
        if (eslesen) {
            setPuan(p => {
                const yeniP = p + 5;
                puanRef.current = yeniP;
                return yeniP;
            });
            setAktifKelimeler(k => k.filter(x => x.id !== eslesen.id));
            setYazilan('');
        } else if (aktifKelimelerRef.current.every(k => !k.metin.startsWith(yeniYazilan))) {
            // Hiçbir şeyle uyuşmuyorsa sıfırla
            setYazilan('');
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', tusBas);
        return () => window.removeEventListener('keydown', tusBas);
    }, [tusBas]);

    return (
        <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#50c878', fontSize: 13 }}>⭐ Puan: {puan}/20</span>
                <span style={{ color: sure <= 10 ? '#ff5555' : '#aaa', fontSize: 13 }}>⏱ {sure}s</span>
            </div>
            {!sonuc && (
                <>
                    <div style={{
                        position: 'relative', height: 200, background: '#111424',
                        border: '1px solid #334', borderRadius: 12, overflow: 'hidden',
                        marginBottom: 16
                    }}>
                        {aktifKelimeler.map(k => (
                            <div key={k.id} style={{
                                position: 'absolute', left: `${k.x}%`, top: `${k.y}%`,
                                transform: 'translateX(-50%)',
                                color: k.metin.startsWith(yazilan) ? '#4da6ff' : '#aaa',
                                fontSize: 14, fontFamily: 'monospace',
                                transition: 'color 0.1s'
                            }}>
                                {k.metin}
                            </div>
                        ))}
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8,
                        fontSize: 20, fontFamily: 'monospace', color: yazilan ? '#fff' : '#555',
                        minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {yazilan || 'Yazmaya başla...'}
                    </div>
                </>
            )}
            {sonuc && (
                <div style={{ marginTop: 20 }}>
                    <p style={{ color: sonuc === 'basarili' ? '#50c878' : '#ff5555', fontSize: 16, fontWeight: 'bold' }}>
                        {sonuc === 'basarili' ? `🚀 Kodlar çalıştı! ${puan} puan!` : `🐛 Bug'larda boğuldun... ${puan} puan.`}
                    </p>
                    <button onClick={() => onBitis(sonuc === 'basarili')} style={{
                        marginTop: 16, background: '#4da6ff', border: 'none',
                        color: '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14
                    }}>Devam</button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// HAFIZA OYUNU — Sınav / Analitik
// ============================================================
function HafizaOyunu({ onBitis }) {
    const emojiler = ['🧠', '📚', '🎒', '✏️', '💻', '☕', '🤓', '⏰'];
    const [kartlar, setKartlar] = useState([]);
    const [acikKartlar, setAcikKartlar] = useState([]);
    const [eslesenler, setEslesenler] = useState([]);
    const [hamle, setHamle] = useState(0);
    const [sonuc, setSonuc] = useState(null);
    const timeoutsRef = useRef([]);

    useEffect(() => {
        return () => timeoutsRef.current.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        const ciftler = [...emojiler, ...emojiler].sort(() => Math.random() - 0.5);
        setKartlar(ciftler);
    }, []);

    const kartTikla = (index) => {
        if (acikKartlar.length === 2 || acikKartlar.includes(index) || eslesenler.includes(index) || sonuc) return;
        
        const yeniAcik = [...acikKartlar, index];
        setAcikKartlar(yeniAcik);
        
        if (yeniAcik.length === 2) {
            setHamle(h => h + 1);
            if (kartlar[yeniAcik[0]] === kartlar[yeniAcik[1]]) {
                const yeniEslesenler = [...eslesenler, yeniAcik[0], yeniAcik[1]];
                setEslesenler(yeniEslesenler);
                setAcikKartlar([]);
                if (yeniEslesenler.length === kartlar.length) {
                    // Oyun bitti
                    timeoutsRef.current.push(setTimeout(() => setSonuc(hamle <= 15 ? 'basarili' : 'basarisiz'), 500));
                }
            } else {
                timeoutsRef.current.push(setTimeout(() => setAcikKartlar([]), 800));
            }
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#aaa', fontSize: 12 }}>Eşleşme: {eslesenler.length / 2}/8</span>
                <span style={{ color: hamle > 15 ? '#ff5555' : '#f0c040', fontSize: 12 }}>🔄 Hamle: {hamle}/15</span>
            </div>
            {!sonuc && (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
                    maxWidth: 300, margin: '0 auto'
                }}>
                    {kartlar.map((emoji, index) => {
                        const acik = acikKartlar.includes(index) || eslesenler.includes(index);
                        return (
                            <div key={index} onClick={() => kartTikla(index)} style={{
                                width: '100%', aspectRatio: '1', background: acik ? '#222633' : '#4da6ff',
                                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 32, cursor: acik ? 'default' : 'pointer',
                                transition: 'all 0.3s', border: `1px solid ${acik ? '#4da6ff' : 'transparent'}`,
                                transform: acik ? 'rotateY(180deg)' : 'rotateY(0)'
                            }}>
                                <span style={{ transform: acik ? 'rotateY(180deg)' : 'rotateY(0)', opacity: acik ? 1 : 0 }}>
                                    {emoji}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
            {sonuc && (
                <div style={{ marginTop: 20 }}>
                    <p style={{ color: sonuc === 'basarili' ? '#50c878' : '#ff5555', fontSize: 16, fontWeight: 'bold' }}>
                        {sonuc === 'basarili' ? `🧠 Zehir gibi hafıza! (${hamle} hamle)` : `🤕 Kafan biraz dağınık... (${hamle} hamle)`}
                    </p>
                    <button onClick={() => onBitis(sonuc === 'basarili')} style={{
                        marginTop: 16, background: '#4da6ff', border: 'none',
                        color: '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14
                    }}>Devam</button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// TEMİZLİK / TAMİR — Tıklama Oyunu
// ============================================================
function TemizlikOyunu({ onBitis }) {
    const [hedefler, setHedefler] = useState([]);
    const [puan, setPuan] = useState(0);
    const [sure, setSure] = useState(20);
    const [sonuc, setSonuc] = useState(null);
    const puanRef = useRef(0);

    useEffect(() => {
        if (sonuc) return;
        const uretici = setInterval(() => {
            const yeni = {
                id: Math.random().toString(),
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
                boy: Math.random() * 20 + 30
            };
            setHedefler(h => [...h, yeni].slice(-5)); // Ekranda max 5 görev
        }, 800);
        return () => clearInterval(uretici);
    }, [sonuc]);

    useEffect(() => {
        if (sonuc) return;
        const t = setInterval(() => setSure(s => {
            if (s <= 1) {
                setSonuc(puanRef.current >= 15 ? 'basarili' : 'basarisiz');
                return 0;
            }
            return s - 1;
        }), 1000);
        return () => clearInterval(t);
    }, [sonuc]);

    const tikla = (id) => {
        if (sonuc) return;
        setHedefler(h => h.filter(x => x.id !== id));
        setPuan(p => {
            const yeni = p + 1;
            puanRef.current = yeni;
            return yeni;
        });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#ff8c42', fontSize: 13 }}>Giderilen: {puan}/15</span>
                <span style={{ color: sure <= 5 ? '#ff5555' : '#aaa', fontSize: 13 }}>⏱ {sure}s</span>
            </div>
            {!sonuc && (
                <div style={{
                    position: 'relative', height: 250, background: 'rgba(255,140,66,0.05)',
                    border: '2px dashed rgba(255,140,66,0.3)', borderRadius: 16, cursor: 'crosshair',
                    overflow: 'hidden'
                }}>
                    {hedefler.map(h => (
                        <div key={h.id} onMouseDown={() => tikla(h.id)} style={{
                            position: 'absolute', left: `${h.x}%`, top: `${h.y}%`,
                            width: h.boy, height: h.boy, background: '#ff5555',
                            borderRadius: '50%', transform: 'translate(-50%, -50%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: h.boy/2, boxShadow: '0 4px 12px rgba(255,85,85,0.4)',
                            animation: 'fade-in 0.2s ease-out'
                        }}>
                            🛠
                        </div>
                    ))}
                    {hedefler.length === 0 && <span style={{ color: '#666', fontSize: 12, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>Sorun çıkması bekleniyor...</span>}
                </div>
            )}
            {sonuc && (
                <div style={{ marginTop: 20 }}>
                    <p style={{ color: sonuc === 'basarili' ? '#50c878' : '#ff5555', fontSize: 16, fontWeight: 'bold' }}>
                        {sonuc === 'basarili' ? `🧹 Her yer tertemiz! (${puan} düzeltildi)` : `⚠️ İpler koptu... Yetişemedin. (${puan})`}
                    </p>
                    <button onClick={() => onBitis(sonuc === 'basarili')} style={{
                        marginTop: 16, background: '#ff8c42', border: 'none',
                        color: '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14
                    }}>Devam</button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// ANA MODAL
// ============================================================
const OYUN_TIPLERI = {
    is:       { baslik: '💼 CV Hazırlama',    renk: '#4da6ff', oyun: CVHazırlama,   basari: { akademik: 15, para: 200 }, basarisiz: { enerji: -15 } },
    parti:    { baslik: '🎉 Parti & Dans',    renk: '#b57bee', oyun: DansRitim,     basari: { sosyal: 25, enerji: 10 },  basarisiz: { enerji: -10 } },
    parttime: { baslik: "🍽️ Garsonluk",       renk: '#ff8c42', oyun: GarsonlukOyunu,basari: { para: 200, enerji: -15 }, basarisiz: { enerji: -20 } },
    arkadas:  { baslik: '💬 İletişim',        renk: '#50c878', oyun: DiyalogOyunu,  basari: { sosyal: 30, enerji: -5 }, basarisiz: { sosyal: -10, enerji: -10 } },
    kodlama:  { baslik: '💻 Kodlama',         renk: '#4da6ff', oyun: KodlamaOyunu,  basari: { akademik: 30, enerji: -15 }, basarisiz: { akademik: -10, enerji: -25 } },
    hafiza:   { baslik: '🧠 Odak ve Hafıza',  renk: '#b57bee', oyun: HafizaOyunu,   basari: { akademik: 25, saglik: 10 }, basarisiz: { akademik: -15, enerji: -10 } },
    temizlik: { baslik: '🛠️ Hızlı Müdahale',  renk: '#ff5555', oyun: TemizlikOyunu, basari: { saglik: 15, sosyal: 10 }, basarisiz: { saglik: -10, enerji: -15 } },
};

function MiniOyun({ tip, onKapat, onStatGuncelle }) {
    const config = OYUN_TIPLERI[tip];
    if (!config) return null;
    const Oyun = config.oyun;

    const handleBitis = (basarili) => {
        onStatGuncelle(basarili ? config.basari : config.basarisiz);
        onKapat();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: '#0e0e1a', border: `1px solid ${config.renk}44`,
                borderRadius: 16, padding: 24, width: 620,
                maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto',
                boxShadow: `0 0 60px ${config.renk}18`
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <h2 style={{ margin: 0, fontSize: 14, color: config.renk, fontFamily: "'Press Start 2P', monospace" }}>
                        {config.baslik}
                    </h2>
                    <button onClick={onKapat} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18 }}>✕</button>
                </div>
                <Oyun onBitis={handleBitis} />
            </div>
        </div>
    );
}

export default MiniOyun;
export { OYUN_TIPLERI };