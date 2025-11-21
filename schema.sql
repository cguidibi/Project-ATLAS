-- Project ATLAS - Database Schema V4
-- Includes: Core, Cash Management, Intercompany, FX, and Security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Subsidiaries Table
CREATE TABLE subsidiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    currency TEXT NOT NULL,
    parent_id UUID REFERENCES subsidiaries(id)
);

-- 2. Bank Accounts Table
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    bank_name TEXT NOT NULL,
    account_number_secure TEXT NOT NULL, -- Masked or encrypted in real app
    currency TEXT NOT NULL,
    subsidiary_id UUID REFERENCES subsidiaries(id) NOT NULL
);

-- 3. Debt Instruments Table (JSONB for flexibility)
CREATE TABLE debt_instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'term_loan', 'revolver', 'bond', 'intercompany_loan'
    subsidiary_id UUID REFERENCES subsidiaries(id) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores rates, dates, spreads, etc.
    status TEXT NOT NULL DEFAULT 'active' -- 'active', 'matured', 'pending_approval'
);

-- 4. Bank Statements (BAI2 Headers) - V4
CREATE TABLE bank_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    file_name TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processed', 'error'
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Daily Balances (History) - V4
CREATE TABLE daily_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    bank_account_id UUID REFERENCES bank_accounts(id) NOT NULL,
    date DATE NOT NULL,
    closing_balance NUMERIC(18, 4) NOT NULL,
    available_balance NUMERIC(18, 4),
    currency TEXT NOT NULL,
    UNIQUE(bank_account_id, date)
);

-- 6. Manual Trades (Cash Adjustments) - V4
CREATE TABLE manual_trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    subsidiary_id UUID REFERENCES subsidiaries(id) NOT NULL,
    amount NUMERIC(18, 4) NOT NULL,
    currency TEXT NOT NULL,
    value_date DATE NOT NULL,
    category TEXT NOT NULL, -- 'tax', 'interco', 'payroll', 'capex'
    direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
    status TEXT NOT NULL DEFAULT 'forecast' -- 'forecast', 'confirmed', 'pending_approval'
);

-- 7. Intercompany Loans - V4
CREATE TABLE intercompany_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lender_subsidiary_id UUID REFERENCES subsidiaries(id) NOT NULL,
    borrower_subsidiary_id UUID REFERENCES subsidiaries(id) NOT NULL,
    principal_amount NUMERIC(18, 4) NOT NULL,
    currency TEXT NOT NULL,
    interest_rate NUMERIC(8, 6) NOT NULL,
    start_date DATE NOT NULL,
    maturity_date DATE,
    status TEXT NOT NULL DEFAULT 'active' -- 'active', 'pending_approval', 'closed'
);

-- 8. FX Rates - V4
CREATE TABLE fx_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    currency_pair TEXT NOT NULL, -- e.g., 'EUR/USD'
    rate NUMERIC(18, 6) NOT NULL,
    date DATE NOT NULL,
    source TEXT DEFAULT 'manual', -- 'manual', 'bloomberg', 'ecb'
    UNIQUE(currency_pair, date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE subsidiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE intercompany_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;

-- Create "Public Read" Policies (Permissive for Dev)
CREATE POLICY "Public Access Subsidiaries" ON subsidiaries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Bank Accounts" ON bank_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Debt Instruments" ON debt_instruments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Bank Statements" ON bank_statements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Daily Balances" ON daily_balances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Manual Trades" ON manual_trades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Intercompany Loans" ON intercompany_loans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access FX Rates" ON fx_rates FOR ALL USING (true) WITH CHECK (true);
