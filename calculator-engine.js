(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) {
        module.exports = api;
    }
    root.LaborCalculator = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const DAYS_PER_MONTH = 30;
    const MONTHS_PER_YEAR = 12;
    const HOURS_PER_DAY = 8;
    const MAX_STANDARD_CLAIM_MONTHS = 24;

    function number(value, fallback = 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    function nonNegative(value) {
        return Math.max(0, number(value));
    }

    function roundMoney(value) {
        return Math.round((number(value) + Number.EPSILON) * 1000) / 1000;
    }

    function durationToMonths(years, months, days) {
        return nonNegative(years) * MONTHS_PER_YEAR +
            nonNegative(months) +
            nonNegative(days) / DAYS_PER_MONTH;
    }

    function durationToDays(months, days) {
        return nonNegative(months) * DAYS_PER_MONTH + nonNegative(days);
    }

    function getWages(wageType, wageValue) {
        const wage = nonNegative(wageValue);
        const daily = wageType === "daily" ? wage : wage / DAYS_PER_MONTH;
        const monthly = wageType === "daily" ? wage * DAYS_PER_MONTH : wage;
        return {
            daily,
            monthly,
            hourly: daily / HOURS_PER_DAY
        };
    }

    function calculateVacationAccrual(years, months, days) {
        const totalServiceMonths = durationToMonths(years, months, days);
        const calculatedMonths = Math.min(totalServiceMonths, MAX_STANDARD_CLAIM_MONTHS);
        const periodStart = Math.max(0, totalServiceMonths - calculatedMonths);
        const periodEnd = totalServiceMonths;

        const monthsBeforeSixthYear = Math.max(
            0,
            Math.min(periodEnd, 60) - Math.min(periodStart, 60)
        );
        const monthsFromSixthYear = Math.max(0, periodEnd - Math.max(periodStart, 60));

        const daysBeforeSixthYear = monthsBeforeSixthYear * (14 / MONTHS_PER_YEAR);
        const daysFromSixthYear = monthsFromSixthYear * (21 / MONTHS_PER_YEAR);

        return {
            totalServiceMonths,
            calculatedMonths,
            monthsBeforeSixthYear,
            monthsFromSixthYear,
            daysBeforeSixthYear,
            daysFromSixthYear,
            totalDays: daysBeforeSixthYear + daysFromSixthYear
        };
    }

    function calculateNoticeCompensation(mode, monthlyWage, dailyWage, noticeDaysReceived) {
        if (mode === "full") {
            return {
                amount: roundMoney(monthlyWage),
                dueDays: DAYS_PER_MONTH
            };
        }

        if (mode === "partial") {
            const received = Math.min(DAYS_PER_MONTH, nonNegative(noticeDaysReceived));
            const dueDays = Math.max(0, DAYS_PER_MONTH - received);
            return {
                amount: roundMoney(dailyWage * dueDays),
                dueDays
            };
        }

        return { amount: 0, dueDays: 0 };
    }

    function calculateArbitraryDismissal(monthlyWage, years, months, days) {
        const serviceYears = durationToMonths(years, months, days) / MONTHS_PER_YEAR;
        const calculated = monthlyWage * 0.5 * serviceYears;
        const minimum = monthlyWage * 2;
        return {
            serviceYears,
            calculatedAmount: roundMoney(calculated),
            minimumAmount: roundMoney(minimum),
            amount: roundMoney(Math.max(calculated, minimum))
        };
    }

    function calculateEndOfService(monthlyWage, years, months, days, socialSecurity) {
        if (socialSecurity !== "no") {
            return 0;
        }
        const serviceYears = durationToMonths(years, months, days) / MONTHS_PER_YEAR;
        return roundMoney(monthlyWage * serviceYears);
    }

    function calculateFixedTermRemainder(input, monthlyWage, dailyWage) {
        if (input.contractType !== "definite" || input.terminationBy !== "employer") {
            return {
                remainingMonths: 0,
                remainingDays: 0,
                amount: 0
            };
        }

        const contractDays = durationToDays(input.contractDurationMonths, input.contractDurationDays);
        const workedDays = durationToDays(input.contractWorkedMonths, input.contractWorkedDays);
        const remainingTotalDays = Math.max(0, contractDays - workedDays);
        const remainingMonths = Math.floor(remainingTotalDays / DAYS_PER_MONTH);
        const remainingDays = remainingTotalDays % DAYS_PER_MONTH;

        return {
            remainingMonths,
            remainingDays,
            amount: roundMoney(remainingMonths * monthlyWage + remainingDays * dailyWage)
        };
    }

    function calculateWageDifference(periods, wageType) {
        const details = (periods || []).map(function (period, index) {
            const paid = nonNegative(period.paid);
            const entitled = nonNegative(period.entitled);
            const months = nonNegative(period.months);
            const days = nonNegative(period.days);
            const differencePerUnit = Math.max(0, entitled - paid);
            const amount = wageType === "daily"
                ? differencePerUnit * (months * DAYS_PER_MONTH + days)
                : differencePerUnit * months + (differencePerUnit / DAYS_PER_MONTH) * days;

            return {
                index,
                paid,
                entitled,
                months,
                days,
                differencePerUnit: roundMoney(differencePerUnit),
                amount: roundMoney(amount)
            };
        });

        return {
            periods: details,
            amount: roundMoney(details.reduce(function (sum, period) {
                return sum + period.amount;
            }, 0))
        };
    }

    function calculateOvertime(input, hourlyWage) {
        const months = Math.max(1, nonNegative(input.overtimeMonths));
        const monthlyHours = input.overtimeMode === "manual"
            ? nonNegative(input.overtimeHoursPerMonth)
            : nonNegative(input.overtimeHoursPerDay) * nonNegative(input.overtimeDaysPerMonth);
        const totalHours = monthlyHours * months;

        return {
            months,
                monthlyHours,
                totalHours,
            amount: roundMoney(totalHours * hourlyWage * 1.25)
        };
    }

    function calculateAnnualSalaryBenefits(items) {
        const details = (items || []).map(function (item) {
            const annualValue = nonNegative(item.value);
            const months = item.mode === "prorated"
                ? Math.min(MONTHS_PER_YEAR, Math.max(1, nonNegative(item.months)))
                : MONTHS_PER_YEAR;
            const accrued = annualValue * (months / MONTHS_PER_YEAR);
            const paidEntered = nonNegative(item.paid);
            const paid = Math.min(accrued, paidEntered);
            return {
                ordinal: number(item.ordinal),
                mode: item.mode === "prorated" ? "prorated" : "full",
                annualValue: roundMoney(annualValue),
                months,
                accrued: roundMoney(accrued),
                paidEntered: roundMoney(paidEntered),
                paid: roundMoney(paid),
                isFullyPaid: paidEntered >= accrued,
                amount: roundMoney(Math.max(0, accrued - paid))
            };
        });

        return {
            items: details,
            amount: roundMoney(details.reduce(function (sum, item) {
                return sum + item.amount;
            }, 0))
        };
    }

    function calculate(input) {
        const paidWages = getWages(input.wageType, input.paidWage);
        const entitledValue = input.hasWageDifference
            ? Math.max(nonNegative(input.paidWage), nonNegative(input.entitledWage))
            : nonNegative(input.paidWage);
        const wages = getWages(input.wageType, entitledValue);

        const unpaidSalary = roundMoney(
            nonNegative(input.unpaidMonths) * wages.monthly +
            Math.min(DAYS_PER_MONTH, nonNegative(input.unpaidDays)) * wages.daily
        );

        const vacationAccrual = calculateVacationAccrual(
            input.serviceYears,
            input.serviceMonths,
            input.serviceDays
        );
        const vacationAvailableDays =
            vacationAccrual.totalDays + nonNegative(input.additionalVacationDays);
        const vacationDueDays = input.includeVacation
            ? Math.max(0, vacationAvailableDays - nonNegative(input.takenVacationDays))
            : 0;
        const vacationPay = roundMoney(vacationDueDays * wages.daily);

        const endOfService = calculateEndOfService(
            wages.monthly,
            input.serviceYears,
            input.serviceMonths,
            input.serviceDays,
            input.socialSecurity
        );

        const notice = input.contractType === "indefinite" &&
            input.terminationBy === "employer"
            ? calculateNoticeCompensation(
                input.noticeMode,
                wages.monthly,
                wages.daily,
                input.noticeDaysReceived
            )
            : { amount: 0, dueDays: 0 };

        const arbitraryDismissal = input.includeArbitraryDismissal &&
            input.contractType === "indefinite" &&
            input.terminationBy === "employer"
            ? calculateArbitraryDismissal(
                wages.monthly,
                input.serviceYears,
                input.serviceMonths,
                input.serviceDays
            )
            : { serviceYears: 0, calculatedAmount: 0, minimumAmount: 0, amount: 0 };

        const fixedTerm = calculateFixedTermRemainder(input, wages.monthly, wages.daily);

        const overtime = input.includeOvertime
            ? calculateOvertime(input, wages.hourly)
            : { months: 1, monthlyHours: 0, totalHours: 0, amount: 0 };

        const holidayPay = input.includeHolidays
            ? roundMoney(input.holidayMode === "hours"
                ? nonNegative(input.officialHolidayHours) * wages.hourly * 1.5
                : nonNegative(input.officialHolidayDays) * wages.daily * 1.5)
            : 0;
        const weeklyRestPay = input.includeHolidays
            ? roundMoney(input.holidayMode === "hours"
                ? nonNegative(input.weeklyRestHours) * wages.hourly * 1.5
                : nonNegative(input.weeklyRestDays) * wages.daily * 1.5)
            : 0;

        const wageDifference = input.hasWageDifference
            ? calculateWageDifference(input.wageDifferencePeriods, input.wageType)
            : { periods: [], amount: 0 };

        const annualSalaries = input.includeAnnualSalaries
            ? calculateAnnualSalaryBenefits(input.annualSalaryItems)
            : { items: [], amount: 0 };

        const savingsBalance = input.includeSavings ? nonNegative(input.savingsBalance) : 0;

        const components = {
            unpaidSalary,
            fixedTermRemainder: fixedTerm.amount,
            vacationPay,
            endOfService,
            noticeCompensation: notice.amount,
            arbitraryDismissal: arbitraryDismissal.amount,
            overtimePay: overtime.amount,
            officialHolidayPay: holidayPay,
            weeklyRestPay,
            wageDifference: wageDifference.amount,
            annualSalaries: annualSalaries.amount,
            savingsBalance: roundMoney(savingsBalance)
        };

        const total = roundMoney(Object.values(components).reduce(function (sum, value) {
            return sum + nonNegative(value);
        }, 0));

        return {
            paidWages,
            wages,
            components,
            total,
            details: {
                vacationAccrual,
                vacationAvailableDays,
                vacationDueDays,
                notice,
                arbitraryDismissal,
                fixedTerm,
                overtime,
                wageDifference,
                annualSalaries
            }
        };
    }

    return {
        constants: {
            DAYS_PER_MONTH,
            MONTHS_PER_YEAR,
            HOURS_PER_DAY,
            MAX_STANDARD_CLAIM_MONTHS
        },
        calculate,
        calculateAnnualSalaryBenefits,
        calculateArbitraryDismissal,
        calculateNoticeCompensation,
        calculateOvertime,
        calculateVacationAccrual,
        calculateWageDifference,
        durationToMonths,
        getWages,
        roundMoney
    };
});
