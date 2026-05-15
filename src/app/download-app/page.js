import Link from "next/link";

export const metadata = {
  title: "تحميل تطبيق دليل المنصورية",
  description: "خطوات تحميل وتثبيت تطبيق دليل المنصورية على أجهزة الأندرويد",
};

export default function DownloadPage() {
  const apkFileName = "7b426ed3-b5c7-484e-8d63-6b12507f555b.apk";

  return (
    <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          تحميل <span className="text-gradient">التطبيق</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
          استمتع بتجربة أسرع وأفضل من خلال تطبيق دليل المنصورية الرسمي للأندرويد
        </p>
      </header>

      <div className="glass animate-fade-in" style={{ padding: '3rem', background: '#fff', borderRadius: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            background: 'linear-gradient(135deg, #009688 0%, #004d40 100%)', 
            borderRadius: '2rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 20px rgba(0, 150, 136, 0.3)'
          }}>
            <i className="fa-brands fa-android" style={{ fontSize: '3.5rem', color: '#fff' }}></i>
          </div>
          <a 
            href={`/${apkFileName}`} 
            download 
            className="btn btn-primary" 
            style={{ 
              fontSize: '1.4rem', 
              padding: '1.2rem 2.5rem', 
              borderRadius: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <i className="fa-solid fa-cloud-arrow-down"></i>
            تحميل ملف APK
          </a>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            الإصدار الحالي: 1.0.0 | الحجم: تقريباً 15 ميجابايت
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '3rem 0' }} />

        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-list-check" style={{ color: 'var(--primary)' }}></i>
          تعليمات التثبيت
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[
            {
              icon: "fa-download",
              title: "تحميل الملف",
              desc: "قم بتحميل ملف APK بالضغط على زر التحميل أعلاه على جهاز الأندرويد الخاص بك."
            },
            {
              icon: "fa-shield-halved",
              title: "تفعيل المصادر غير المعروفة",
              desc: "قم بتفعيل خيار 'المصادر غير المعروفة' (Unknown sources) من إعدادات الحماية في جهازك."
            },
            {
              icon: "fa-file-export",
              title: "تثبيت التطبيق",
              desc: "افتح ملف APK الذي قمت بتحميله واتبع خطوات التثبيت على الشاشة."
            },
            {
              icon: "fa-rocket",
              title: "ابدأ الاستخدام",
              desc: "افتح التطبيق من شاشة الهاتف الرئيسية واستمتع بكافة خدمات دليل المنصورية."
            }
          ].map((step, index) => (
            <div key={index} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ 
                minWidth: '45px', 
                height: '45px', 
                background: '#f1f5f9', 
                borderRadius: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--primary)',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                {index + 1}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className={`fa-solid ${step.icon}`} style={{ fontSize: '1rem', opacity: 0.7 }}></i>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem', background: '#fff9e6', borderRadius: '1.5rem', border: '1px solid #ffeeba' }}>
          <p style={{ display: 'flex', gap: '10px', color: '#856404', margin: 0 }}>
            <i className="fa-solid fa-circle-info" style={{ marginTop: '3px' }}></i>
            <span>تنبيه: هذا التطبيق خاص بهواتف الأندرويد فقط. لمستخدمي الآيفون، يمكنكم استخدام نسخة الويب مباشرة.</span>
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
          ← العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
