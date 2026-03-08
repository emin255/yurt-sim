function DonemSonuModal({ donemSonu, statlar, donem, devamEt }) {
    if (!donemSonu) return null;

    // Not hesapla
    function notHesapla(akademik) {
        if (akademik >= 85) return { harf: 'AA', renk: '#4CAF50', mesaj: 'Mukemmel! Butun dersleri gectin.' };
        if (akademik >= 70) return { harf: 'BB', renk: '#8BC34A', mesaj: 'Iyi! Dersleri basariyla gectin.' };
        if (akademik >= 60) return { harf: 'CC', renk: '#FFC107', mesaj: 'Ortalama. Daha cok calismalisin.' };
        if (akademik >= 50) return { harf: 'DD', renk: '#FF9800', mesaj: 'Zor gectin. Dikkatli ol!' };
        return { harf: 'FF', renk: '#f44336', mesaj: 'Sinavi gecemedin! Tekrar edeceksin.' };
    }

    const not = notHesapla(statlar.akademik);
    const gecti = statlar.akademik >= 50;
    const bursFirsati = statlar.para < 100;
    const arkadasKazandi = statlar.sosyal >= 60;
    const arkadasKaybetti = statlar.sosyal < 30;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(6px)'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                border: `1px solid ${not.renk}44`,
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '420px',
                width: '90%',
                boxShadow: `0 0 80px ${not.renk}22`
            }}>
                {/* Başlık */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <p style={{ color: '#888', fontSize: '13px', letterSpacing: '2px', marginBottom: '8px' }}>
                        {donem}. DONEM SONU
                    </p>
                    <h2 style={{
                        fontSize: '32px',
                        color: not.renk,
                        textShadow: `0 0 20px ${not.renk}66`,
                        marginBottom: '8px'
                    }}>
                        {not.harf}
                    </h2>
                    <p style={{ color: '#ccc', fontSize: '14px' }}>{not.mesaj}</p>
                </div>

                {/* Stat özeti */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <SonucSatir isim="Akademik" deger={statlar.akademik} renk="#4CAF50" />
                    <SonucSatir isim="Saglik"   deger={statlar.saglik}   renk="#2196F3" />
                    <SonucSatir isim="Sosyal"   deger={statlar.sosyal}   renk="#ff9800" />
                    <SonucSatir isim="Enerji"   deger={statlar.enerji}   renk="#9C27B0" />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255,255,255,0.06)'
                    }}>
                        <span style={{ color: '#aaa', fontSize: '13px' }}>Para</span>
                        <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{statlar.para} TL</span>
                    </div>
                </div>

                {/* Özel sonuçlar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    {bursFirsati && (
                        <Bildirim renk="#ffd700" yazi="Maddi durumun kotuydu — burs basvurusu yapabilirsin. +300 TL" />
                    )}
                    {arkadasKazandi && (
                                            <Bildirim renk="#4CAF50" yazi="Sosyal hayatin iyiydi — yeni bir arkadas kazandin!" />
                    )}
                    {arkadasKaybetti && (
                        <Bildirim renk="#f44336" yazi="Cok icine kapandın — bir arkadasını kaybettin." />
                    )}
                    {!gecti && (
                        <Bildirim renk="#f44336" yazi="Bu dersi tekrar alman gerekecek. Akademige odaklan!" />
                    )}
                </div>

                {/* Devam butonu */}
                <button
                    onClick={() => devamEt({ bursFirsati, arkadasKazandi, arkadasKaybetti, gecti })}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: not.renk,
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {donem + 1}. Doneme Gec
                </button>
            </div>
        </div>
    );
}

function SonucSatir({ isim, deger, renk }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#aaa', fontSize: '13px' }}>{isim}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '80px', height: '6px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '3px', overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${deger}%`, height: '100%',
                        background: renk, borderRadius: '3px'
                    }} />
                </div>
                <span style={{ color: renk, fontSize: '13px', fontWeight: 'bold', width: '28px' }}>
                    {deger}
                </span>
            </div>
        </div>
    );
}

function Bildirim({ renk, yazi }) {
    return (
        <div style={{
            padding: '10px 14px',
            background: `${renk}11`,
            border: `1px solid ${renk}44`,
            borderRadius: '8px',
            fontSize: '13px',
            color: renk,
            lineHeight: '1.5'
        }}>
            {yazi}
        </div>
    );
}

export default DonemSonuModal;