const AKTIVITELER = [
    { id:'ders',   isim:'Ders Calis',          ikon:'📚', sure:2, etkiler:{ akademik:15, enerji:-20, sosyal:-5  }, mesaj:'Kitaplara gomuldun.', renk:'#50c878' },
    { id:'spor',   isim:'Spor Yap',             ikon:'💪', sure:1, etkiler:{ saglik:20,   enerji:-25, sosyal:5   }, mesaj:'Ter doktunn!',        renk:'#4da6ff' },
    { id:'sosyal', isim:'Arkadaslarla Takilma', ikon:'👥', sure:2, etkiler:{ sosyal:25,   enerji:-10, akademik:-5}, mesaj:'Guzel vakit.',         renk:'#ff8c42' },
    { id:'is',     isim:'Part-time Is',         ikon:'💼', sure:3, etkiler:{ para:150,    enerji:-30, sosyal:-10 }, mesaj:'Para kazandin.',       renk:'#b57bee' },
    { id:'uyu',    isim:'Uyu',                  ikon:'😴', sure:8, etkiler:{ enerji:80,   saglik:10,  sosyal:-5  }, mesaj:'Dinlendın.',           renk:'#60a5fa' },
];

function Aktiviteler({ aktiviteYap }) {
    return (
        <div>
            <p style={{
                fontSize: '10px',
                color: '#555',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                fontWeight: '600'
            }}>
                Aktiviteler
            </p>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
            }}>
                {AKTIVITELER.map(a => (
                    <button
                        key={a.id}
                        onClick={() => aktiviteYap(a)}
                        style={{
                            padding: '12px',
                            background: `${a.renk}10`,
                            border: `1px solid ${a.renk}30`,
                            borderRadius: '12px',
                            color: 'white',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>{a.ikon}</span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: a.renk }}>
                            {a.isim}
                        </span>
                        <span style={{
                            fontSize: '10px',
                            color: '#555',
                            background: 'rgba(255,255,255,0.04)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            alignSelf: 'flex-start'
                        }}>
                            {a.sure}s
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Aktiviteler;