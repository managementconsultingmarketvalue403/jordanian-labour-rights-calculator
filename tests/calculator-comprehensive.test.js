"use strict";

const assert = require("node:assert/strict");
const calculator = require("../calculator-engine.js");

function close(actual, expected, message) {
    assert.ok(
        Math.abs(actual - expected) < 0.0011,
        `${message}: expected ${expected}, received ${actual}`
    );
}

function baseInput(overrides = {}) {
    return {
        wageType: "monthly",
        paidWage: 600,
        hasWageDifference: false,
        entitledWage: 0,
        wageDifferencePeriods: [],
        serviceYears: 1,
        serviceMonths: 0,
        serviceDays: 0,
        socialSecurity: "yes",
        contractType: "indefinite",
        terminationBy: "worker",
        contractDurationMonths: 0,
        contractDurationDays: 0,
        contractWorkedMonths: 0,
        contractWorkedDays: 0,
        noticeMode: "none",
        noticeDaysReceived: 0,
        includeArbitraryDismissal: false,
        unpaidMonths: 0,
        unpaidDays: 0,
        includeVacation: false,
        takenVacationDays: 0,
        additionalVacationDays: 0,
        includeOvertime: false,
        overtimeMode: "auto",
        overtimeHoursPerDay: 0,
        overtimeDaysPerMonth: 0,
        overtimeHoursPerMonth: 0,
        overtimeMonths: 1,
        includeHolidays: false,
        holidayMode: "days",
        officialHolidayDays: 0,
        weeklyRestDays: 0,
        officialHolidayHours: 0,
        weeklyRestHours: 0,
        includeAnnualSalaries: false,
        annualSalaryItems: [],
        includeSavings: false,
        savingsBalance: 0,
        ...overrides
    };
}

const monthlyWages = calculator.getWages("monthly", 600);
close(monthlyWages.daily, 20, "monthly to daily conversion");
close(monthlyWages.hourly, 2.5, "monthly to hourly conversion");
close(calculator.getWages("daily", 20).monthly, 600, "daily to monthly conversion");

const preciseLeave = calculator.calculate(baseInput({
    serviceYears: 5,
    serviceMonths: 1,
    includeVacation: true
}));
close(preciseLeave.details.vacationAccrual.totalDays, 28.5833333333, "precise leave days");
close(preciseLeave.components.vacationPay, 571.667, "leave money rounds only at the end");

close(
    calculator.calculate(baseInput({
        serviceYears: 10,
        includeVacation: true
    })).details.vacationAccrual.totalDays,
    42,
    "leave is capped to the last two service years"
);

close(
    calculator.calculate(baseInput({
        terminationBy: "employer",
        noticeMode: "full"
    })).components.noticeCompensation,
    600,
    "employer-ended indefinite contract gets full notice compensation"
);
close(
    calculator.calculate(baseInput({
        terminationBy: "employer",
        noticeMode: "partial",
        noticeDaysReceived: 10
    })).components.noticeCompensation,
    400,
    "partial notice awards the remaining twenty days"
);
close(
    calculator.calculate(baseInput({
        terminationBy: "worker",
        noticeMode: "full"
    })).components.noticeCompensation,
    0,
    "worker-ended contract does not award notice compensation"
);

close(
    calculator.calculate(baseInput({
        terminationBy: "employer",
        includeArbitraryDismissal: true
    })).components.arbitraryDismissal,
    1200,
    "arbitrary dismissal minimum is two months"
);
close(
    calculator.calculate(baseInput({
        terminationBy: "employer",
        includeArbitraryDismissal: true,
        serviceYears: 20
    })).components.arbitraryDismissal,
    6000,
    "arbitrary dismissal has no six-month cap"
);

close(
    calculator.calculate(baseInput({
        contractType: "definite",
        terminationBy: "employer",
        contractDurationMonths: 12,
        contractDurationDays: 15,
        contractWorkedMonths: 10,
        contractWorkedDays: 5
    })).components.fixedTermRemainder,
    1400,
    "fixed-term remainder includes remaining months and days"
);
close(
    calculator.calculate(baseInput({
        contractType: "definite",
        terminationBy: "worker",
        contractDurationMonths: 12,
        contractWorkedMonths: 10
    })).components.fixedTermRemainder,
    0,
    "worker-ended fixed contract has no automatic remainder award"
);

