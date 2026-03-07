function StatBar({ isim, deger, renk }) {
    // Değere göre renk tonu — düşükse kırmızıya kayar
    const gostergeRenk = deger < 25 ? '#f44336' : deger < 50 ? '#ff9800' : renk;

    return (
        <div style={{ marginBottom: '14px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px'
            }}>
                <span style={{ fontSize: '13px', color: '#ccc' }}>{isim}</span>
                <span style={{
                    fontSize: '13px',
                    color: gostergeRenk,
                    fontWeight: 'bold'
                }}>
                    {deger}
                </span>
            </div>
            <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${deger}%`,
                    height: '100%',
                    background: gostergeRenk,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease, background 0.5s ease',
                    boxShadow: `0 0 8px ${gostergeRenk}66`
                }} />
            </div>
        </div>
    );
}

export default StatBar;