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
