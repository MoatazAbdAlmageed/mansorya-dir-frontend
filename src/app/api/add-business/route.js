import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!WP_USER || !WP_APP_PASSWORD) {
      return NextResponse.json({ error: 'الرجاء إعداد بيانات الاعتماد في ملف .env.local' }, { status: 500 });
    }

    const auth = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');

    const response = await fetch(`${API_URL}/directory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        title: data.title,
        content: data.description,
        status: 'pending',
        directory_category: data.category ? [parseInt(data.category)] : [],
        acf: {
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          website: data.website,
          address: data.address,
          google_map: data.google_map,
          notes: data.notes,
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          youtube: data.youtube,
          linkedin: data.linkedin,
          telegram: data.telegram,
          image_url: data.image_url,
        }
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[WordPress API Error]', result);
      // specific error for "not allowed"
      if (result.code === 'rest_cannot_create') {
        return NextResponse.json({ 
          error: 'فشل المصادقة: تأكد من صحة اسم المستخدم وكلمة مرور التطبيق (Application Password) وأن المستخدم لديه صلاحية "كاتب" على الأقل.' 
        }, { status: 403 });
      }
      return NextResponse.json({ error: result.message || 'فشل إرسال البيانات' }, { status: response.status });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة طلبك' }, { status: 500 });
  }
}
