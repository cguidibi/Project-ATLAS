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
