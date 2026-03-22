import React, { useState } from 'react';

function UykuSecimModal({ onKapat, onUyu }) {
    const [uykuSaati, setUykuSaati] = useState(8);

    const handleUyu = () => {
        onUyu(uykuSaati);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                background: '#1a1a24',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                width: '320px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <h2 style={{ margin: 0, fontSize: '18px', textAlign: 'center', color: '#ffd700' }}>Uyku Süresi</h2>
                
                <p style={{ margin: 0, fontSize: '14px', color: '#aaa', textAlign: 'center' }}>
                    Kaç saat uyumak istersin?
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: '12px 0' }}>
                    <button 
                        onClick={() => setUykuSaati(Math.max(1, uykuSaati - 1))}
                        style={{ background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                    >-</button>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{uykuSaati}</span>
                    <button 
                        onClick={() => setUykuSaati(Math.min(24, uykuSaati + 1))}
                        style={{ background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                    >+</button>
                </div>

                <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
                    Kazanılacak Enerji: <span style={{ color: '#50c878' }}>+{Math.min(100, uykuSaati * 10)}</span><br/>
                    Kazanılacak Sağlık: <span style={{ color: '#4da6ff' }}>+{Math.floor(uykuSaati * 1.25)}</span><br/>
                    Kaybedilecek Sosyal: <span style={{ color: '#ff8c42' }}>-5</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button 
                        onClick={onKapat} 
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: 'transparent',
                            color: '#aaa',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >İptal</button>
                    <button 
                        onClick={handleUyu} 
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#50c878',
                            color: 'black',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >Uyu</button>
                </div>
            </div>
        </div>
    );
}

export default UykuSecimModal;