close(
    calculator.calculate(baseInput({
        socialSecurity: "no",
        serviceYears: 2,
        serviceMonths: 6
    })).components.endOfService,
    1500,
    "non-subscriber gets proportional end-of-service benefit"
);
close(
    calculator.calculate(baseInput({
        socialSecurity: "yes",
        serviceYears: 20
    })).components.endOfService,
    0,
    "social-security subscriber gets no end-of-service benefit from this card"
);

close(
    calculator.calculate(baseInput({
        unpaidMonths: 2,
        unpaidDays: 15
    })).components.unpaidSalary,
    1500,
    "unpaid monthly wages include partial month"
);
close(
    calculator.calculate(baseInput({
        wageType: "daily",
        paidWage: 20,
        unpaidMonths: 1,
        unpaidDays: 5
    })).components.unpaidSalary,
    700,
    "unpaid daily wages use thirty days per month"
);

const noWageDifference = calculator.calculateWageDifference([
    { paid: 600, entitled: 500, months: 3, days: 0 }
], "monthly");
close(noWageDifference.amount, 0, "paid wage above due wage does not create a negative claim");

close(
    calculator.calculate(baseInput({
        includeOvertime: true,
        overtimeHoursPerDay: 2,
        overtimeDaysPerMonth: 10,
        overtimeMonths: 3
    })).components.overtimePay,
    187.5,
    "overtime is paid at one hundred twenty-five percent"
);

const holidayDays = calculator.calculate(baseInput({
    includeHolidays: true,
    holidayMode: "days",
    officialHolidayDays: 2,
    weeklyRestDays: 1
}));
close(holidayDays.components.officialHolidayPay, 60, "official holiday days at one hundred fifty percent");
close(holidayDays.components.weeklyRestPay, 30, "weekly rest days at one hundred fifty percent");

const holidayHours = calculator.calculate(baseInput({
    includeHolidays: true,
    holidayMode: "hours",
    officialHolidayHours: 4,
    weeklyRestHours: 2
}));
close(holidayHours.components.officialHolidayPay, 15, "partial official holiday work by hours");
close(holidayHours.components.weeklyRestPay, 7.5, "partial weekly rest work by hours");

const zeroAnnualSalary = calculator.calculateAnnualSalaryBenefits([
    { ordinal: 13, value: 0, mode: "full", months: 12, paid: 0 }
], 600);
close(zeroAnnualSalary.amount, 0, "zero annual salary never falls back to monthly wage");

const overpaidAnnualSalary = calculator.calculateAnnualSalaryBenefits([
    { ordinal: 13, value: 1000, mode: "prorated", months: 6, paid: 600 }
]);
close(overpaidAnnualSalary.amount, 0, "annual salary overpayment never becomes a negative right");
close(overpaidAnnualSalary.items[0].paidEntered, 600, "actual paid amount remains visible");

for (const wageType of ["monthly", "daily"]) {
    for (const socialSecurity of ["yes", "no"]) {
        for (const contractType of ["indefinite", "definite"]) {
            for (const terminationBy of ["employer", "worker", "mutual", "expired"]) {
                const result = calculator.calculate(baseInput({
                    wageType,
                    paidWage: wageType === "monthly" ? 600 : 20,
                    socialSecurity,
                    contractType,
                    terminationBy,
                    contractDurationMonths: 24,
                    contractWorkedMonths: 12,
                    noticeMode: "full",
                    includeArbitraryDismissal: true,
                    includeVacation: true,
                    includeOvertime: true,
                    overtimeHoursPerDay: 1,
                    overtimeDaysPerMonth: 1,
                    includeHolidays: true,
                    officialHolidayDays: 1,
                    includeSavings: true,
                    savingsBalance: 100
                }));
                assert.ok(Number.isFinite(result.total), "combination total is finite");
                assert.ok(result.total >= 0, "combination total is non-negative");
                const componentTotal = Object.values(result.components)
                    .reduce((sum, value) => sum + value, 0);
                close(result.total, calculator.roundMoney(componentTotal), "combination total equals component sum");
            }
        }
    }
}

console.log("All comprehensive calculator tests passed.");
