<div dir="rtl">

# تطبيق أندرويد

## تنزيل النسخة التجريبية

يمكن تنزيل أحدث نسخة اختبار من [صفحة الإصدارات](https://github.com/mohammedjaferalshouha/jordanian-labour-rights-calculator/releases).

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
npm run android:build:debug
```

تظهر نسخة الاختبار داخل مجلد:

```text
dist
```

## التحقق

يشمل مسار البناء مزامنة ملفات الموقع المحلية، وتوليد أيقونات أندرويد وشاشة البداية، ثم إنشاء ملف تثبيت موقع بتوقيع الاختبار.

> النسخة التجريبية ليست توقيع الإصدار النهائي المخصص للتوزيع الدائم. يُنشأ توقيع الإصدار ويحفظ بأمان بعد اكتمال اختبار الهاتف واعتماد النسخة.

</div>

---

# Android application

## Testing release

Download the latest testing package from the [releases page](https://github.com/mohammedjaferalshouha/jordanian-labour-rights-calculator/releases).

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
npm run android:build:debug
```

The testing package is created in:

```text
dist
```

## Verification

The build synchronizes local web assets, generates Android launcher and splash assets, and creates a package signed with the testing key.

> The testing package does not use the final long-term distribution signature. A securely stored release signature will be created after real-device testing and approval.
