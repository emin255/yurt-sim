import StatBar from './components/StatBar';
import Saat from './components/Saat';
import Aktiviteler from './components/Aktiviteler';
import OlayModal from './components/OlayModal';
import { useOyun } from './hooks/useOyun';
import OdaCanvas from './components/OdaCanvas';
import GunlukGorevler from './components/GunlukGorevler';
import DonemSonuModal from './components/DonemSonuModal';
function App() {
    const { statlar, saat, gun, mesaj, aktiviteYap, mevcutOlay, olaySecimi,gunlukGorevler,donem, donemSonu, devamEt } = useOyun();
    
    return (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "'Inter', sans-serif"
    }}>
        <OlayModal olay={mevcutOlay} olaySecimi={olaySecimi} />
        <DonemSonuModal
            donemSonu={donemSonu}
            statlar={statlar}
            donem={donem}
            devamEt={devamEt}
        />

        <div style={{
            width: '100%',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            {/* BAŞLIK */}
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <h1 style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '16px',
                    color: '#f0c040',
                    textShadow: '0 0 30px rgba(240,192,64,0.5)',
                    letterSpacing: '2px',
                    lineHeight: '1.6'
                }}>
                    YURT HAYATI
                </h1>
            </div>

            <Saat saat={saat} gun={gun} />
            <OdaCanvas aktiviteYap={aktiviteYap} statlar={statlar} />

            {/* STATLAR */}
            <div style={{
                background: '#0e0e1a',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '18px',
                borderRadius: '16px'
            }}>
                <p style={{
                    fontSize: '10px', color: '#444',
                    letterSpacing: '2px', marginBottom: '14px',
                    textTransform: 'uppercase', fontWeight: '600'
                }}>Durum</p>
                <StatBar isim="Akademik" deger={statlar.akademik} renk="#50c878" />
                <StatBar isim="Saglik"   deger={statlar.saglik}   renk="#4da6ff" />
                <StatBar isim="Sosyal"   deger={statlar.sosyal}   renk="#ff8c42" />
                <StatBar isim="Enerji"   deger={statlar.enerji}   renk="#b57bee" />
                <div style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    background: 'rgba(240,192,64,0.06)',
                    border: '1px solid rgba(240,192,64,0.15)',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '11px', color: '#666', letterSpacing: '1px' }}>PARA</span>
                    <span style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '13px',
                        color: '#f0c040'
                    }}>
                        {statlar.para} TL
                    </span>
                </div>
            </div>

            {/* MESAJ */}
            {mesaj && (
                <div style={{
                    background: 'rgba(240,192,64,0.05)',
                    border: '1px solid rgba(240,192,64,0.2)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#f0c040',
                    lineHeight: '1.6',
                    animation: 'fade-in 0.3s ease'
                }}>
                    {mesaj}
                </div>
            )}

            {/* AKTİVİTELER */}
            <div style={{
                background: '#0e0e1a',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '18px',
                borderRadius: '16px'
            }}>
                <Aktiviteler aktiviteYap={aktiviteYap} />
            </div>

            {/* GÜNLÜK GÖREVLER */}
            <GunlukGorevler gorevler={gunlukGorevler} />
        </div>
    </div>
);
}

export default App;