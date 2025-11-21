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
    type TEXT NOT NULL, -- 'term_loan', 'revolver', 'bond', etc.
    subsidiary_id UUID REFERENCES subsidiaries(id) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb -- Stores rates, dates, spreads, etc.
);

-- 4. Bank Statements (BAI2 Headers) - NEW V4
CREATE TABLE bank_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    file_name TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processed', 'error'
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Bank Transactions - NEW V4
CREATE TABLE bank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    statement_id UUID REFERENCES bank_statements(id),
    bank_account_id UUID REFERENCES bank_accounts(id),
    amount NUMERIC(18, 4) NOT NULL,
    currency TEXT NOT NULL,
    value_date DATE NOT NULL,
    description TEXT,
    bai_code TEXT -- Specific BAI2 transaction code
);

-- 6. Manual Trades (Cash Adjustments) - NEW V4
CREATE TABLE manual_trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    subsidiary_id UUID REFERENCES subsidiaries(id) NOT NULL,
    amount NUMERIC(18, 4) NOT NULL,
    currency TEXT NOT NULL,
    value_date DATE NOT NULL,
    category TEXT NOT NULL, -- 'tax', 'interco', 'payroll', etc.
    direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
    status TEXT NOT NULL DEFAULT 'forecast' -- 'forecast', 'confirmed'
);

-- Enable Row Level Security (RLS)
ALTER TABLE subsidiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_trades ENABLE ROW LEVEL SECURITY;

-- Create "Public Read" Policies (Permissive for Dev)
CREATE POLICY "Public Access Subsidiaries" ON subsidiaries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Bank Accounts" ON bank_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Debt Instruments" ON debt_instruments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Bank Statements" ON bank_statements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Bank Transactions" ON bank_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Manual Trades" ON manual_trades FOR ALL USING (true) WITH CHECK (true);
