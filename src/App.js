
import { useState, useRef } from 'react';
import StatBar from './components/StatBar';
import Saat from './components/Saat';
import OlayModal from './components/OlayModal';
import DonemSonuModal from './components/DonemSonuModal';
import OdaCanvas from './components/OdaCanvas';
import GunlukGorevler from './components/GunlukGorevler';
import { useOyun } from './hooks/useOyun';
import MiniOyun from './components/MiniOyun';
import { useKarakter } from './hooks/useKarakter';
import KarakterOzellistirme from './components/KarakterOzellistirme';
import UykuSecimModal from './components/UykuSecimModal';

function App() {
    const { statlar, saat, gun, mesaj, aktiviteYap, mevcutOlay, olaySecimi, gunlukGorevler, donem, donemSonu, devamEt, statGuncelle, miniOyun, setMiniOyun, npcKonustu, oyunBitti, oyunBitisNedeni } = useOyun();
    const [solPanelAcik, setSolPanelAcik] = useState(true);

    const { ayarlar, setAyarlar } = useKarakter();
    const [ozellistirmeAcik, setOzellistirmeAcik] = useState(false);
    const [ekranKarariyor, setEkranKarariyor] = useState(false);
    const [uykuModaliAcik, setUykuModaliAcik] = useState(false);

    const [dersBekleyen, setDersBekleyen] = useState(null);

    const handleAktiviteYap = (aktivite) => {
        if (aktivite.id === 'uyu') {
            setUykuModaliAcik(true);
        } else if (aktivite.id === 'ders') {
            setDersBekleyen(aktivite);
            setMiniOyun('dersCalisma');
        } else {
            aktiviteYap(aktivite);
        }
    };

    const handleDersBitis = (basarili) => {
        if (basarili) {
            aktiviteYap({ ...dersBekleyen, etkiler: { akademik: 15, enerji: -20, sosyal: -5 }, mesaj: 'Odaklanarak ders çalıştın! Akademik başarın arttı.' });
        } else {
            aktiviteYap({ ...dersBekleyen, etkiler: { enerji: -20 }, mesaj: 'Konsantre olamadın, sadece enerjin harcandı.' });
        }
        setDersBekleyen(null);
    };

    const uykuTimerRef = useRef([]);

    const handleUyu = (saat) => {
        setUykuModaliAcik(false);
        uykuTimerRef.current.forEach(clearTimeout);
        uykuTimerRef.current = [];
        setEkranKarariyor(true);

        const uykuAktivitesi = {
            id: 'uyu',
            sure: saat,
            etkiler: { enerji: saat * 10, saglik: Math.floor(saat * 1.25), sosyal: -5 },
            mesaj: `${saat} saat boyunca iyi bir uyku çektin.`
        };

        uykuTimerRef.current.push(
            setTimeout(() => aktiviteYap(uykuAktivitesi), 1000),
            setTimeout(() => setEkranKarariyor(false), 2000)
        );
    };

    if (oyunBitti) {
        return (
            <div style={{
                width: '100vw', height: '100vh',
                background: '#0a0a0f',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Press Start 2P', monospace",
                color: '#fff',
                gap: '32px',
            }}>
                <div style={{ fontSize: '48px' }}>💀</div>
                <h1 style={{
                    fontSize: '28px',
                    color: '#e74c3c',
                    textShadow: '0 0 20px #e74c3c',
                    letterSpacing: '4px',
                    margin: 0,
                }}>
                    OYUN BİTTİ
                </h1>
                <p style={{
                    fontSize: '11px',
                    color: '#aaa',
                    textAlign: 'center',
                    maxWidth: '400px',
                    lineHeight: '2',
                    margin: 0,
                }}>
                    {oyunBitisNedeni}
                </p>
                <div style={{
                    fontSize: '10px',
                    color: '#666',
                    textAlign: 'center',
                    lineHeight: '2',
                }}>
                    <div>{donem}. dönem • {gun}. gün</div>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: '8px',
                        padding: '14px 32px',
                        background: '#e74c3c',
                        border: 'none',
                        color: '#fff',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '11px',
                        cursor: 'pointer',
                        letterSpacing: '2px',
                    }}
                >
                    YENİDEN BAŞLA
                </button>
            </div>
        );
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
            background: '#000',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* TAM EKRAN HARİTA */}
            <div style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                position: 'fixed',
                top: 0,
                left: 0,
            }}>
                <OdaCanvas aktiviteYap={handleAktiviteYap} statlar={statlar} ekleEtki={statGuncelle} aktif={!miniOyun && !ozellistirmeAcik && !ekranKarariyor} karakterAyarlari={ayarlar} onNpcKonustu={npcKonustu} />
            </div>

            {/* MODALLER */}
            <OlayModal olay={mevcutOlay} olaySecimi={olaySecimi} />
            <DonemSonuModal donemSonu={donemSonu} statlar={statlar} donem={donem} devamEt={devamEt} />
            {miniOyun && (
                <MiniOyun
                    tip={miniOyun}
                    onKapat={() => { setMiniOyun(null); setDersBekleyen(null); }}
                    onStatGuncelle={statGuncelle}
                    onBitisCallback={dersBekleyen ? handleDersBitis : undefined}
                />
            )}

            {/* KARİYER/KARAKTER DÜĞMESİ */}
            <button
                onClick={() => setOzellistirmeAcik(true)}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(15,15,25,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    zIndex: 20,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                <span style={{ fontSize: '18px' }}>👤</span>
                Karakter
            </button>

            {/* OZELLISTIRME MODAL */}
            {ozellistirmeAcik && (
                <KarakterOzellistirme
                    karakterAyarlari={ayarlar}
                    setKarakterAyarlari={setAyarlar}
                    onClose={() => setOzellistirmeAcik(false)}
                />
            )}

            {/* UYKU SÜRESİ MODAL */}
            {uykuModaliAcik && (
                <UykuSecimModal
                    onKapat={() => setUykuModaliAcik(false)}
                    onUyu={handleUyu}
                />
            )}

            {/* SOL PANEL — Statlar */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0,
                height: '100%',
                width: solPanelAcik ? '220px' : '0px',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                zIndex: 10
            }}>
                <div style={{
                    width: '220px',
                    height: '100%',
                    background: 'rgba(8,8,16,0.92)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    overflowY: 'auto'
                }}>
                    {/* Başlık */}
                    <div style={{ textAlign: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: '9px',
                            color: '#f0c040',
                            textShadow: '0 0 20px rgba(240,192,64,0.5)',
                            lineHeight: 1.8
                        }}>
                            YURT<br />HAYATI
                        </div>
                        <div style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>
                            {donem}. Donem • {gun}. Gun
                        </div>
                    </div>

                    {/* Saat */}
                    <Saat saat={saat} gun={gun} />

                    {/* Statlar */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '14px'
                    }}>
                        <p style={{ fontSize: '9px', color: '#444', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>
                            Durum
                        </p>
                        <StatBar isim="Akademik" deger={statlar.akademik} renk="#50c878" />
                        <StatBar isim="Saglik" deger={statlar.saglik} renk="#4da6ff" />
                        <StatBar isim="Sosyal" deger={statlar.sosyal} renk="#ff8c42" />
                        <StatBar isim="Enerji" deger={statlar.enerji} renk="#b57bee" />
                        <div style={{
                            marginTop: '12px',
                            padding: '8px 12px',
                            background: 'rgba(240,192,64,0.06)',
                            border: '1px solid rgba(240,192,64,0.12)',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '10px', color: '#555' }}>PARA</span>
                            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: '#f0c040' }}>
                                {statlar.para}₺
                            </span>
                        </div>
                    </div>
                    {/* Mesaj */}
                    {mesaj && (
                        <div style={{
                            background: 'rgba(240,192,64,0.05)',
                            border: '1px solid rgba(240,192,64,0.15)',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '11px',
                            color: '#f0c040',
                            lineHeight: 1.6
                        }}>
                            {mesaj}
                        </div>
                    )}

                    {/* Görevler */}
                    <GunlukGorevler gorevler={gunlukGorevler} />
                </div>
            </div>

            {/* Uyku Geciş Ekranı */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'black',
                zIndex: 9999,
                opacity: ekranKarariyor ? 1 : 0,
                pointerEvents: ekranKarariyor ? 'all' : 'none',
                transition: 'opacity 1s ease-in-out'
            }} />
        </div>
    );
}

export default App;