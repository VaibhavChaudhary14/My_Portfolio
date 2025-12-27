import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Vaibhav Chaudhary - Portfolio'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#fbfbfb',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    border: '20px solid #18181b', // neobrutalist border
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        backgroundColor: '#ffffff',
                        border: '4px solid #18181b',
                        boxShadow: '10px 10px 0px 0px #18181b',
                    }}
                >
                    <div style={{ fontSize: 80, fontWeight: 'bold', color: '#18181b', marginBottom: 20 }}>
                        Vaibhav Chaudhary
                    </div>
                    <div style={{ fontSize: 40, color: '#a855f7', fontWeight: 'bold' }}>
                        Full Stack Developer
                    </div>
                    <div style={{ fontSize: 24, color: '#525252', marginTop: 20 }}>
                        Building the future, one commit at a time.
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
