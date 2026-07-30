"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const htmlFile = fs.readdirSync(root).find((name) => name.endsWith(".html"));
assert.ok(htmlFile, "main HTML file is present");

const html = fs.readFileSync(path.join(root, htmlFile), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.match(html, /dir="rtl"/, "Arabic layout is right-to-left by default");
assert.match(html, /<link rel="stylesheet" href="styles\.css">/, "local stylesheet is linked");
assert.match(html, /<script src="calculator-engine\.js"><\/script>\s*<script src="app\.js"><\/script>/, "engine loads before UI");
assert.doesNotMatch(
    html,
    /<(?:script|img)[^>]+\ssrc="https?:\/\/|<link(?=[^>]*rel="stylesheet")[^>]+href="https?:\/\//,
    "the application has no remote runtime dependency"
);
assert.match(html, /class="law-button"[\s\S]*?href="https:\/\/www\.mol\.gov\.jo\/AR\/List\//, "the law button points to the Ministry of Labour laws page");
assert.match(html, /class="law-button"[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"/, "the law page opens safely in a new tab");
assert.doesNotMatch(html, /class="law-button"[^>]*\stitle=/, "the law button has no hover note");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "HTML element IDs are unique");

[
    "wageType", "paidWage", "socialSecurity", "contractType", "terminationBy",
    "wagePeriodList", "annualSalaryCount", "annualSalaryList", "resultPanel"
].forEach((id) => assert.ok(ids.includes(id), `required element exists: ${id}`));

assert.match(html, /<option value=""[^>]*>يرجى تحديد حالة الاشتراك<\/option>/, "social security starts without a default answer");
assert.equal((html.match(/class="calc-card/g) || []).length, 9, "nine progressive calculator cards are present");
assert.match(html, /<option value="13">/, "thirteenth salary option exists");
assert.match(html, /<option value="14">/, "fourteenth salary option exists");
assert.match(app, /for \(let ordinal = 13; ordinal <= count; ordinal \+= 1\)/, "annual salary cards are sequential");
assert.match(app, /annualNote\(ordinal\)/, "each prorated annual salary gets its dynamic explanation");
assert.match(app, /terminationBy === "employer"/, "notice and employer-specific rights are routed by termination");
assert.match(app, /normalizeAllDurations/, "duration overflow is normalized visibly before calculation");
assert.match(app, /lastResult/, "the latest result can be re-rendered after language changes");
assert.match(html, /data-article="46"/, "article 46 is included in the legal reference list");
assert.match(html, /id="holidayByHours"/, "partial holiday work can be entered by hours");
assert.match(html, /id="minimumWageNote"/, "current minimum wage warning has a dedicated area");
assert.match(html, /data-i18n="wageDefinitionNote"/, "the wage definition helper is present");
assert.match(app, /minimumFractionDigits:\s*3/, "currency is displayed to three decimal places");
assert.match(css, /@media \(max-width: 680px\)/, "mobile layout rules are present");
assert.match(css, /@media \(max-width: 390px\)/, "small-phone layout rules are present");
assert.match(css, /@media print/, "print layout rules are present");

console.log("All UI structure tests passed.");
