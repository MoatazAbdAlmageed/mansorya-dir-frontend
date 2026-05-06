# 🏛️ دليل المنصورية | Mansorya Directory

## Next.js Headless WordPress Frontend

![Mansorya Directory Banner](./mansorya_directory_banner_1778057728758.png)

**دليل المنصورية** هو تطبيق ويب عصري تم بناؤه باستخدام **Next.js 15+** ليعمل كواجهة أمامية (Frontend) لموقع ووردبريس. يوفر التطبيق تجربة مستخدم سلسة وسريعة للبحث عن الشركات، المهن، وأرباب الحرف في منطقة المنصورية.

---

## ✨ المميزات الرئيسية | Features

- **🚀 أداء فائق**: مبني على Next.js App Router مع دعم الـ Server Components لسرعة تحميل مذهلة.
- **📱 متوافق مع كافة الأجهزة**: تصميم ريسفونسيف (Responsive) بالكامل يدعم الهواتف والأجهزة اللوحية.
- **🎨 تصميم بريميوم**: واجهة مستخدم تعتمد على الـ **Glassmorphism** مع حركات ناعمة باستخدام **Framer Motion**.
- **🔍 بحث وتصفية ذكي**: نظام تصفية متقدم حسب التصنيفات والتصنيفات الفرعية.
- **🔌 تكامل سلس**: يعتمد بالكامل على **WordPress REST API** مع دعم الـ Custom Post Types و ACF.
- **🌍 دعم RTL**: مهيأ بالكامل للغة العربية واتجاه الكتابة من اليمين لليسار.

---

## 🛠 التكنولوجيا المستخدمة | Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (Custom Design System)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: Headless WordPress + ACF

---

## 🚀 البداية السريعة | Quick Start

### 1. إعداد الووردبريس (WordPress Setup)

تأكد من إعداد موقع الووردبريس الخاص بك ليدعم الـ REST API:

- تفعيل إضافة **ACF (Advanced Custom Fields)**.
- تفعيل خيار **"Show in REST API"** لجميع مجموعات الحقول.
- تأكد من ضبط الـ Permalinks على **"Post name"**.

### 2. إعداد البيئة (Environment Setup)

قم بإنشاء ملف `.env.local` في المجلد الرئيسي وأضف الرابط الخاص بموقع الووردبريس:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://your-wordpress-site.local/wp-json/wp/v2
```

### 3. التثبيت والتشغيل (Installation)

```bash
# تثبيت التبعيات
npm install

# تشغيل وضع التطوير
npm run dev
```

---

## 📁 هيكل المشروع | Project Structure

```text
src/
├── app/              # المسارات والصفحات (App Router)
│   ├── directory/    # صفحات الدليل التجاري
│   ├── phonebook/    # صفحات دليل الهاتف
│   ├── globals.css   # نظام التصميم الأساسي
│   └── layout.js     # الهيكل العام للتطبيق
├── components/       # مكونات واجهة المستخدم (قريباً)
└── lib/              # دوال الاتصال بالـ API وتهيئة البيانات
    └── wp.js         # مدير الاتصال بـ WordPress REST API
```

---

## 📸 لقطات من التطبيق | Screenshots

سيتم إضافة صور حقيقية للتطبيق هنا قريباً.

---

## 📄 الترخيص | License

هذا المشروع خاص بـ **دليل المنصورية**. جميع الحقوق محفوظة.

---

> تم التطوير بكل ❤️ لخدمة أهالي المنصورية
