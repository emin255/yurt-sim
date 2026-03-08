function Saat({ saat, gun }) {
    const saatYazi = `${String(saat).padStart(2, '0')}:00`;

    let vakit, gradyan, ikon;
    if (saat >= 6  && saat < 12) { vakit = 'Sabah';         gradyan = 'linear-gradient(135deg, #f97316, #fbbf24)'; ikon = '🌅'; }
    else if (saat < 17)           { vakit = 'Ogleden Sonra'; gradyan = 'linear-gradient(135deg, #3b82f6, #60a5fa)'; ikon = '☀️'; }
    else if (saat < 21)           { vakit = 'Aksam';         gradyan = 'linear-gradient(135deg, #7c3aed, #a78bfa)'; ikon = '🌆'; }
    else                          { vakit = 'Gece';          gradyan = 'linear-gradient(135deg, #0f0f2e, #1e1b4b)'; ikon = '🌙'; }

    return (
        <div style={{
            background: gradyan,
            padding: '16px 20px',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'background 2s ease',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
        }}>
            <div>
                <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '22px',
                    color: 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    letterSpacing: '2px'
                }}>
                    {saatYazi}
                </div>
                <div style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.75)',
                    marginTop: '4px',
                    letterSpacing: '1px'
                }}>
                    {vakit.toUpperCase()}
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px' }}>{ikon}</div>
                <div style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.75)',
                    marginTop: '2px'
                }}>
                    {gun}. GUN
                </div>
            </div>
        </div>
    );
}

export default Saat;