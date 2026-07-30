(function () {
    "use strict";

    const engine = window.LaborCalculator;
    const byId = (id) => document.getElementById(id);
    const numberValue = (id) => {
        const value = Number(byId(id)?.value);
        return Number.isFinite(value) ? Math.max(0, value) : 0;
    };

    const translations = {
        ar: {
            lawName: "قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته",
            lawButton: "قانون العمل الأردني",
            pageTitle: "حاسبة الحقوق العمالية",
            heroCopy: "أدخل البيانات الأساسية أولًا، وستظهر لك الحقول المرتبطة بحالتك فقط. جميع النتائج مبنية على البيانات التي تدخلها.",
            wageTitle: "الأجر وفرق الأجور",
            wageSubtitle: "حدد طريقة تقاضي الأجر والقيمة الأخيرة",
            wageTypeLabel: "طريقة تقاضي الأجر",
            chooseOption: "يرجى الاختيار",
            monthlyWage: "أجر شهري",
            dailyWage: "أجر يومي",
            wageDefinitionNote: "أدخل الأجر الأخير المعتمد لاحتساب الحقوق، وليس الراتب الأساسي وحده إذا كان الأجر المستحق يشمل مبالغ ثابتة أخرى.",
            wageDifferenceQuestion: "هل يوجد فرق أجور لصالح العامل؟",
            wageDifferenceHelp: "يمكن إضافة أكثر من فترة إذا تغير الأجر",
            wageDifferenceInfo: "إذا بقي الأجر ثابتًا استخدم فترة واحدة، وإذا تغير أضف فترة أخرى.",
            wageDifferenceNoRepeat: "أدخل كل فترة مرة واحدة فقط، ولا تكرر المدة نفسها في أكثر من بطاقة. ولا تدخل الفترة نفسها ضمن الأجور غير المدفوعة وفرق الأجور معًا.",
            addWagePeriod: "إضافة فترة أخرى لفرق الأجور",
            serviceTitle: "مدة الخدمة والضمان الاجتماعي",
            serviceSubtitle: "تستخدم المدة في الإجازات ونهاية الخدمة والفصل التعسفي",
            years: "السنوات",
            months: "الأشهر",
            days: "الأيام",
            socialSecurity: "حالة الاشتراك في الضمان الاجتماعي",
            chooseSocialSecurity: "يرجى تحديد حالة الاشتراك",
            subscribed: "مشترك في الضمان الاجتماعي",
            notSubscribed: "غير مشترك في الضمان الاجتماعي",
            contractTitle: "العقد وانتهاء العمل",
            contractSubtitle: "تظهر الحقوق المرتبطة بنوع العقد وطريقة انتهائه",
            contractType: "نوع عقد العمل",
            definiteContract: "عقد محدد المدة",
            indefiniteContract: "عقد غير محدد المدة",
            terminationBy: "من أنهى عقد العمل؟",
            endedByEmployer: "صاحب العمل",
            endedByWorker: "العامل",
            endedMutually: "اتفاق الطرفين",
            contractExpired: "انتهت مدة العقد",
            fixedContractInfo: "يحتسب أجر المدة المتبقية فقط إذا أنهى صاحب العمل العقد المحدد المدة قبل انتهائه.",
            contractDurationMonths: "مدة العقد الكلية بالأشهر",
            contractDurationDays: "الأيام الإضافية في مدة العقد",
            contractWorkedMonths: "المدة التي عملها العامل بالأشهر",
            contractWorkedDays: "الأيام الإضافية التي عملها العامل",
            noticeMode: "بدل الإشعار عند إنهاء صاحب العمل للعقد",
            noNoticeClaim: "حصل على إشعار كامل أو لا يريد احتسابه",
            fullNotice: "لم يحصل على إشعار — احتساب شهر كامل",
            partialNotice: "إشعار جزئي",
            noticeDaysReceived: "عدد أيام الإشعار التي حصل عليها العامل",
            arbitraryDismissalQuestion: "إظهار تقدير بدل الفصل التعسفي للاستدلال",
            arbitraryDismissalHelp: "يظهر للاستدلال فقط لأن ثبوت الفصل التعسفي من اختصاص المحكمة.",
            unpaidTitle: "الأجور غير المدفوعة",
            unpaidSubtitle: "أدخل المدة التي لم يدفع عنها الأجر",
            unpaidMonths: "عدد الأشهر غير المدفوعة",
            unpaidDays: "عدد الأيام غير المدفوعة",
            unpaidDifferenceWarning: "الأجر غير المدفوع يعني أن العامل لم يستلم أجر الفترة أصلًا. لا تدخل الفترة نفسها ضمن فرق الأجور.",
            vacationTitle: "الإجازات السنوية",
            vacationSubtitle: "14 يومًا في السنوات الخمس الأولى و21 يومًا من السنة السادسة",
            includeVacation: "احتساب بدل الإجازات",
            vacationAuto: "يُحسب الرصيد تلقائيًا عن آخر سنتين بحد أقصى وفق مدة الخدمة",
            vacationAccruedDays: "الإجازات المحتسبة تلقائيًا عن آخر سنتين",
            takenVacationDays: "الإجازات التي حصل عليها العامل خلال آخر سنتين",
            additionalVacationDays: "أيام إضافية مستحقة وفق اتفاق",
            vacationDueDays: "أيام الإجازة المستحقة بعد الخصم",
            overtimeTitle: "العمل الإضافي",
            overtimeSubtitle: "يحتسب على أساس ثماني ساعات يوميًا",
            includeOvertime: "احتساب ساعات العمل الإضافي",
            overtimeRate: "بنسبة 125 بالمئة من أجر الساعة المعتاد",
            overtimeEntryMode: "طريقة إدخال الساعات",
            calculateFromDays: "حسب الأيام",
            monthlyHoursDirect: "ساعات شهرية مباشرة",
            overtimeHoursPerDay: "الساعات الإضافية في اليوم",
            overtimeDaysPerMonth: "عدد أيام تكرارها في الشهر",
            overtimeHoursPerMonth: "إجمالي الساعات الإضافية في الشهر",
            overtimeMonths: "عدد الأشهر التي تكرر خلالها العمل الإضافي",
            overtimeMonthDefault: "شهر واحد افتراضيًا حتى لا تضيع الساعات المدخلة",
            totalOvertimeHours: "إجمالي الساعات المحتسبة",
            holidaysTitle: "العطل الرسمية والعطلة الأسبوعية",
            holidaysSubtitle: "أيام العطل التي عمل فيها العامل",
            includeHolidays: "احتساب العمل في أيام العطل",
            holidayRate: "بنسبة 150 بالمئة من الأجر المعتاد",
            officialHolidayDays: "أيام العطل الرسمية والأعياد",
            weeklyRestDays: "أيام العطلة الأسبوعية التي عمل فيها العامل",
            weeklyRestHelp: "الجمعة عادةً، أو أي يوم آخر معتمد كعطلة أسبوعية",
            holidayEntryMode: "طريقة إدخال العمل في العطل",
            holidayByDays: "حسب الأيام",
            holidayByHours: "حسب الساعات",
            officialHolidayHours: "ساعات العمل في العطل الرسمية والأعياد",
            weeklyRestHours: "ساعات العمل في أيام الراحة الأسبوعية",
            annualSalariesTitle: "الرواتب السنوية بعد الراتب الثاني عشر",
            annualSalariesSubtitle: "مثل الراتب الثالث عشر والرابع عشر",
            annualSalariesQuestion: "هل يستحق العامل أكثر من اثني عشر راتبًا خلال السنة؟",
            annualSalariesClarification: "المقصود الرواتب السنوية التي تمنحها الشركة، وليس بدل الساعات الإضافية أو العطل",
            annualSalaryCount: "عدد الرواتب السنوية المستحقة للعامل",
            addAnnualSalary: "إضافة راتب سنوي آخر",
            savingsTitle: "مستحقات الصناديق",
            savingsSubtitle: "صندوق الادخار أو التوفير أو التقاعد أو صندوق مماثل",
            includeSavings: "هل توجد مستحقات في صندوق للعامل؟",
            savingsHelp: "أدخل صافي المبلغ المستحق وفق بيانات الصندوق",
            savingsBalance: "صافي مستحقات الصندوق بالدينار",
            calculate: "احسب المستحقات",
            reset: "تفريغ الحقول",
            resultsTitle: "نتائج حساب المستحقات",
            resultsSubtitle: "تفصيل المبالغ والمعادلات المستخدمة",
            total: "الإجمالي",
            legalDisclaimer: "تنبيه: هذه الحاسبة أداة إرشادية غير ملزمة، وتعتمد نتائجها على صحة البيانات والخيارات التي أدخلها المستخدم.",
            print: "طباعة النتائج",
            howItWorks: "طريقة الاستخدام",
            howItWorksText: "ابدأ بالبطاقات الثلاث الأولى، ثم افتح فقط الحقوق التي تريد احتسابها.",
            legalReferences: "المواد المرتبطة بالحساب",
            legalReferencesText: "يعرض قسم النتائج المادة المرتبطة بكل حق تم احتسابه.",
            createdBy: "أنشئت بواسطة المحامي محمد الشوحه",
            footerLaw: "وفق قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته"
        },
        en: {
            lawName: "Jordanian Labour Law No. 8 of 1996 and amendments",
            lawButton: "Jordanian Labour Law",
            pageTitle: "Labour Rights Calculator",
            heroCopy: "Enter the essential information first. Only fields relevant to your case will appear, and every result uses the data you provide.",
            wageTitle: "Wage and wage differences", wageSubtitle: "Select the wage method and last wage",
            wageTypeLabel: "Wage method", chooseOption: "Please select", monthlyWage: "Monthly wage", dailyWage: "Daily wage",
            wageDefinitionNote: "Enter the last wage used to calculate rights, not only the basic salary when the due wage includes other fixed amounts.",
            wageDifferenceQuestion: "Is there an unpaid wage difference?", wageDifferenceHelp: "Add periods if the wage changed",
            wageDifferenceInfo: "Use one period if the wage was constant, or add periods when it changed.",
            wageDifferenceNoRepeat: "Enter each period once. Do not repeat the same period in multiple cards or under both unpaid wages and wage differences.",
            addWagePeriod: "Add wage period",
            serviceTitle: "Service and social security", serviceSubtitle: "Used for leave, end-of-service and arbitrary dismissal",
            years: "Years", months: "Months", days: "Days", socialSecurity: "Social security status",
            chooseSocialSecurity: "Please select the subscription status", subscribed: "Subscribed", notSubscribed: "Not subscribed",
            contractTitle: "Contract and termination", contractSubtitle: "Relevant rights appear according to the contract and termination",
            contractType: "Contract type", definiteContract: "Fixed-term contract", indefiniteContract: "Indefinite contract",
            terminationBy: "Who ended the contract?", endedByEmployer: "Employer", endedByWorker: "Worker",
            endedMutually: "Both parties", contractExpired: "Contract term expired",
            fixedContractInfo: "The remaining term is calculated only when the employer ends a fixed-term contract early.",
            contractDurationMonths: "Total contract months", contractDurationDays: "Additional contract days",
            contractWorkedMonths: "Months worked", contractWorkedDays: "Additional days worked",
            noticeMode: "Notice compensation when the employer ends the contract",
            noNoticeClaim: "Full notice received or do not calculate",
            fullNotice: "No notice received — calculate one full month", partialNotice: "Partial notice",
            noticeDaysReceived: "Notice days received", arbitraryDismissalQuestion: "Show an indicative arbitrary-dismissal estimate",
            arbitraryDismissalHelp: "Indicative only, as arbitrary dismissal must be established by the court.",
            unpaidTitle: "Unpaid wages", unpaidSubtitle: "Enter the unpaid duration", unpaidMonths: "Unpaid months", unpaidDays: "Unpaid days",
            unpaidDifferenceWarning: "Unpaid wages mean that no wage was received for the period. Do not enter the same period under wage differences.",
            vacationTitle: "Annual leave", vacationSubtitle: "14 days for the first five years and 21 days from year six",
            includeVacation: "Calculate unused leave", vacationAuto: "Accrual is calculated for the last two years at most",
            vacationAccruedDays: "Automatically accrued leave for the last two years", takenVacationDays: "Leave taken during the last two years",
            additionalVacationDays: "Additional agreed days", vacationDueDays: "Leave days due after deduction",
            overtimeTitle: "Overtime", overtimeSubtitle: "Calculated on an eight-hour workday", includeOvertime: "Calculate overtime",
            overtimeRate: "125% of the regular hourly wage", overtimeEntryMode: "Hour entry method", calculateFromDays: "By working days",
            monthlyHoursDirect: "Direct monthly hours", overtimeHoursPerDay: "Overtime hours per day",
            overtimeDaysPerMonth: "Repeated days per month", overtimeHoursPerMonth: "Total overtime hours per month",
            overtimeMonths: "Number of months", overtimeMonthDefault: "One month is the default so entered hours are not lost",
            totalOvertimeHours: "Total calculated hours", holidaysTitle: "Official holidays and weekly rest",
            holidaysSubtitle: "Holiday days on which the worker worked", includeHolidays: "Calculate holiday work",
            holidayRate: "150% of the regular wage", officialHolidayDays: "Official and religious holiday days",
            weeklyRestDays: "Weekly rest days worked", weeklyRestHelp: "Usually Friday, or another designated weekly rest day",
            holidayEntryMode: "Holiday work entry method", holidayByDays: "By days", holidayByHours: "By hours",
            officialHolidayHours: "Hours worked on official and religious holidays",
            weeklyRestHours: "Hours worked on weekly rest days",
            annualSalariesTitle: "Annual salaries after the twelfth", annualSalariesSubtitle: "Such as the thirteenth and fourteenth salary",
            annualSalariesQuestion: "Is the worker entitled to more than twelve salaries per year?",
            annualSalariesClarification: "This means company annual salaries, not overtime or holiday pay",
            annualSalaryCount: "Total annual salaries due", addAnnualSalary: "Add another annual salary",
            savingsTitle: "Fund entitlements", savingsSubtitle: "Savings, provident, pension or a similar fund",
            includeSavings: "Does the worker have fund entitlements?",
            savingsHelp: "Enter the net amount due according to the fund records", savingsBalance: "Net fund entitlements in dinars",
            calculate: "Calculate rights", reset: "Clear fields", resultsTitle: "Calculated rights",
            resultsSubtitle: "Breakdown of amounts and formulas", total: "Total",
            legalDisclaimer: "Notice: This is a non-binding guidance calculator. Results depend on the accuracy of the user's data and choices.",
            print: "Print results", howItWorks: "How to use", howItWorksText: "Start with the first three cards, then open only the rights you want to calculate.",
            legalReferences: "Related legal provisions", legalReferencesText: "Each calculated right shows its related legal provision.",
            createdBy: "Created by Attorney Mohammad Al-Shouha", footerLaw: "Under Jordanian Labour Law No. 8 of 1996 and amendments"
        }
    };

    let language = "ar";
    let periodCounter = 0;
    let lastResult = null;
    const CURRENT_MINIMUM_MONTHLY_WAGE = 290;

    function t(key) {
        return translations[language][key] || translations.ar[key] || key;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function formatMoney(value) {
        return `${new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        }).format(Number(value) || 0)} ${language === "ar" ? "دينار" : "JOD"}`;
    }

    function formatNumber(value, maximumFractionDigits = 2) {
        return new Intl.NumberFormat(language === "ar" ? "ar-JO" : "en-US", {
            maximumFractionDigits,
            minimumFractionDigits: 0
        }).format(Number(value) || 0);
    }

    function invalidateResults() {
        lastResult = null;
        byId("resultPanel").classList.remove("is-visible");
    }

    function ordinalName(number) {
        const ar = {
            13: "الثالث عشر", 14: "الرابع عشر", 15: "الخامس عشر", 16: "السادس عشر",
            17: "السابع عشر", 18: "الثامن عشر", 19: "التاسع عشر", 20: "العشرون"
        };
        if (language === "ar") return ar[number] || `رقم ${number}`;
        const suffix = number % 10 === 1 && number % 100 !== 11 ? "st"
            : number % 10 === 2 && number % 100 !== 12 ? "nd"
                : number % 10 === 3 && number % 100 !== 13 ? "rd" : "th";
        return `${number}${suffix}`;
    }

    function setVisible(id, visible) {
        const element = byId(id);
        if (element) element.hidden = !visible;
    }

    function updateWageLabels() {
        const type = byId("wageType").value;
        const monthly = type === "monthly";
        const daily = type === "daily";
        byId("paidWageLabel").textContent = language === "ar"
            ? monthly ? "الراتب الشهري الأخير الذي كان يتقاضاه العامل"
                : daily ? "الأجر اليومي الأخير الذي كان يتقاضاه العامل"
                    : "الأجر الأخير الذي كان يتقاضاه العامل"
            : monthly ? "Last monthly salary received"
                : daily ? "Last daily wage received" : "Last wage received";
        byId("entitledWageLabel").textContent = language === "ar"
            ? monthly ? "الراتب الشهري الأخير المتفق عليه أو المستحق"
                : daily ? "الأجر اليومي الأخير المتفق عليه أو المستحق"
                    : "الأجر المتفق عليه أو المستحق"
            : monthly ? "Agreed or due monthly salary"
                : daily ? "Agreed or due daily wage" : "Agreed or due wage";
        byId("paidWageHelp").textContent = language === "ar"
            ? monthly ? "أدخل قيمة الراتب الشهري بالدينار"
                : daily ? "أدخل قيمة أجر اليوم الواحد بالدينار"
                    : "اختر طريقة تقاضي الأجر أولًا"
            : monthly ? "Enter the monthly amount in dinars"
                : daily ? "Enter the one-day wage in dinars"
                     : "Select the wage method first";
        const monthlyEquivalent = engine.getWages(type, numberValue("paidWage")).monthly;
        const showMinimumWarning = Boolean(type) && monthlyEquivalent > 0 &&
            monthlyEquivalent < CURRENT_MINIMUM_MONTHLY_WAGE;
        byId("minimumWageNote").hidden = !showMinimumWarning;
        byId("minimumWageNote").textContent = showMinimumWarning
            ? (language === "ar"
                ? `تنبيه: يعادل هذا الأجر ${formatMoney(monthlyEquivalent)} شهريًا، وهو أقل من الحد الأدنى العام الحالي البالغ ${formatMoney(CURRENT_MINIMUM_MONTHLY_WAGE)} للفترة من 2025 إلى 2027. لا يمنع التنبيه حساب الفترات التاريخية.`
                : `Notice: this equals ${formatMoney(monthlyEquivalent)} per month, below the current general minimum of ${formatMoney(CURRENT_MINIMUM_MONTHLY_WAGE)} for 2025–2027. Historical calculations are not blocked.`)
            : "";
    }

    function periodDurationDefaults() {
        const totalMonths = engine.durationToMonths(
            numberValue("serviceYears"),
            numberValue("serviceMonths"),
            numberValue("serviceDays")
        );
        const capped = Math.min(24, totalMonths);
        return {
            months: Math.floor(capped),
            days: Math.round((capped - Math.floor(capped)) * 30)
        };
    }

    function normalizeMonthDayValues(monthInput, dayInput) {
        if (!monthInput || !dayInput) return;
        const months = Math.max(0, Math.floor(Number(monthInput.value) || 0));
        const days = Math.max(0, Math.floor(Number(dayInput.value) || 0));
        monthInput.value = months + Math.floor(days / 30);
        dayInput.value = days % 30;
    }

    function normalizeServiceDuration() {
        const yearsInput = byId("serviceYears");
        const monthsInput = byId("serviceMonths");
        const daysInput = byId("serviceDays");
        let years = Math.max(0, Math.floor(Number(yearsInput.value) || 0));
        let months = Math.max(0, Math.floor(Number(monthsInput.value) || 0));
        const days = Math.max(0, Math.floor(Number(daysInput.value) || 0));
        months += Math.floor(days / 30);
        years += Math.floor(months / 12);
        yearsInput.value = years;
        monthsInput.value = months % 12;
        daysInput.value = days % 30;
    }

    function normalizeAllDurations() {
        normalizeServiceDuration();
        [
            ["contractDurationMonths", "contractDurationDays"],
            ["contractWorkedMonths", "contractWorkedDays"],
            ["unpaidMonths", "unpaidDays"]
        ].forEach(([monthId, dayId]) => normalizeMonthDayValues(byId(monthId), byId(dayId)));
        document.querySelectorAll(".period-row").forEach((row) => {
            normalizeMonthDayValues(
                row.querySelector('[data-period-field="months"]'),
                row.querySelector('[data-period-field="days"]')
            );
        });
    }

    function updatePeriodWarning(row) {
        const paid = Number(row.querySelector('[data-period-field="paid"]').value) || 0;
        const entitled = Number(row.querySelector('[data-period-field="entitled"]').value) || 0;
        const warning = row.querySelector(".period-warning");
        const noDifference = entitled > 0 && paid >= entitled;
        warning.textContent = noDifference
            ? (language === "ar"
                ? "لا يوجد فرق أجور مستحق في هذه البطاقة لأن الأجر المقبوض يساوي الأجر المستحق أو يزيد عليه."
                : "No wage difference is due in this card because the paid wage equals or exceeds the wage due.")
            : "";
        warning.classList.toggle("is-visible", noDifference);
    }

    function addWagePeriod(values = {}) {
        periodCounter += 1;
        const defaults = periodDurationDefaults();
        const useCurrentWage = Object.keys(values).length === 0;
        const paid = values.paid ?? byId("paidWage").value ?? "";
        const entitled = values.entitled ?? byId("entitledWage").value ?? "";
        const row = document.createElement("div");
        row.className = "period-row";
        row.dataset.periodId = String(periodCounter);
        row.dataset.autoSync = useCurrentWage ? "true" : "false";
        row.innerHTML = `
            <div class="period-title">
                <h3>${language === "ar" ? `فترة الأجر رقم ${periodCounter}` : `Wage period ${periodCounter}`}</h3>
                <button class="icon-button remove-period" type="button" aria-label="${language === "ar" ? "حذف الفترة" : "Remove period"}">×</button>
            </div>
            <div class="field-grid">
                <div class="field">
                    <label data-period-label="paid">${language === "ar" ? "الأجر المقبوض خلال هذه الفترة" : "Wage received during this period"}</label>
                    <input data-period-field="paid" type="number" min="0" step="0.001" value="${escapeHtml(paid)}">
                </div>
                <div class="field">
                    <label data-period-label="entitled">${language === "ar" ? "الأجر المستحق خلال هذه الفترة" : "Wage due during this period"}</label>
                    <input data-period-field="entitled" type="number" min="0" step="0.001" value="${escapeHtml(entitled)}">
                </div>
                <div class="field">
                    <label data-period-label="months">${language === "ar" ? "عدد الأشهر" : "Months"}</label>
                    <input data-period-field="months" type="number" min="0" step="1" value="${escapeHtml(values.months ?? defaults.months)}">
                </div>
                <div class="field">
                    <label data-period-label="days">${language === "ar" ? "الأيام الإضافية" : "Additional days"}</label>
                    <input data-period-field="days" type="number" min="0" max="29" step="1" value="${escapeHtml(values.days ?? defaults.days)}">
                </div>
            </div>
            <div class="validation-message period-warning"></div>`;
        row.querySelector(".remove-period").addEventListener("click", () => {
            row.remove();
            renumberPeriods();
            invalidateResults();
        });
        row.querySelectorAll("input").forEach((input) => {
            input.addEventListener("input", () => {
                if (input.matches('[data-period-field="paid"], [data-period-field="entitled"]')) {
                    row.dataset.autoSync = "false";
                }
                updatePeriodWarning(row);
                invalidateResults();
            });
            input.addEventListener("change", () => {
                normalizeMonthDayValues(
                    row.querySelector('[data-period-field="months"]'),
                    row.querySelector('[data-period-field="days"]')
                );
            });
        });
        byId("wagePeriodList").appendChild(row);
        renumberPeriods();
    }

    function syncFirstWagePeriod() {
        const first = byId("wagePeriodList").firstElementChild;
        if (!first || first.dataset.autoSync !== "true") return;
        first.querySelector('[data-period-field="paid"]').value = byId("paidWage").value;
        first.querySelector('[data-period-field="entitled"]').value = byId("entitledWage").value;
    }

    function renumberPeriods() {
        [...byId("wagePeriodList").children].forEach((row, index) => {
            row.querySelector("h3").textContent = language === "ar"
                ? `فترة الأجر رقم ${index + 1}` : `Wage period ${index + 1}`;
            row.querySelector(".remove-period").setAttribute("aria-label",
                language === "ar" ? "حذف الفترة" : "Remove period");
            row.querySelector('[data-period-label="paid"]').textContent = language === "ar"
                ? "الأجر المقبوض خلال هذه الفترة" : "Wage received during this period";
            row.querySelector('[data-period-label="entitled"]').textContent = language === "ar"
                ? "الأجر المستحق خلال هذه الفترة" : "Wage due during this period";
            row.querySelector('[data-period-label="months"]').textContent = language === "ar" ? "عدد الأشهر" : "Months";
            row.querySelector('[data-period-label="days"]').textContent = language === "ar" ? "الأيام الإضافية" : "Additional days";
            row.querySelector(".remove-period").hidden = byId("wagePeriodList").children.length === 1;
            updatePeriodWarning(row);
        });
    }

    function readAnnualStates() {
        const states = {};
        document.querySelectorAll(".annual-salary-card").forEach((card) => {
            states[card.dataset.ordinal] = {
                value: card.querySelector('[data-annual-field="value"]').value,
                mode: card.querySelector('[data-annual-field="mode"]').value,
                months: card.querySelector('[data-annual-field="months"]').value,
                paid: card.querySelector('[data-annual-field="paid"]').value
            };
        });
        return states;
    }

    function annualNote(number) {
        if (language === "ar") {
            return `يُحتسب الراتب الإضافي (الراتب ${ordinalName(number)}) بنسبة الأشهر المستحقة من السنة. مثال: راتب 1000 دينار عن 6 أشهر = 500 دينار.`;
        }
        return `The additional salary (${ordinalName(number)} salary) is calculated by the entitled months of the year. Example: JOD 1,000 for 6 months = JOD 500.`;
    }

    function updateAnnualCardWarning(card) {
        const value = Number(card.querySelector('[data-annual-field="value"]').value) || 0;
        const mode = card.querySelector('[data-annual-field="mode"]').value;
        const months = mode === "prorated"
            ? Math.min(12, Math.max(1, Number(card.querySelector('[data-annual-field="months"]').value) || 1))
            : 12;
        const accrued = value * months / 12;
        const paid = Number(card.querySelector('[data-annual-field="paid"]').value) || 0;
        const warning = card.querySelector(".annual-paid-warning");
        const fullyPaid = value > 0 && paid >= accrued;
        warning.textContent = fullyPaid
            ? (language === "ar"
                ? "المبلغ المدفوع يساوي الجزء المستحق أو يزيد عليه؛ لذلك لا يوجد مبلغ متبقٍ من هذا الراتب الإضافي، ولن تخصم الزيادة من الحقوق الأخرى."
                : "The amount paid equals or exceeds the accrued amount, so nothing remains due and no excess will be deducted from other rights.")
            : "";
        warning.classList.toggle("is-visible", fullyPaid);
    }

    function renderAnnualSalaries(savedStates) {
        const states = savedStates || readAnnualStates();
        const count = Math.max(13, Number(byId("annualSalaryCount").value) || 13);
        byId("annualSalaryList").innerHTML = "";
        for (let ordinal = 13; ordinal <= count; ordinal += 1) {
            const state = states[ordinal] || { value: "", mode: "full", months: 12, paid: 0 };
            const card = document.createElement("div");
            card.className = "annual-salary-card";
            card.dataset.ordinal = String(ordinal);
            card.innerHTML = `
                <div class="annual-salary-title">
                    <h3>${language === "ar" ? `الراتب ${ordinalName(ordinal)}` : `${ordinalName(ordinal)} salary`}</h3>
                </div>
                <div class="field-grid">
                    <div class="field">
                        <label>${language === "ar" ? "قيمة الراتب الإضافي الكاملة" : "Full additional salary value"}</label>
                        <input data-annual-field="value" type="number" min="0" step="0.001" value="${escapeHtml(state.value)}">
                    </div>
                    <div class="field">
                        <label>${language === "ar" ? "طريقة الاستحقاق" : "Entitlement method"}</label>
                        <select data-annual-field="mode">
                            <option value="full"${state.mode === "full" ? " selected" : ""}>${language === "ar" ? "كامل الراتب الإضافي" : "Full additional salary"}</option>
                            <option value="prorated"${state.mode === "prorated" ? " selected" : ""}>${language === "ar" ? "حسب أشهر العمل المستحقة" : "By entitled months"}</option>
                        </select>
                    </div>
                    <div class="field annual-months"${state.mode !== "prorated" ? " hidden" : ""}>
                        <label>${language === "ar" ? "عدد الأشهر المستحقة من السنة" : "Entitled months of the year"}</label>
                        <input data-annual-field="months" type="number" min="1" max="12" step="1" value="${escapeHtml(state.months || 1)}">
                    </div>
                    <div class="field">
                        <label>${language === "ar" ? "المبلغ الذي دُفع منه سابقًا" : "Amount already paid"}</label>
                        <input data-annual-field="paid" type="number" min="0" step="0.001" value="${escapeHtml(state.paid || 0)}">
                    </div>
                    <div class="info-note full annual-note"${state.mode !== "prorated" ? " hidden" : ""}>${escapeHtml(annualNote(ordinal))}</div>
                    <div class="validation-message full annual-paid-warning"></div>
                </div>`;
            const mode = card.querySelector('[data-annual-field="mode"]');
            mode.addEventListener("change", () => {
                const prorated = mode.value === "prorated";
                card.querySelector(".annual-months").hidden = !prorated;
                card.querySelector(".annual-note").hidden = !prorated;
                updateAnnualCardWarning(card);
                invalidateResults();
            });
            card.querySelectorAll("input").forEach((input) => {
                input.addEventListener("input", () => {
                    updateAnnualCardWarning(card);
                    invalidateResults();
                });
            });
            byId("annualSalaryList").appendChild(card);
            updateAnnualCardWarning(card);
        }
    }

    function updateAnnualOptions() {
        const select = byId("annualSalaryCount");
        const current = Number(select.value) || 13;
        [...select.options].forEach((option) => {
            const count = Number(option.value);
            option.textContent = language === "ar"
                ? `${count} راتبًا سنويًا` : `${count} annual salaries`;
        });
        select.value = String(current);
    }

    function updateConditionalFields() {
        const contract = byId("contractType").value;
        const termination = byId("terminationBy").value;
        setVisible("wageDifferenceSection", byId("hasWageDifference").checked);
        if (byId("hasWageDifference").checked && !byId("wagePeriodList").children.length) addWagePeriod();
        setVisible("fixedContractSection", contract === "definite" && termination === "employer");
        setVisible("indefiniteContractSection", contract === "indefinite" && termination === "employer");
        setVisible("arbitraryDismissalSection", contract === "indefinite" && termination === "employer");
        setVisible("partialNoticeSection", contract === "indefinite" && termination === "employer" &&
            document.querySelector('input[name="noticeMode"]:checked')?.value === "partial");
        setVisible("vacationSection", byId("includeVacation").checked);
        setVisible("overtimeSection", byId("includeOvertime").checked);
        const manualOvertime = byId("overtimeManual").checked;
        setVisible("overtimeAutoFields", !manualOvertime);
        setVisible("overtimeManualField", manualOvertime);
        setVisible("holidaysSection", byId("includeHolidays").checked);
        const holidayByHours = byId("holidayByHours").checked;
        setVisible("holidayDayFields", !holidayByHours);
        setVisible("holidayHourFields", holidayByHours);
        setVisible("annualSalariesSection", byId("includeAnnualSalaries").checked);
        if (byId("includeAnnualSalaries").checked && !byId("annualSalaryList").children.length) renderAnnualSalaries();
        setVisible("savingsSection", byId("includeSavings").checked);
        updateLiveCalculations();
        updateProgress();
    }

    function updateLiveCalculations() {
        const accrual = engine.calculateVacationAccrual(
            numberValue("serviceYears"), numberValue("serviceMonths"), numberValue("serviceDays")
        );
        byId("vacationAccruedDays").value = Number(accrual.totalDays.toFixed(4));
        byId("vacationDueDays").value = Math.max(
            0,
            accrual.totalDays + numberValue("additionalVacationDays") - numberValue("takenVacationDays")
        ).toFixed(4);
        const monthlyHours = byId("overtimeManual").checked
            ? numberValue("overtimeHoursPerMonth")
            : numberValue("overtimeHoursPerDay") * numberValue("overtimeDaysPerMonth");
        byId("totalOvertimeHours").value = (monthlyHours * Math.max(1, numberValue("overtimeMonths"))).toFixed(2);
        updateWageLabels();
    }

    function updateProgress() {
        const checks = [
            Boolean(byId("wageType").value),
            numberValue("paidWage") > 0,
            engine.durationToMonths(numberValue("serviceYears"), numberValue("serviceMonths"), numberValue("serviceDays")) > 0,
            Boolean(byId("socialSecurity").value),
            Boolean(byId("contractType").value && byId("terminationBy").value)
        ];
        const complete = checks.filter(Boolean).length;
        byId("progressValue").style.width = `${complete * 20}%`;
        byId("progressText").textContent = language === "ar"
            ? `البيانات الأساسية ${complete} من 5`
            : `Essential information ${complete} of 5`;
    }

    function collectPeriods() {
        return [...document.querySelectorAll(".period-row")].map((row) => ({
            paid: Number(row.querySelector('[data-period-field="paid"]').value) || 0,
            entitled: Number(row.querySelector('[data-period-field="entitled"]').value) || 0,
            months: Number(row.querySelector('[data-period-field="months"]').value) || 0,
            days: Number(row.querySelector('[data-period-field="days"]').value) || 0
        }));
    }

    function collectAnnualSalaries() {
        return [...document.querySelectorAll(".annual-salary-card")].map((card) => ({
            ordinal: Number(card.dataset.ordinal),
            value: Number(card.querySelector('[data-annual-field="value"]').value) || 0,
            mode: card.querySelector('[data-annual-field="mode"]').value,
            months: Number(card.querySelector('[data-annual-field="months"]').value),
            paid: Number(card.querySelector('[data-annual-field="paid"]').value) || 0
        }));
    }

    function collectInput() {
        return {
            wageType: byId("wageType").value,
            paidWage: numberValue("paidWage"),
            hasWageDifference: byId("hasWageDifference").checked,
            entitledWage: numberValue("entitledWage"),
            wageDifferencePeriods: collectPeriods(),
            serviceYears: numberValue("serviceYears"),
            serviceMonths: numberValue("serviceMonths"),
            serviceDays: numberValue("serviceDays"),
            socialSecurity: byId("socialSecurity").value,
            contractType: byId("contractType").value,
            terminationBy: byId("terminationBy").value,
            contractDurationMonths: numberValue("contractDurationMonths"),
            contractDurationDays: numberValue("contractDurationDays"),
            contractWorkedMonths: numberValue("contractWorkedMonths"),
            contractWorkedDays: numberValue("contractWorkedDays"),
            noticeMode: document.querySelector('input[name="noticeMode"]:checked')?.value || "none",
            noticeDaysReceived: numberValue("noticeDaysReceived"),
            includeArbitraryDismissal: byId("includeArbitraryDismissal").checked,
            unpaidMonths: numberValue("unpaidMonths"),
            unpaidDays: numberValue("unpaidDays"),
            includeVacation: byId("includeVacation").checked,
            takenVacationDays: numberValue("takenVacationDays"),
            additionalVacationDays: numberValue("additionalVacationDays"),
            includeOvertime: byId("includeOvertime").checked,
            overtimeMode: document.querySelector('input[name="overtimeMode"]:checked')?.value || "auto",
            overtimeHoursPerDay: numberValue("overtimeHoursPerDay"),
            overtimeDaysPerMonth: numberValue("overtimeDaysPerMonth"),
            overtimeHoursPerMonth: numberValue("overtimeHoursPerMonth"),
            overtimeMonths: numberValue("overtimeMonths"),
            includeHolidays: byId("includeHolidays").checked,
            holidayMode: document.querySelector('input[name="holidayMode"]:checked')?.value || "days",
            officialHolidayDays: numberValue("officialHolidayDays"),
            weeklyRestDays: numberValue("weeklyRestDays"),
            officialHolidayHours: numberValue("officialHolidayHours"),
            weeklyRestHours: numberValue("weeklyRestHours"),
            includeAnnualSalaries: byId("includeAnnualSalaries").checked,
            annualSalaryItems: collectAnnualSalaries(),
            includeSavings: byId("includeSavings").checked,
            savingsBalance: numberValue("savingsBalance")
        };
    }

    function showError(message, element) {
        const target = element || byId("formError");
        target.textContent = message;
        target.classList.add("is-visible");
        target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function clearErrors() {
        [
            byId("formError"), byId("wageDifferenceError"), byId("contractError"),
            byId("vacationError"), byId("annualSalaryError")
        ].forEach((node) => {
            node.textContent = "";
            node.classList.remove("is-visible");
        });
    }

    function validate(input) {
        clearErrors();
        const negativeInput = [...document.querySelectorAll('input[type="number"]')]
            .find((element) => element.value !== "" && Number(element.value) < 0);
        if (negativeInput) {
            showError(language === "ar"
                ? "لا تقبل الحاسبة القيم السالبة. راجع القيمة المحددة."
                : "Negative values are not accepted. Review the highlighted value.");
            negativeInput.focus();
            return false;
        }
        const requiredMessage = language === "ar"
            ? "يرجى إكمال البيانات الأساسية: طريقة الأجر، قيمة الأجر، مدة الخدمة، حالة الضمان، نوع العقد ومن أنهى العقد."
            : "Complete the essential information: wage method, wage, service, social security, contract type and termination.";
        if (!input.wageType || input.paidWage <= 0 ||
            engine.durationToMonths(input.serviceYears, input.serviceMonths, input.serviceDays) <= 0 ||
            !input.socialSecurity || !input.contractType || !input.terminationBy) {
            showError(requiredMessage);
            return false;
        }
        if (input.hasWageDifference) {
            const invalidPeriod = input.wageDifferencePeriods.some((period) =>
                period.entitled <= 0 || period.months * 30 + period.days <= 0
            );
            if (!input.wageDifferencePeriods.length || invalidPeriod) {
                showError(language === "ar"
                    ? "راجع فترات فرق الأجور: أدخل الأجر المستحق ومدة صحيحة لكل فترة."
                    : "Review wage periods: enter the wage due and a valid duration for each period.",
                byId("wageDifferenceError"));
                return false;
            }
            const serviceDays = engine.durationToMonths(
                input.serviceYears, input.serviceMonths, input.serviceDays
            ) * 30;
            const wagePeriodDays = input.wageDifferencePeriods.reduce(
                (sum, period) => sum + period.months * 30 + period.days, 0
            );
            if (wagePeriodDays > serviceDays) {
                showError(language === "ar"
                    ? "مجموع فترات فرق الأجور يتجاوز مدة الخدمة. راجع المدد وتأكد من عدم تكرار أي فترة."
                    : "The wage-difference periods exceed the service duration. Review them and remove any repeated period.",
                byId("wageDifferenceError"));
                return false;
            }
        }
        if (input.contractType === "definite" && input.terminationBy === "employer") {
            const total = input.contractDurationMonths * 30 + input.contractDurationDays;
            const worked = input.contractWorkedMonths * 30 + input.contractWorkedDays;
            const service = engine.durationToMonths(
                input.serviceYears, input.serviceMonths, input.serviceDays
            ) * 30;
            if (total <= 0 || worked >= total) {
                showError(language === "ar"
                    ? "في العقد المحدد الذي أنهاه صاحب العمل، أدخل مدة عقد أكبر من المدة التي عملها العامل."
                    : "For an employer-ended fixed contract, the contract duration must exceed the worked duration.",
                byId("contractError"));
                return false;
            }
            if (worked > service) {
                showError(language === "ar"
                    ? "المدة المنفذة من العقد لا يمكن أن تتجاوز مدة الخدمة الإجمالية."
                    : "The worked contract duration cannot exceed the total service duration.",
                byId("contractError"));
                return false;
            }
        }
        if (input.contractType === "indefinite" && input.terminationBy === "employer" &&
            input.noticeMode === "partial" && input.noticeDaysReceived > 30) {
            showError(language === "ar"
                ? "عدد أيام الإشعار الجزئي لا يمكن أن يتجاوز 30 يومًا."
                : "Partial notice received cannot exceed 30 days.",
            byId("contractError"));
            return false;
        }
        if (input.includeVacation) {
            const accrued = engine.calculateVacationAccrual(
                input.serviceYears, input.serviceMonths, input.serviceDays
            ).totalDays + input.additionalVacationDays;
            if (input.takenVacationDays > accrued) {
                showError(language === "ar"
                    ? "عدد أيام الإجازة التي حصل عليها العامل يتجاوز الرصيد المحتسب عن آخر سنتين مع الأيام الإضافية."
                    : "Leave taken exceeds the calculated last-two-year balance plus additional agreed days.",
                byId("vacationError"));
                return false;
            }
        }
        if (input.includeHolidays && input.holidayMode === "days" &&
            (!Number.isInteger(input.officialHolidayDays) || !Number.isInteger(input.weeklyRestDays))) {
            showError(language === "ar"
                ? "أدخل عددًا صحيحًا من الأيام، أو اختر الإدخال حسب الساعات للعمل في جزء من اليوم."
                : "Enter whole days, or choose hour entry for partial days.");
            return false;
        }
        if (input.includeAnnualSalaries) {
            const invalidAnnualSalary = input.annualSalaryItems.some((item) =>
                item.value <= 0 || (item.mode === "prorated" && (item.months < 1 || item.months > 12))
            );
            if (!input.annualSalaryItems.length || invalidAnnualSalary) {
                showError(language === "ar"
                    ? "أدخل قيمة أكبر من صفر لكل راتب إضافي، واجعل أشهر الاستحقاق بين شهر واحد و12 شهرًا."
                    : "Enter a value above zero for every additional salary and keep entitled months between 1 and 12.",
                byId("annualSalaryError"));
                return false;
            }
        }
        return true;
    }

    function resultDefinitions(result) {
        const d = result.details;
        const ar = language === "ar";
        const wagePeriodDetail = d.wageDifference.periods.map((period, index) => ar
            ? `الفترة ${index + 1}: فرق ${formatMoney(period.differencePerUnit)} عن ${formatNumber(period.months)} شهر و${formatNumber(period.days)} يوم = ${formatMoney(period.amount)}`
            : `Period ${index + 1}: ${formatMoney(period.differencePerUnit)} difference for ${formatNumber(period.months)} months and ${formatNumber(period.days)} days = ${formatMoney(period.amount)}`
        ).join(" • ");
        const annualDetail = d.annualSalaries.items.map((item) => ar
            ? `الراتب ${ordinalName(item.ordinal)}: مستحق ${formatMoney(item.accrued)}، مدفوع ${formatMoney(item.paidEntered)}، متبقٍ ${formatMoney(item.amount)}`
            : `${ordinalName(item.ordinal)} salary: accrued ${formatMoney(item.accrued)}, paid ${formatMoney(item.paidEntered)}, remaining ${formatMoney(item.amount)}`
        ).join(" • ");
        return [
            ["unpaidSalary", ar ? "الأجور غير المدفوعة" : "Unpaid wages", ar ? "الأجر الشهري × الأشهر، مضافًا إليه الأجر اليومي × الأيام" : "Monthly wage × months plus daily wage × days", ar ? "المادة 46" : "Article 46"],
            ["fixedTermRemainder", ar ? "أجر المدة المتبقية من العقد" : "Remaining fixed-contract term", ar ? `${d.fixedTerm.remainingMonths} شهر و${d.fixedTerm.remainingDays} يوم من المدة المتبقية` : `${d.fixedTerm.remainingMonths} months and ${d.fixedTerm.remainingDays} remaining days`, ar ? "المادة 26" : "Article 26"],
            ["vacationPay", ar ? "بدل الإجازات السنوية" : "Annual leave allowance", ar ? `${formatNumber(d.vacationDueDays, 4)} يوم مستحق × الأجر اليومي` : `${formatNumber(d.vacationDueDays, 4)} due days × daily wage`, ar ? "المادتان 61 و63" : "Articles 61 and 63"],
            ["endOfService", ar ? "مكافأة نهاية الخدمة" : "End-of-service benefit", ar ? "أجر شهر عن كل سنة خدمة وبنسبة المدة الجزئية" : "One monthly wage per service year, proportionally", ar ? "المادة 32" : "Article 32"],
            ["noticeCompensation", ar ? "بدل الإشعار" : "Notice compensation", ar ? `${d.notice.dueDays} يوم إشعار مستحق` : `${d.notice.dueDays} notice days due`, ar ? "المادة 23" : "Article 23"],
            ["arbitraryDismissal", ar ? "تقدير بدل الفصل التعسفي" : "Indicative arbitrary-dismissal compensation", ar ? "نصف شهر عن كل سنة خدمة، وبحد أدنى أجر شهرين" : "Half a month per service year, minimum two months", ar ? "المادة 25" : "Article 25"],
            ["overtimePay", ar ? "بدل العمل الإضافي" : "Overtime pay", ar ? `${formatNumber(d.overtime.totalHours)} ساعة × أجر الساعة × 125%` : `${formatNumber(d.overtime.totalHours)} hours × hourly wage × 125%`, ar ? "المادة 59" : "Article 59"],
            ["officialHolidayPay", ar ? "بدل العمل في العطل الرسمية والأعياد" : "Official holiday pay", ar
                ? (byId("holidayByHours").checked ? "عدد الساعات × أجر الساعة × 150%" : "عدد الأيام × الأجر اليومي × 150%")
                : (byId("holidayByHours").checked ? "Hours × hourly wage × 150%" : "Days × daily wage × 150%"), ar ? "المادة 59" : "Article 59"],
            ["weeklyRestPay", ar ? "بدل العمل في العطلة الأسبوعية" : "Weekly rest pay", ar
                ? (byId("holidayByHours").checked ? "عدد الساعات × أجر الساعة × 150%" : "عدد الأيام × الأجر اليومي × 150%")
                : (byId("holidayByHours").checked ? "Hours × hourly wage × 150%" : "Days × daily wage × 150%"), ar ? "المادة 59" : "Article 59"],
            ["wageDifference", ar ? "فرق الأجور" : "Wage difference", wagePeriodDetail || (ar ? "لا يوجد فرق مستحق في الفترات المدخلة" : "No difference is due for the entered periods"), ar ? "وفق البيانات المدخلة" : "Based on entered data"],
            ["annualSalaries", ar ? "الرواتب السنوية الإضافية" : "Additional annual salaries", annualDetail, ar ? "وفق العقد أو النظام الداخلي" : "According to contract or policy"],
            ["savingsBalance", ar ? "مستحقات الصناديق" : "Fund entitlements", ar ? "صافي القيمة التي أدخلها المستخدم وفق بيانات الصندوق" : "Net user-entered amount according to fund records", ar ? "المادة 33" : "Article 33"]
        ];
    }

    function renderResults(result, shouldScroll = true) {
        lastResult = result;
        const rows = resultDefinitions(result).filter(([key]) => result.components[key] > 0);
        byId("grandTotal").textContent = formatMoney(result.total);
        byId("resultContent").innerHTML = rows.length
            ? rows.map(([key, title, formula, reference]) => `
                <article class="result-item">
                    <div class="result-item-top">
                        <h3>${escapeHtml(title)}</h3>
                        <strong>${escapeHtml(formatMoney(result.components[key]))}</strong>
                    </div>
                    <p class="result-formula">${escapeHtml(formula)}</p>
                    <span class="law-pill">${escapeHtml(reference)}</span>
                </article>`).join("")
            : `<div class="info-note">${language === "ar"
                ? "لم ينتج مبلغ مستحق من الخيارات والقيم المدخلة."
                : "The selected options and values produced no amount due."}</div>`;
        byId("resultPanel").classList.add("is-visible");
        if (shouldScroll) {
            byId("resultPanel").scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function applyLanguage() {
        document.documentElement.lang = language;
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            element.textContent = t(element.dataset.i18n);
        });
        byId("languageButton").textContent = language === "ar" ? "English" : "العربية";
        byId("languageButton").setAttribute("aria-label",
            language === "ar" ? "تغيير اللغة إلى الإنجليزية" : "Switch language to Arabic");
        document.title = language === "ar"
            ? "حاسبة الحقوق العمالية - قانون العمل الأردني"
            : "Labour Rights Calculator - Jordanian Labour Law";
        document.querySelector(".progress-panel").setAttribute("aria-label",
            language === "ar" ? "نسبة اكتمال البيانات" : "Data completion progress");
        byId("lawPillList").setAttribute("aria-label",
            language === "ar" ? "المواد القانونية" : "Legal provisions");
        byId("lawPillList").querySelectorAll("[data-article]").forEach((pill) => {
            pill.textContent = language === "ar"
                ? `المادة ${pill.dataset.article}` : `Article ${pill.dataset.article}`;
        });
        const switchLabels = {
            hasWageDifference: ["تفعيل فرق الأجور", "Enable wage differences"],
            includeArbitraryDismissal: ["احتساب تقدير الفصل التعسفي", "Calculate indicative arbitrary-dismissal compensation"],
            includeVacation: ["احتساب بدل الإجازات", "Calculate annual leave allowance"],
            includeOvertime: ["احتساب العمل الإضافي", "Calculate overtime"],
            includeHolidays: ["احتساب العمل في العطل", "Calculate holiday work"],
            includeAnnualSalaries: ["تفعيل الرواتب السنوية الإضافية", "Enable additional annual salaries"],
            includeSavings: ["إضافة مستحقات الصناديق", "Add fund entitlements"]
        };
        Object.entries(switchLabels).forEach(([id, labels]) => {
            byId(id).closest(".switch").setAttribute("aria-label", language === "ar" ? labels[0] : labels[1]);
        });
        updateWageLabels();
        updateAnnualOptions();
        if (byId("annualSalaryList").children.length) renderAnnualSalaries();
        renumberPeriods();
        updateProgress();
        clearErrors();
        if (lastResult) renderResults(lastResult, false);
    }

    document.querySelectorAll(".card-head").forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".calc-card");
            const collapsed = card.classList.toggle("is-collapsed");
            button.setAttribute("aria-expanded", String(!collapsed));
        });
    });

    [
        "hasWageDifference", "contractType", "terminationBy", "noticeNone", "noticeFull",
        "noticePartial", "includeVacation", "includeOvertime", "overtimeAuto", "overtimeManual",
        "includeHolidays", "holidayByDays", "holidayByHours", "includeAnnualSalaries", "includeSavings"
    ].forEach((id) => byId(id).addEventListener("change", updateConditionalFields));

    [
        "serviceYears", "serviceMonths", "serviceDays", "takenVacationDays", "additionalVacationDays",
        "overtimeHoursPerDay", "overtimeDaysPerMonth", "overtimeHoursPerMonth", "overtimeMonths",
        "paidWage", "socialSecurity"
    ].forEach((id) => byId(id).addEventListener("input", () => {
        if (id === "paidWage") syncFirstWagePeriod();
        updateLiveCalculations();
        updateProgress();
    }));

    byId("wageType").addEventListener("change", () => {
        updateWageLabels();
        updateProgress();
        if (byId("annualSalaryList").children.length) renderAnnualSalaries();
    });
    byId("entitledWage").addEventListener("input", () => {
        syncFirstWagePeriod();
        const first = byId("wagePeriodList").firstElementChild;
        if (first) updatePeriodWarning(first);
    });
    byId("addWagePeriod").addEventListener("click", () => {
        addWagePeriod({ paid: "", entitled: "", months: 0, days: 0 });
        invalidateResults();
    });
    byId("annualSalaryCount").addEventListener("change", () => renderAnnualSalaries());
    byId("addAnnualSalary").addEventListener("click", () => {
        const select = byId("annualSalaryCount");
        const next = (Number(select.value) || 13) + 1;
        if (![...select.options].some((option) => Number(option.value) === next)) {
            select.add(new Option(language === "ar" ? `${next} راتبًا سنويًا` : `${next} annual salaries`, String(next)));
        }
        select.value = String(next);
        renderAnnualSalaries();
    });
    byId("languageButton").addEventListener("click", () => {
        language = language === "ar" ? "en" : "ar";
        applyLanguage();
    });
    byId("calculatorForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const negativeInput = [...document.querySelectorAll('input[type="number"]')]
            .find((element) => element.value !== "" && Number(element.value) < 0);
        if (negativeInput) {
            clearErrors();
            showError(language === "ar"
                ? "لا تقبل الحاسبة القيم السالبة. راجع القيمة المحددة."
                : "Negative values are not accepted. Review the highlighted value.");
            negativeInput.focus();
            invalidateResults();
            return;
        }
        normalizeAllDurations();
        updateLiveCalculations();
        const input = collectInput();
        if (!validate(input)) {
            invalidateResults();
            return;
        }
        renderResults(engine.calculate(input));
    });
    byId("calculatorForm").addEventListener("input", invalidateResults);
    byId("calculatorForm").addEventListener("change", invalidateResults);
    [
        ["serviceMonths", "serviceDays"],
        ["contractDurationMonths", "contractDurationDays"],
        ["contractWorkedMonths", "contractWorkedDays"],
        ["unpaidMonths", "unpaidDays"]
    ].forEach(([monthId, dayId]) => {
        byId(dayId).addEventListener("change", () => {
            if (dayId === "serviceDays") normalizeServiceDuration();
            else normalizeMonthDayValues(byId(monthId), byId(dayId));
            updateLiveCalculations();
        });
    });
    byId("serviceMonths").addEventListener("change", () => {
        normalizeServiceDuration();
        updateLiveCalculations();
    });
    byId("resetButton").addEventListener("click", () => {
        byId("calculatorForm").reset();
        byId("wagePeriodList").innerHTML = "";
        byId("annualSalaryList").innerHTML = "";
        byId("resultPanel").classList.remove("is-visible");
        lastResult = null;
        clearErrors();
        updateWageLabels();
        updateConditionalFields();
    });
    byId("printButton").addEventListener("click", () => window.print());

    applyLanguage();
    updateConditionalFields();
})();
