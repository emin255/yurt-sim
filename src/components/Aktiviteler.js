const AKTIVITELER = [
    {
        id: 'ders',
        isim: 'Ders Calis',
        ikon: 'D',
        sure: 2,
        etkiler: { akademik: 15, enerji: -20, sosyal: -5 },
        mesaj: 'Kitaplara gomuldun, akademik becerin artti.',
        renk: '#4CAF50'
    },
    {
        id: 'spor',
        isim: 'Spor Yap',
        ikon: 'S',
        sure: 1,
        etkiler: { saglik: 20, enerji: -25, sosyal: 5 },
        mesaj: 'Salonda ter doktunn, kendini iyi hissediyorsun.',
        renk: '#2196F3'
    },
    {
        id: 'sosyal',
        isim: 'Arkadaslarla Takilma',
        ikon: 'A',
        sure: 2,
        etkiler: { sosyal: 25, enerji: -10, akademik: -5 },
        mesaj: 'Guzel vakit gecirdin, moralin yukseldi.',
        renk: '#ff9800'
    },
    {
        id: 'is',
        isim: 'Part-time Is',
        ikon: 'P',
        sure: 3,
        etkiler: { para: 150, enerji: -30, sosyal: -10 },
        mesaj: 'Calistin, biraz para kazandin.',
        renk: '#9C27B0'
    },
    {
        id: 'uyu',
        isim: 'Uyu',
        ikon: 'U',
        sure: 8,
        etkiler: { enerji: 80, saglik: 10, sosyal: -5 },
        mesaj: 'Iyi bir uyku cektin, enerjin doldu.',
        renk: '#607D8B'
    }
];

function Aktiviteler({ aktiviteYap }) {
    return (
        <div>
            <h3 style={{
                color: '#aaa',
                fontSize: '12px',
                letterSpacing: '2px',
                marginBottom: '14px',
                textTransform: 'uppercase'
            }}>
                Aktiviteler
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {AKTIVITELER.map(aktivite => (
                    <button
                        key={aktivite.id}
                        onClick={() => aktiviteYap(aktivite)}
                        style={{
                            padding: '12px 16px',
                            background: `${aktivite.renk}22`,
                            border: `1px solid ${aktivite.renk}55`,
                            color: 'white',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '14px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                background: aktivite.renk,
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {aktivite.ikon}
                            </div>
                            <span>{aktivite.isim}</span>
                        </div>
                        <span style={{
                            fontSize: '12px',
                            color: '#888',
                            background: 'rgba(255,255,255,0.06)',
                            padding: '3px 8px',
                            borderRadius: '4px'
                        }}>
                            {aktivite.sure}s
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Aktiviteler;