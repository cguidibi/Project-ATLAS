-- Project ATLAS MVP Schema
-- Based on Discovery Document V3

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
-- Responds to AC-001: User can register & login with MFA
-- MVP Feature: Auth + MFA, Role management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Treasurer', 'Analyst', 'CFO', 'Accountant', 'Risk Manager', 'Auditor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subsidiaries Table
-- Responds to MVP Feature: Subsidiaries + bank accounts
-- Supports multi-entity treasury operations (Goal & Vision)
CREATE TABLE subsidiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES subsidiaries(id), -- Recursive structure for hierarchy
    country TEXT NOT NULL,
    currency TEXT NOT NULL, -- Functional currency
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank Accounts Table
-- Responds to MVP Feature: Subsidiaries + bank accounts
-- Foundation for Cash Forecasting (Phase 2) and Payment Posting (AC-005)
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subsidiary_id UUID NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    currency TEXT NOT NULL,
    balance NUMERIC(18,4) DEFAULT 0, -- High precision for monetary values
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debt Instruments Table
-- Responds to AC-003: LTD creation validates fields & generates amortization
-- MVP Feature: Debt instruments (LTD, term loans, LOC, promissory notes)
CREATE TABLE debt_instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subsidiary_id UUID NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES bank_accounts(id), -- For funding/repayment
    type TEXT NOT NULL CHECK (type IN ('term_loan', 'revolver', 'line_of_credit', 'promissory_note', 'bond')),
    principal_amount NUMERIC(18,4) NOT NULL, -- High precision for monetary values
    interest_rate NUMERIC(8,6) NOT NULL, -- High precision for rates (e.g. 5.123456%)
    start_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    details JSONB DEFAULT '{}'::jsonb, -- Flexible storage for instrument-specific parameters (spread, day_count, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance (Non-Functional Requirement: Search p95 < 300ms)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subsidiaries_parent ON subsidiaries(parent_id);
CREATE INDEX idx_bank_accounts_subsidiary ON bank_accounts(subsidiary_id);
CREATE INDEX idx_debt_instruments_subsidiary ON debt_instruments(subsidiary_id);
