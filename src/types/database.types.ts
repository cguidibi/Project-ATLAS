export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            subsidiaries: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    country: string
                    currency: string
                    parent_id: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    country: string
                    currency: string
                    parent_id?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    country?: string
                    currency?: string
                    parent_id?: string | null
                }
            }
            bank_accounts: {
                Row: {
                    id: string
                    created_at: string
                    bank_name: string
                    account_number_secure: string
                    currency: string
                    subsidiary_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    bank_name: string
                    account_number_secure: string
                    currency: string
                    subsidiary_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    bank_name?: string
                    account_number_secure?: string
                    currency?: string
                    subsidiary_id?: string
                }
            }
            debt_instruments: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    type: string
                    subsidiary_id: string
                    details: Json
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    type: string
                    subsidiary_id: string
                    details?: Json
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    type?: string
                    subsidiary_id?: string
                    details?: Json
                }
            }
            manual_trades: {
                Row: {
                    id: string
                    created_at: string
                    subsidiary_id: string
                    amount: number
                    currency: string
                    value_date: string
                    category: string
                    direction: 'in' | 'out'
                    status: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    subsidiary_id: string
                    amount: number
                    currency: string
                    value_date: string
                    category: string
                    direction: 'in' | 'out'
                    status?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    subsidiary_id?: string
                    amount?: number
                    currency?: string
                    value_date?: string
                    category?: string
                    direction?: 'in' | 'out'
                    status?: string
                }
            }
            daily_balances: {
                Row: {
                    id: string
                    created_at: string
                    bank_account_id: string
                    date: string
                    closing_balance: number
                    available_balance: number | null
                    currency: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    bank_account_id: string
                    date: string
                    closing_balance: number
                    available_balance?: number | null
                    currency: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    bank_account_id?: string
                    date?: string
                    closing_balance?: number
                    available_balance?: number | null
                    currency?: string
                }
            }
        }
        Views: {
            bank_accounts_view: {
                Row: {
                    id: string
                    created_at: string
                    bank_name: string
                    account_number_secure: string
                    currency: string
                    subsidiary_id: string
                    subsidiary_name: string | null
                    latest_balance: number
                }
            }
        }
    }
}
