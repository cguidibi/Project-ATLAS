Project ATLAS — Discovery Document (Consolidated V3)

1. Product Goal & Vision

Goal: Build a modern, configurable treasury management platform for debt, credit facilities, investments, cash forecasting, FX, derivatives, and risk — with auditable workflows, multi‑currency support, and AI‑assisted decision support.

Outcome: Replace spreadsheet operations, automate amortization & accruals, centralize all debt instruments, support multi‑entity treasury operations, improve forecasting accuracy, and provide CFO‑level dashboards.

Vision: A scalable treasury operating system supporting SMB up to enterprise needs: liquidity management, covenant monitoring, hedge accounting, investment laddering, interest rate and FX risk, and complete audit transparency.


2. User Roles & Permissions

• Treasurer — full admin rights, workflow approvals, risk limit configuration  
• Analyst — daily operations, updates, modeling, projections  
• CFO — approval rights for high‑impact actions, reporting access  
• Accountant — payment posting, reconciliation, GL integration  
• Risk Manager — exposure monitoring, covenants, risk thresholds  
• Auditor — read‑only, full audit trail visibility  

Permissions include: RLS, record‑level ownership, approval thresholds, maker‑checker workflows, subsidiary‑level restrictions.


3. Supported Financial Instruments

Debt Instruments:
• Long‑term debt (fixed, floating, bullet, amortizing, interest‑only)  
• Corporate bonds + identifiers (CUSIP/ISIN), coupons, redemption schedule  
• Term loans (with syndication and prepayment handling)  
• Revolving credit facilities (drawdowns, repayments, commitment fees)  
• Lines of credit (LOC)  
• Promissory notes  
• Sinking funds (linked or independent)  

Investments:
• Money market, T‑Bills, commercial paper, bonds, CDs  
• Laddering strategies, YTM, MTM  

Market & Derivatives:
• FX: spot, forward, swaps  
• Interest rate derivatives: swaps, caps, floors  
• Hedge designation, valuation, effectiveness  

Banking Foundation:
• Bank accounts, signatories, reconciliations  
• Cash balances and projections


4. Functional Requirements

Core System:
• CRUD for all instruments  
• Bulk import & duplicate detection  
• Audit trail of every action  
• Document attachments + comments + mentions  
• Saved views, filters, smart search  

Debt Management:
• Amortization engine with multiple methods  
• Schedule storage + recalculation with versioning  
• Payment posting & allocation (interest‑first, principal‑first, etc.)  
• Early payment, restructuring, refinancing handling  
• Interest adjustments, rate resets, floating‑rate curves  

LOC & Revolvers:
• Drawdowns, repayments, fees  
• Tiered pricing models  
• Utilization‑based interest  
• Availability calculations  

Sinking Funds:
• Linked to debt, auto‑contribution schedule  
• Performance tracking  

Cash Forecasting:
• Multi‑horizon: 14/30/60/90 days + optional 12‑month manual entries  
• Instrument‑generated expected flows  
• Scenario modeling  

Market Instruments:
• FX & IR derivatives valuation  
• MTM, PV calculations  
• Hedge accounting workflows  

Dashboards:
• Treasurer dashboard: upcoming payments, maturities, WAIR, liquidity  
• CFO dashboard: obligations profile, covenant summary, exposure map  
• Analyst dashboard: tasks, variances, exceptions  

Reporting & Exports:
• CSV exports for all major modules  
• Scheduled reports  
• GL export (summary & detail)

Bank Connectivity & Reconciliation:
• Integration: Support for BAI2 file upload for automatic statement import  
• Data parsing: Automatic extraction of closing balances (Ledger/Available) and transactions  
• Balance Updates: Daily bank balance history by account and subsidiary  
• FX Rate Engine: Centralized exchange rate table (e.g., EUR/USD). Enables multi-currency consolidation in Dashboards.

Manual Tradeflow (Cash Adjustments):
• 'Manual Trade' entity for non-bank/forecast flows (Tax, Interco, Payroll, Capex)  
• Fields: Amount, Currency, Value Date, Category, Subsidiary, Direction (In/Out), Status (Forecast/Confirmed)  

Intercompany Module:
• Intercompany Loans: Debt instruments where Lender and Borrower are internal Subsidiaries.
• Mirror Entries: Automatic generation of reciprocal accounting entries.

