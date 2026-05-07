import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

export async function POST(request) {
  try {
    const data = await request.json();
    
    // We check if we have credentials to bypass the "login required" restriction
    const hasCredentials = WP_USER && WP_APP_PASSWORD;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (hasCredentials) {
      const auth = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        post: data.post,
        author_name: data.author_name,
        author_email: data.author_email,
        content: data.content,
        // If we're authenticated, we might need to explicitly set the status
        status: 'hold', // Always hold for moderation
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[WordPress Comment API Error]', result);
      return NextResponse.json({ 
        error: result.message || 'فشل إرسال التعليق',
        code: result.code 
      }, { status: response.status });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Comment submission error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة تعليقك' }, { status: 500 });
  }
}
