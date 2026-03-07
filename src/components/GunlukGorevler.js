function GunlukGorevler({ gorevler }) {
    const tamamlanan = gorevler.filter(g => g.tamamlandi).length;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '20px',
            borderRadius: '16px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px'
            }}>
                <h3 style={{
                    color: '#aaa',
                    fontSize: '12px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}>
                    Gunluk Gorevler
                </h3>
                <span style={{
                    fontSize: '12px',
                    color: tamamlanan === gorevler.length ? '#4CAF50' : '#888',
                    fontWeight: 'bold'
                }}>
                    {tamamlanan}/{gorevler.length}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {gorevler.map((gorev, i) => (
                    <div
                        key={i}
                        style={{
                            padding: '10px 14px',
                            background: gorev.tamamlandi
                                ? 'rgba(76,175,80,0.1)'
                                : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${gorev.tamamlandi ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Tamamlandı göstergesi */}
                            <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: `2px solid ${gorev.tamamlandi ? '#4CAF50' : '#555'}`,
                                background: gorev.tamamlandi ? '#4CAF50' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                flexShrink: 0
                            }}>
                                {gorev.tamamlandi ? '✓' : ''}
                            </div>

                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    color: gorev.tamamlandi ? '#4CAF50' : '#ddd',
                                    textDecoration: gorev.tamamlandi ? 'line-through' : 'none'
                                }}>
                                    {gorev.isim}
                                </div>
                                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                    {gorev.aciklama}
                                </div>
                            </div>
                        </div>

                        {/* Ödül */}
                        <div style={{
                            fontSize: '11px',
                            color: '#ffd700',
                            background: 'rgba(255,215,0,0.08)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap'
                        }}>
                            {Object.entries(gorev.odul).map(([stat, miktar]) =>
                                `+${miktar} ${stat}`
                            ).join(', ')}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hepsi tamamlandıysa */}
            {tamamlanan === gorevler.length && (
                <div style={{
                    marginTop: '12px',
                    textAlign: 'center',
                    color: '#4CAF50',
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>
                    Tum gorevleri tamamladın! Harika!
                </div>
            )}
        </div>
    );
}

export default GunlukGorevler;