Advanced Reporting & Security:
• Report A: Daily Cash Worksheet (Operational View) — Day Start Balance + Debt Transactions + Manual Trades = Day End Balance. Granular view by Subsidiary/Currency  
• Report B: Liquidity Inquiry (Strategic/Forecasting) — Multi-horizon forecasting (Day/Week/Month/Quarter/Year). Rolling forecast (30/60/90 days to 12 months). Aggregation of Bank Balances + Committed Debt Headroom + Forecasted Flows
• Maker-Checker Workflow: Instruments or Trades above defined thresholds require 'Pending Approval' status before impacting reports.

5. Non‑Functional Requirements

Architecture:
• Supabase + Postgres  
• React + TypeScript + Vite  
• Tailwind + shadcn/ui  
• Recharts for analytics  
• PWA support  

Performance:
• Dashboard load < 2 seconds  
• CSV export < 5 seconds for 5k rows  
• Search p95 < 300ms  

Security:
• MFA for privileged roles  
• RLS on all sensitive tables  
• Encryption for confidential fields  
• Session timeout policies  

Precision:
• Monetary fields: NUMERIC(18,4)  
• Interest rates: NUMERIC(8,6)  

Accessibility:
• WCAG 2.1 AA  
• Mobile responsive  
• Dark/light theme  


6. Product Backlog (Prioritized)

MVP:
• Auth + MFA  
• Role management + RLS  
• Subsidiaries + bank accounts  
• Debt instruments (LTD, term loans, LOC, promissory notes)  
• Payment posting  
• Amortization engine  
• Payment diary & calendar  
• Document attachments  
• Comments & activity feed  
• Dashboard basics  
• CSV exports  
• Audit log  
• PWA  

Phase 2–9 (post‑MVP):
• Cash forecasting  
• Investments  
• FX & derivatives  
• Interest rate curves  
• Risk & covenant engine  
• Reporting suite  
• API integrations  
• Bank feeds  
• AI assistant  


7. Acceptance Criteria (AC‑001 → AC‑022)

Examples:

AC‑001 — User can register & login with MFA  
AC‑003 — LTD creation validates fields & generates amortization  
AC‑004 — Amortization schedule matches known financial model  
AC‑005 — Payment posting updates balances and recalculates interest  
AC‑008 — CSV export works and respects filters  
AC‑012 — Document upload, versioning, metadata  
AC‑015 — Audit log records all events  
AC‑018 — PWA installation works on desktop & mobile  
AC‑020 — Duplicate detection prevents accidental double‑entry  
AC‑022 — Bulk actions (delete, reassign, export, recalc)  

Full list included in final doc.


8. Implementation Plan (12 Steps)

Step 1 — Auth & MFA  
Step 2 — DB schema, RLS, indexes  
Step 3 — Subsidiaries, bank accounts  
Step 4 — Debt instruments foundation  
Step 5 — Payment engine  
Step 6 — Amortization engine + schedule storage  
Step 7 — Payment diary + calendar  
Step 8 — Dashboards & analytics  
Step 9 — Reports & CSV export  
Step 10 — GL export & integrators  
Step 11 — Testing (full AC set) + polishing  
Step 12 — Go‑live prep + documentation + pilot rollout  


9. Success Metrics

• Adoption: 80% month‑1, 85% month‑2  
• Accuracy: amortization error <0.1% (MVP), <0.05% post‑MVP  
• Performance: dashboard <2s, exports <5s  
• Reliability: 99.5% uptime MVP → 99.9% after Phase 3  


10. Risks & Mitigation

• Complex amortization errors → unit tests vs Excel models  
• RLS misconfiguration → security testing & audits  
• Integrations instability → retries, fallback uploads  
• Incorrect financial inputs → validation, templates, review workflows  


11. Technical Architecture

• Postgres schema with partitioned tables  
• Materialized views for heavy dashboards  
• JSONB fields for flexible instrument parameters  
• Recursive subsidiaries  
• Modular services: amortization, payments, FX, derivatives  
• Realtime updates via Supabase  
• BAI2 parser service  
• Manual Trade entity with status workflow  
• Aggregated liquidity views (Materialized Views)
• FX Rate Engine (Centralized Table)
• Intercompany Mirror Logic (Triggers/Functions)


12. Next Steps

• Approve V3  
• Lock MVP scope  
• Start Step 1  
• Weekly demos  
• Pilot rollout to treasury team  


