-- Create a view for bank accounts with subsidiary name and latest balance
-- This ensures all accounts are visible even without balance history

CREATE OR REPLACE VIEW public.bank_accounts_view AS
SELECT 
    ba.id,
    ba.created_at,
    ba.bank_name,
    ba.account_number_secure,
    ba.currency,
    ba.subsidiary_id,
    s.name AS subsidiary_name,
    COALESCE(
        (
            SELECT db.closing_balance
            FROM public.daily_balances db
            WHERE db.bank_account_id = ba.id
            ORDER BY db.date DESC
            LIMIT 1
        ),
        0
    ) AS latest_balance
FROM 
    public.bank_accounts ba
LEFT JOIN 
    public.subsidiaries s ON ba.subsidiary_id = s.id;

-- Grant access to the view
GRANT SELECT ON public.bank_accounts_view TO authenticated;
GRANT SELECT ON public.bank_accounts_view TO anon;
