function OlayModal({ olay, olaySecimi }) {
    if (!olay) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '380px',
                width: '90%',
                boxShadow: '0 0 60px rgba(255,215,0,0.1)'
            }}>
                {/* Başlık */}
                <h2 style={{
                    color: '#ffd700',
                    fontSize: '22px',
                    marginBottom: '12px',
                    textAlign: 'center'
                }}>
                    {olay.baslik}
                </h2>

                {/* Mesaj */}
                <p style={{
                    color: '#ccc',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    textAlign: 'center'
                }}>
                    {olay.mesaj}
                </p>

                {/* Seçenekler */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {olay.secenekler.map((secenek, i) => (
                        <button
                            key={secenek.yazi}
                            onClick={() => olaySecimi(secenek)}
                            style={{
                                padding: '14px 20px',
                                background: i === 0
                                    ? 'rgba(255,215,0,0.15)'
                                    : 'rgba(255,255,255,0.05)',
                                border: i === 0
                                    ? '1px solid rgba(255,215,0,0.4)'
                                    : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textAlign: 'left'
                            }}
                        >
                            {secenek.yazi}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OlayModal;