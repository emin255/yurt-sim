import StatBar from './components/StatBar';
import Saat from './components/Saat';
import Aktiviteler from './components/Aktiviteler';
import OlayModal from './components/OlayModal';
import { useOyun } from './hooks/useOyun';

function App() {
    const { statlar, saat, gun, mesaj, aktiviteYap, mevcutOlay, olaySecimi } = useOyun();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            padding: '24px 16px'
        }}>
            {/* OLAY MODALI */}
            <OlayModal olay={mevcutOlay} olaySecimi={olaySecimi} />

            <div style={{
                width: '100%',
                maxWidth: '460px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '28px',
                        color: '#ffd700',
                        textShadow: '0 0 20px rgba(255,215,0,0.4)',
                        letterSpacing: '2px'
                    }}>
                        YURT HAYATI
                    </h1>
                    <p style={{ color: '#888', fontSize: '13px' }}>{gun}. Gün</p>
                </div>

                <Saat saat={saat} gun={gun} />

                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '20px',
                    borderRadius: '16px'
                }}>
                    <h3 style={{
                        color: '#aaa',
                        fontSize: '12px',
                        letterSpacing: '2px',
                        marginBottom: '16px',
                        textTransform: 'uppercase'
                    }}>
                        Durum
                    </h3>
                    <StatBar isim="Akademik" deger={statlar.akademik} renk="#4CAF50" />
                    <StatBar isim="Saglik"   deger={statlar.saglik}   renk="#2196F3" />
                    <StatBar isim="Sosyal"   deger={statlar.sosyal}   renk="#ff9800" />
                    <StatBar isim="Enerji"   deger={statlar.enerji}   renk="#9C27B0" />
                    <div style={{
                        marginTop: '16px',
                        padding: '10px 14px',
                        background: 'rgba(255,215,0,0.08)',
                        border: '1px solid rgba(255,215,0,0.2)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ color: '#aaa', fontSize: '13px' }}>Para</span>
                        <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '18px' }}>
                            {statlar.para} TL
                        </span>
                    </div>
                </div>

                {mesaj && (
                    <div style={{
                        background: 'rgba(255,215,0,0.06)',
                        border: '1px solid rgba(255,215,0,0.25)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: '#ffd700',
                        lineHeight: '1.5'
                    }}>
                        {mesaj}
                    </div>
                )}

                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '20px',
                    borderRadius: '16px'
                }}>
                    <Aktiviteler aktiviteYap={aktiviteYap} />
                </div>
            </div>
        </div>
    );
}

export default App;