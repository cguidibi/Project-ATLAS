import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type BankAccount = Database['public']['Tables']['bank_accounts']['Row']
type Subsidiary = Database['public']['Tables']['subsidiaries']['Row']

interface AddBankAccountFormProps {
    initialData?: BankAccount | null
    onSuccess?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function AddBankAccountForm({ initialData, onSuccess, open: controlledOpen, onOpenChange }: AddBankAccountFormProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? onOpenChange! : setInternalOpen

    const [loading, setLoading] = useState(false)
    const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])

    // Form state
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [currency, setCurrency] = useState('')
    const [subsidiaryId, setSubsidiaryId] = useState('')

    // Fetch subsidiaries
    React.useEffect(() => {
        const fetchSubsidiaries = async () => {
            const { data } = await supabase.from('subsidiaries').select('*').order('name')
            if (data) setSubsidiaries(data)
        }
        fetchSubsidiaries()
    }, [])

    // Reset form
    React.useEffect(() => {
        if (open) {
            if (initialData) {
                setBankName(initialData.bank_name)
                setAccountNumber(initialData.account_number_secure)
                setCurrency(initialData.currency)
                setSubsidiaryId(initialData.subsidiary_id)
            } else {
                setBankName('')
                setAccountNumber('')
                setCurrency('')
                setSubsidiaryId('')
            }
        }
    }, [open, initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const accountData: Database['public']['Tables']['bank_accounts']['Insert'] = {
                bank_name: bankName,
                account_number_secure: accountNumber,
                currency,
                subsidiary_id: subsidiaryId
            }

            let error
            if (initialData) {
                const { error: updateError } = await supabase
                    .from('bank_accounts')
                    .update(accountData)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('bank_accounts')
                    .insert([accountData])
                error = insertError
            }

            if (error) throw error

            setOpen(false)
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error('Error saving bank account:', error)
            alert('Failed to save bank account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {!isControlled && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Bank Account
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>{initialData ? 'Edit Bank Account' : 'Add Bank Account'}</SheetTitle>
                        <SheetDescription>
                            {initialData ? 'Update bank account details.' : 'Register a new bank account for a subsidiary.'}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input
                                id="bankName"
                                placeholder="e.g. Chase, Barclays"
                                required
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input
                                id="accountNumber"
                                placeholder="e.g. 1234567890"
                                required
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select required value={currency} onValueChange={setCurrency}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="SGD">SGD</SelectItem>
                                    <SelectItem value="CAD">CAD</SelectItem>
                                    <SelectItem value="AUD">AUD</SelectItem>
                                    <SelectItem value="JPY">JPY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subsidiary">Subsidiary</Label>
                            <Select required value={subsidiaryId} onValueChange={setSubsidiaryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subsidiary" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subsidiaries.map((sub) => (
                                        <SelectItem key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (initialData ? 'Update Account' : 'Add Account')}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
