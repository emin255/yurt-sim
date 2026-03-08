function StatBar({ isim, deger, renk }) {
    const dusuk = deger < 25;
    const orta  = deger < 50;
    const gostergeRenk = dusuk ? '#ff5555' : orta ? '#ff8c42' : renk;

    const ikonlar = {
        'Akademik': '📚',
        'Saglik':   '💪',
        'Sosyal':   '👥',
        'Enerji':   '⚡',
    };

    return (
        <div style={{ marginBottom: '12px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
            }}>
                <span style={{
                    fontSize: '11px',
                    color: '#999',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <span>{ikonlar[isim] || ''}</span>
                    {isim.toUpperCase()}
                </span>
                <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: gostergeRenk,
                    transition: 'color 0.5s ease'
                }}>
                    {deger}
                </span>
            </div>

            {/* Bar arka planı */}
            <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Dolu kısım */}
                <div style={{
                    width: `${deger}%`,
                    height: '100%',
                    background: dusuk
                        ? 'linear-gradient(90deg, #ff3333, #ff5555)'
                        : `linear-gradient(90deg, ${gostergeRenk}88, ${gostergeRenk})`,
                    borderRadius: '3px',
                    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1), background 0.5s ease',
                    boxShadow: `0 0 6px ${gostergeRenk}66`,
                    position: 'relative'
                }}>
                    {/* Parlama efekti */}
                    {!dusuk && (
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '40%', height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            borderRadius: '3px'
                        }} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default StatBar;