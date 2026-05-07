'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/wp';

export default function AddBusiness() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    short_desc: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    address: '',
    google_map: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    telegram: '',
    notes: ''
  });

  useEffect(() => {
    async function loadCats() {
      const data = await getCategories();
      setCategories(data.filter(cat => cat.count > 0));
    }
    loadCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/add-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'حدث خطأ أثناء الإرسال');
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <div className="glass responsive-padding" style={{ maxWidth: '600px', margin: '0 auto', background: '#fff' }}>
          <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1.5rem' }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h1 style={{ marginBottom: '1rem' }}>تم إرسال طلبك بنجاح!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
            شكراً لإضافة عملك في دليل المنصورية. سيقوم فريقنا بمراجعة البيانات وتفعيل الإدراج في أقرب وقت ممكن. يمكنك متابعة الطلب في لوحة التحكم قريباً.
          </p>
          <Link href="/" className="btn btn-primary">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.9rem' }}>انضم إلينا</span>
          <h1 style={{ fontSize: '3rem', marginTop: '1.5rem', marginBottom: '1rem' }}>أضف عملك الجديد</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>كن جزءاً من أكبر تجمع مهني وتجاري في منطقة المنصورية</p>
        </header>

        {error && (
          <div className="glass" style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', color: '#991b1b', textAlign: 'center' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginLeft: '10px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass responsive-padding" style={{ background: '#fff', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Basic Info */}
          <section>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              <i className="fa-solid fa-circle-info" style={{ marginLeft: '10px' }}></i>
              المعلومات الأساسية
            </h3>
            <div className="form-group">
              <label>اسم العمل / النشاط التجاري <span style={{ color: 'red' }}>*</span></label>
              <input 
                type="text" 
                name="title"
                required 
                value={formData.title}
                onChange={handleChange}
                placeholder="مثال: مطعم المنصورية الحديث" 
                className="form-input" 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }} className="responsive-grid">
              <div className="form-group">
                <label>التصنيف / القسم <span style={{ color: 'red' }}>*</span></label>
                <select 
                  required 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input" 
                  style={{ appearance: 'none' }}
                >
                  <option value="">اختر القسم...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>وصف قصير</label>
                <input 
                  type="text" 
                  name="short_desc"
                  value={formData.short_desc}
                  onChange={handleChange}
                  placeholder="مثال: أفضل المأكولات الشرقية في المنصورية" 
                  className="form-input" 
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>وصف النشاط بالتفصيل</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="تحدث عن خدماتك، مميزاتك، وما تقدمه للعملاء..." 
                className="form-input" 
                style={{ minHeight: '150px' }}
              ></textarea>
            </div>
          </section>

          {/* Contact & Location */}
          <section>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              <i className="fa-solid fa-location-dot" style={{ marginLeft: '10px' }}></i>
              معلومات الاتصال والموقع
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="responsive-grid">
              <div className="form-group">
                <label>رقم الهاتف <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="tel" 
                  name="phone"
                  required 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx" 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label>رقم واتساب</label>
                <input 
                  type="tel" 
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx" 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com" 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label>الموقع الإلكتروني</label>
                <input 
                  type="url" 
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.yoursite.com" 
                  className="form-input" 
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>العنوان بالتفصيل</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="المنصورية - شارع..." 
                className="form-input" 
              />
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>رابط خرائط جوجل (Google Maps URL)</label>
              <input 
                type="url" 
                name="google_map"
                value={formData.google_map}
                onChange={handleChange}
                placeholder="https://maps.google.com/..." 
                className="form-input" 
              />
            </div>
          </section>

          {/* Media Info Note */}
          <section>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              <i className="fa-solid fa-image" style={{ marginLeft: '10px' }}></i>
              الصور والوسائط
            </h3>
            <div className="glass" style={{ padding: '1.5rem', background: '#f8fafc', border: '1px dashed var(--primary)' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
                <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary)', marginLeft: '8px' }}></i>
                حالياً، سيقوم فريقنا بالتواصل معك للحصول على الصور والشعار الخاص بك بعد إرسال الطلب، لضمان جودة العرض في الدليل.
              </p>
            </div>
          </section>

          {/* Social Links */}
          <section>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              <i className="fa-solid fa-share-nodes" style={{ marginLeft: '10px' }}></i>
              روابط التواصل الاجتماعي
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="responsive-grid">
              <div className="form-group">
                <label><i className="fa-brands fa-facebook" style={{ color: '#1877F2' }}></i> فيسبوك</label>
                <input 
                  type="url" 
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..." 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-brands fa-instagram" style={{ color: '#E4405F' }}></i> انستجرام</label>
                <input 
                  type="url" 
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..." 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-brands fa-x-twitter"></i> تويتر (X)</label>
                <input 
                  type="url" 
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/..." 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-brands fa-youtube" style={{ color: '#FF0000' }}></i> يوتيوب</label>
                <input 
                  type="url" 
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..." 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-brands fa-linkedin" style={{ color: '#0A66C2' }}></i> لينكد إن</label>
                <input 
                  type="url" 
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/..." 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-brands fa-telegram" style={{ color: '#26A5E4' }}></i> تيليجرام</label>
                <input 
                  type="url" 
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="https://t.me/..." 
                  className="form-input" 
                />
              </div>
            </div>
          </section>

          <section>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              <i className="fa-solid fa-note-sticky" style={{ marginLeft: '10px' }}></i>
              ملاحظات إضافية
            </h3>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="أي ملاحظات أخرى تود إخبارنا بها..." 
              className="form-input" 
              style={{ minHeight: '100px' }}
            ></textarea>
          </section>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.2rem', justifyContent: 'center', marginTop: '1rem', boxShadow: '0 10px 20px rgba(0, 150, 136, 0.2)' }}>
            {loading ? 'جاري الإرسال...' : 'إرسال الطلب للمراجعة'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .form-group label {
          display: block;
          margin-bottom: 0.6rem;
          font-weight: 600;
          color: #334155;
          font-size: 0.95rem;
        }
        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s;
          font-family: inherit;
        }
        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-light);
        }
        @media (max-width: 640px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
