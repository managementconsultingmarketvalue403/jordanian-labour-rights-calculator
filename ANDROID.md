<div dir="rtl">

# تطبيق أندرويد

## تنزيل الإصدار الرسمي

يمكن تنزيل أحدث إصدار رسمي من [صفحة الإصدارات](https://github.com/mohammedjaferalshouha/jordanian-labour-rights-calculator/releases).

## التثبيت

1. نزّل ملف التثبيت إلى الهاتف.
2. افتحه من مدير الملفات.
3. اسمح بالتثبيت من المصدر المستخدم إذا طلب أندرويد ذلك.
4. ثبّت التطبيق ثم اختبر الواجهتين العربية والإنجليزية والحسابات وزر قانون العمل.

## معلومات الحزمة

- اسم التطبيق: حاسبة الحقوق العمالية.
- الحد الأدنى المدعوم: أندرويد 7.
- تُجرى الحسابات محليًا داخل التطبيق.
- لا يطلب التطبيق حسابًا ولا يجمع البيانات المدخلة.
- إذن الإنترنت موجود لفتح رابط المصدر الرسمي لقانون العمل.

## البناء محليًا

يتطلب البناء بيئة أندرويد ولغة جافا المناسبة، ثم يُنفذ:

```powershell
npm install
npm test
npm run android:signing:create
npm run android:build:release
```

تظهر نسخة البناء داخل مجلد:

```text
dist
```

## التحقق

يشمل مسار البناء مزامنة ملفات الموقع المحلية، وتوليد أيقونات أندرويد وشاشة البداية، ثم إنشاء ملف تثبيت موقع بمفتاح الإصدار الدائم.

> يجب الاحتفاظ بنسخة احتياطية آمنة من مفتاح التوقيع وملف خصائصه. يجب توقيع جميع التحديثات المستقبلية بالمفتاح نفسه حتى يقبل أندرويد تثبيتها كتحديث للتطبيق.

</div>

---

# Android application

## Official release

Download the latest official package from the [releases page](https://github.com/mohammedjaferalshouha/jordanian-labour-rights-calculator/releases).

## Installation

1. Download the installation package to the phone.
2. Open it from the file manager.
3. Allow installation from the selected source if Android requests it.
4. Install the application and test both languages, calculations and the Labour Law button.

## Package information

- Application name: Labour Rights Calculator.
- Minimum supported version: Android 7.
- Calculations run locally inside the application.
- The application requires no account and collects no entered data.
- Internet permission is used to open the official Labour Law source.

## Local build

With a compatible Android and Java environment installed, run:

```powershell
npm install
npm test
npm run android:signing:create
npm run android:build:release
```

The built package is created in:

```text
dist
```

## Verification

The build synchronizes local web assets, generates Android launcher and splash assets, and creates a package signed with the permanent release key.

> Keep a secure backup of the signing key and its properties file. Every future update must use the same key so Android accepts it as an update to the installed application.
