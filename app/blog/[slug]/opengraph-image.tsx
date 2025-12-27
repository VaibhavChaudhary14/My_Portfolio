import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/mdx'

export const runtime = 'edge'

export const alt = 'Blog Post'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
    // We can't use fs in edge, so for now we'll just display the slug or generic text
    // Ideally we'd fetch title, but since we are using static files and edge runtime has limits, 
    // we might need to compromise or fetch from an external source if it were a CMS.
    // HOWEVER, for simple MDX with fs, it DOES NOT work in Edge Runtime.
    // So we will just look good with the slug or a generic "New Post" title if we can't reliably get the title without fs.
    // ACTUALLY: We can just pass the title via props or similar? No.
    // Let's rely on the design being generic enough or try to parse the slug to title case for now.

    const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#fbfbfb', // Paper White
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    padding: '80px',
                    border: '20px solid #18181b',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#09090b',
                    color: 'white',
                    padding: '10px 30px',
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 40,
                    transform: 'rotate(-2deg)',
                }}>
                    VAIBHAV'S STASH
                </div>

                <div style={{
                    fontSize: 70,
                    fontWeight: 'bold',
                    color: '#18181b',
                    lineHeight: 1.1,
                    marginBottom: 20,
                    maxWidth: '90%',
                    // Simplified text shadow for "neobrutalist" feel
                    textShadow: '4px 4px 0px #a855f7',
                }}>
                    {title}
                </div>

                <div style={{
                    marginTop: 40,
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: '#a855f7',
                        marginRight: 20,
                        border: '3px solid #18181b',
                    }} />
                    <div style={{ fontSize: 30, color: '#525252' }}>
                        Vaibhav Chaudhary
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
