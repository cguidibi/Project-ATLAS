export interface Subsidiary {
    id: string
    name: string
    country: string
    currency: string
    parent_id: string | null
}

export const MOCK_SUBSIDIARIES: Subsidiary[] = [
    {
        id: '1',
        name: 'Atlas Holdings Inc.',
        country: 'United States',
        currency: 'USD',
        parent_id: null,
    },
    {
        id: '2',
        name: 'Atlas Europe Ltd.',
        country: 'United Kingdom',
        currency: 'GBP',
        parent_id: '1',
    },
    {
        id: '3',
        name: 'Atlas Asia Pte. Ltd.',
        country: 'Singapore',
        currency: 'SGD',
        parent_id: '1',
    },
    {
        id: '4',
        name: 'Atlas Germany GmbH',
        country: 'Germany',
        currency: 'EUR',
        parent_id: '2',
    },
]

export interface BankAccount {
    id: string
    subsidiary_id: string
    bank_name: string
    account_number: string
    currency: string
    balance: number
}

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
    {
        id: '1',
        subsidiary_id: '1', // Atlas Holdings Inc.
        bank_name: 'Chase',
        account_number: '1234567890',
        currency: 'USD',
        balance: 1500000.00,
    },
    {
        id: '2',
        subsidiary_id: '2', // Atlas Europe Ltd.
        bank_name: 'Barclays',
        account_number: '9876543210',
        currency: 'GBP',
        balance: 500000.00,
    },
    {
        id: '3',
        subsidiary_id: '3', // Atlas Asia Pte. Ltd.
        bank_name: 'DBS',
        account_number: '1122334455',
        currency: 'SGD',
        balance: 750000.00,
    },
]

export type DebtType = 'Term Loan' | 'Revolver' | 'Bond' | 'Line of Credit' | 'Promissory Note'
export type DebtStatus = 'Active' | 'Matured'

export interface DebtInstrument {
    id: string
    subsidiary_id: string
    lender: string
    type: DebtType
    name: string
    original_amount: number
    currency: string
    interest_rate: number
    rate_type: 'Fixed' | 'Floating'
    start_date: string
    maturity_date: string
    status: DebtStatus
}

export const MOCK_DEBT_INSTRUMENTS: DebtInstrument[] = [
    {
        id: '1',
        subsidiary_id: '1', // Atlas Holdings Inc.
        lender: 'Chase',
        type: 'Term Loan',
        name: 'Term Loan A - 2023',
        original_amount: 5000000.00,
        currency: 'USD',
        interest_rate: 5.25,
        rate_type: 'Fixed',
        start_date: '2023-01-15',
        maturity_date: '2028-01-15',
        status: 'Active',
    },
    {
        id: '2',
        subsidiary_id: '2', // Atlas Europe Ltd.
        lender: 'Barclays',
        type: 'Revolver',
        name: 'Revolving Credit Facility',
        original_amount: 10000000.00,
        currency: 'GBP',
        interest_rate: 4.50, // Base + Spread usually, simplified for MVP
        rate_type: 'Floating',
        start_date: '2022-06-01',
        maturity_date: '2025-06-01',
        status: 'Active',
    },
    {
        id: '3',
        subsidiary_id: '1',
        lender: 'Bank of America',
        type: 'Bond',
        name: 'Senior Notes 2020',
        original_amount: 2000000.00,
        currency: 'USD',
        interest_rate: 3.00,
        rate_type: 'Fixed',
        start_date: '2020-01-01',
        maturity_date: '2023-01-01',
        status: 'Matured',
    }
]
