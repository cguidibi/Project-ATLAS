import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Starting Seed Process (V4 - Multi-Currency)...');

    // 0. Cleanup (Delete all existing data to avoid duplicates)
    console.log('🧹 Cleaning up old data...');
    // Delete in reverse order of dependencies
    await supabase.from('daily_balances').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('bank_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('manual_trades').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('intercompany_loans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('debt_instruments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('bank_accounts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('subsidiaries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('fx_rates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleanup complete.');

    // 1. Subsidiaries
    console.log('Creating Subsidiaries...');
    const { data: usSub, error: usError } = await supabase
        .from('subsidiaries')
        .insert({ name: 'Atlas US Holdings Inc.', country: 'USA', currency: 'USD' })
        .select()
        .single();
    if (usError) throw usError;

    const { data: ukSub, error: ukError } = await supabase
        .from('subsidiaries')
        .insert({ name: 'Atlas UK Ltd.', country: 'UK', currency: 'GBP', parent_id: usSub.id })
        .select()
        .single();
    if (ukError) throw ukError;

    const { data: sgSub, error: sgError } = await supabase
        .from('subsidiaries')
        .insert({ name: 'Atlas Singapore Pte. Ltd.', country: 'Singapore', currency: 'SGD', parent_id: usSub.id })
        .select()
        .single();
    if (sgError) throw sgError;

    // [NEW] Canada Subsidiary
    const { data: caSub, error: caError } = await supabase
        .from('subsidiaries')
        .insert({ name: 'Atlas Canada Corp.', country: 'Canada', currency: 'CAD', parent_id: usSub.id })
        .select()
        .single();
    if (caError) throw caError;

    console.log('✅ Subsidiaries created (US, UK, SG, CA).');

    // 2. Bank Accounts
    console.log('Creating Bank Accounts...');
    const { data: chaseAccount } = await supabase
        .from('bank_accounts')
        .insert({ bank_name: 'JPMorgan Chase', account_number_secure: '****8899', currency: 'USD', subsidiary_id: usSub.id })
        .select().single();

    const { data: barclaysAccount } = await supabase
        .from('bank_accounts')
        .insert({ bank_name: 'Barclays', account_number_secure: '****2244', currency: 'GBP', subsidiary_id: ukSub.id })
        .select().single();

    // [NEW] RBC Account
    const { data: rbcAccount } = await supabase
        .from('bank_accounts')
        .insert({ bank_name: 'RBC Royal Bank', account_number_secure: '****1234', currency: 'CAD', subsidiary_id: caSub.id })
        .select().single();

    console.log('✅ Bank Accounts created.');

    // 3. Debt Instruments
    console.log('Creating Debt Instruments...');
    await supabase.from('debt_instruments').insert([
        {
            name: 'Term Loan A',
            type: 'term_loan',
            subsidiary_id: usSub.id,
            details: { interest_rate: 5.25, maturity_date: '2028-12-31', principal: 50000000 },
            status: 'active'
        },
        {
            name: 'Revolver B',
            type: 'revolver',
            subsidiary_id: ukSub.id,
            details: { interest_rate: 'SONIA+2.0%', commitment: 10000000 },
            status: 'active'
        }
    ]);

    // Intercompany Loan
    await supabase.from('intercompany_loans').insert({
        lender_subsidiary_id: usSub.id,
        borrower_subsidiary_id: sgSub.id,
        principal_amount: 2000000,
        currency: 'USD',
        interest_rate: 3.5,
        start_date: '2024-01-01',
        maturity_date: '2025-01-01',
        status: 'active'
    });

    console.log('✅ Debt Instruments created.');

    // 4. Manual Trades
    console.log('Creating Manual Trades...');
    await supabase.from('manual_trades').insert([
        { subsidiary_id: usSub.id, amount: 150000, currency: 'USD', value_date: '2024-12-15', category: 'tax', direction: 'out', status: 'forecast' },
        { subsidiary_id: ukSub.id, amount: 50000, currency: 'GBP', value_date: '2024-11-30', category: 'payroll', direction: 'out', status: 'confirmed' },
        { subsidiary_id: sgSub.id, amount: 500000, currency: 'SGD', value_date: '2025-01-10', category: 'capex', direction: 'out', status: 'forecast' }
    ]);

    console.log('✅ Manual Trades created.');

    // 5. FX Rates
    console.log('Creating FX Rates...');
    await supabase.from('fx_rates').insert([
        { currency_pair: 'EUR/USD', rate: 1.0850, date: new Date().toISOString().split('T')[0], source: 'manual' },
        { currency_pair: 'GBP/USD', rate: 1.2700, date: new Date().toISOString().split('T')[0], source: 'manual' },
        // [NEW] USD/CAD Rate
        { currency_pair: 'USD/CAD', rate: 1.3500, date: new Date().toISOString().split('T')[0], source: 'manual' }
    ]);

    console.log('✅ FX Rates created.');

    // 6. Daily Balances
    console.log('Creating Daily Balances...');
    if (chaseAccount) {
        await supabase.from('daily_balances').insert({
            bank_account_id: chaseAccount.id,
            date: new Date().toISOString().split('T')[0],
            closing_balance: 12500000.00,
            available_balance: 12500000.00,
            currency: 'USD'
        });
    }
    // [NEW] RBC Balance
    if (rbcAccount) {
        await supabase.from('daily_balances').insert({
            bank_account_id: rbcAccount.id,
            date: new Date().toISOString().split('T')[0],
            closing_balance: 500000.00,
            available_balance: 500000.00,
            currency: 'CAD'
        });
    }

    console.log('✅ Daily Balances created.');
    console.log('🚀 Seeding Complete (V4 + Canada)!');
}

seed().catch(console.error);
