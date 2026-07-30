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
        officialHolidayDays: 0,
        weeklyRestDays: 0,
        includeAnnualSalaries: false,
        annualSalaryItems: [],
        includeSavings: false,
        savingsBalance: 0,
        ...overrides
    };
}

const fiveAndHalfYears = calculator.calculateVacationAccrual(5, 6, 0);
close(fiveAndHalfYears.totalDays, 31.5, "leave across the sixth-year threshold");
close(fiveAndHalfYears.daysBeforeSixthYear, 21, "leave before sixth year");
close(fiveAndHalfYears.daysFromSixthYear, 10.5, "leave from sixth year");

const shortServiceLeave = calculator.calculateVacationAccrual(0, 6, 0);
close(shortServiceLeave.totalDays, 7, "proportional leave for six months");

const longServiceLeave = calculator.calculateVacationAccrual(8, 0, 0);
close(longServiceLeave.totalDays, 42, "last two years leave after sixth year");

const fullNotice = calculator.calculateNoticeCompensation("full", 600, 20, 0);
close(fullNotice.amount, 600, "full notice");
assert.equal(fullNotice.dueDays, 30);

const partialNotice = calculator.calculateNoticeCompensation("partial", 600, 20, 10);
close(partialNotice.amount, 400, "partial notice");
assert.equal(partialNotice.dueDays, 20);

const minimumDismissal = calculator.calculateArbitraryDismissal(600, 1, 0, 0);
close(minimumDismissal.amount, 1200, "two-month arbitrary-dismissal minimum");

const noSixMonthCap = calculator.calculateArbitraryDismissal(600, 20, 0, 0);
close(noSixMonthCap.amount, 6000, "arbitrary dismissal has no six-month cap");

const fixedEmployer = calculator.calculate(baseInput({
    contractType: "definite",
    terminationBy: "employer",
    contractDurationMonths: 24,
    contractWorkedMonths: 18
}));
close(fixedEmployer.components.fixedTermRemainder, 3600, "fixed-term remaining wage");

const fixedWorker = calculator.calculate(baseInput({
    contractType: "definite",
    terminationBy: "worker",
    contractDurationMonths: 24,
    contractWorkedMonths: 18
}));
close(fixedWorker.components.fixedTermRemainder, 0, "no automatic remainder when worker ends contract");

const socialSecurityMember = calculator.calculate(baseInput({ socialSecurity: "yes" }));
close(socialSecurityMember.components.endOfService, 0, "no end-of-service benefit for subscriber");

const nonMember = calculator.calculate(baseInput({ socialSecurity: "no", serviceYears: 2, serviceMonths: 6 }));
close(nonMember.components.endOfService, 1500, "proportional end-of-service benefit");

const defaultOvertimeMonth = calculator.calculate(baseInput({
    includeOvertime: true,
    overtimeHoursPerDay: 1,
    overtimeDaysPerMonth: 1,
    overtimeMonths: 0
}));
close(defaultOvertimeMonth.details.overtime.totalHours, 1, "overtime defaults to one month");
close(defaultOvertimeMonth.components.overtimePay, 3.125, "overtime amount at 125 percent");

const preciseOvertime = calculator.calculate(baseInput({
    paidWage: 700,
    includeOvertime: true,
    overtimeMode: "manual",
    overtimeHoursPerMonth: 100,
    overtimeMonths: 1
}));
close(preciseOvertime.components.overtimePay, 364.583, "overtime uses unrounded hourly wage");

const wagePeriods = calculator.calculateWageDifference([
    { paid: 500, entitled: 600, months: 3, days: 0 },
    { paid: 600, entitled: 750, months: 2, days: 15 }
], "monthly");
close(wagePeriods.amount, 675, "multiple monthly wage-difference periods");

const annualSalaries = calculator.calculateAnnualSalaryBenefits([
    { ordinal: 13, value: 1000, mode: "full", months: 12, paid: 0 },
    { ordinal: 14, value: 1000, mode: "prorated", months: 6, paid: 100 }
], 1000);
assert.equal(annualSalaries.items.length, 2);
close(annualSalaries.items[0].amount, 1000, "full thirteenth salary");
close(annualSalaries.items[1].amount, 400, "prorated fourteenth salary after paid amount");
close(annualSalaries.amount, 1400, "sequential annual salaries total");

console.log("All calculator engine tests passed.");
