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

type DebtInstrument = Database['public']['Tables']['debt_instruments']['Row']
type Subsidiary = Database['public']['Tables']['subsidiaries']['Row']

interface AddDebtInstrumentFormProps {
    initialData?: DebtInstrument | null
    onSuccess?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function AddDebtInstrumentForm({ initialData, onSuccess, open: controlledOpen, onOpenChange }: AddDebtInstrumentFormProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? onOpenChange! : setInternalOpen

    const [loading, setLoading] = useState(false)
    const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])

    // Form state
    const [name, setName] = useState('')
    const [lender, setLender] = useState('')
    const [type, setType] = useState('')
    const [subsidiaryId, setSubsidiaryId] = useState('')
    const [currency, setCurrency] = useState('')
    const [amount, setAmount] = useState('')
    const [rateType, setRateType] = useState('')
    const [rate, setRate] = useState('')
    const [baseRate, setBaseRate] = useState('')
    const [spread, setSpread] = useState('')
    const [startDate, setStartDate] = useState('')
    const [maturityDate, setMaturityDate] = useState('')

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
                const details = initialData.details as any || {}
                setName(initialData.name)
                setSubsidiaryId(initialData.subsidiary_id)
                setCurrency(initialData.currency)
                setType(initialData.type) // Assuming type is stored as snake_case or matching UI value

                // Extract details
                setLender(details.lender || '')
                setAmount(details.original_amount || '')
                setRateType(details.rate_type || '')
                setRate(details.interest_rate || '')
                setBaseRate(details.base_rate || '')
                setSpread(details.spread || '')
                setStartDate(details.start_date || '')
                setMaturityDate(details.maturity_date || '')
            } else {
                setName('')
                setLender('')
                setType('')
                setSubsidiaryId('')
                setCurrency('')
                setAmount('')
                setRateType('')
                setRate('')
                setBaseRate('')
                setSpread('')
                setStartDate('')
                setMaturityDate('')
            }
        }
    }, [open, initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const details = {
                lender,
                original_amount: amount,
                rate_type: rateType,
                interest_rate: rate,
                base_rate: baseRate,
                spread,
                start_date: startDate,
                maturity_date: maturityDate,
                currency // Moving currency to details
            }

            const instrumentData: Database['public']['Tables']['debt_instruments']['Insert'] = {
                name,
                subsidiary_id: subsidiaryId,
                type,
                details
            }

            let error
            if (initialData) {
                const { error: updateError } = await supabase
                    .from('debt_instruments')
                    .update(instrumentData)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('debt_instruments')
                    .insert([instrumentData])
                error = insertError
            }

            if (error) throw error

            setOpen(false)
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error('Error saving debt instrument:', error)
            alert('Failed to save debt instrument')
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
                        Add Instrument
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>{initialData ? 'Edit Debt Instrument' : 'Add Debt Instrument'}</SheetTitle>
                        <SheetDescription>
                            {initialData ? 'Update debt instrument details.' : 'Create a new debt facility, loan, or bond.'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-6 py-6">
                        {/* Section 1: Core Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Core Details</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Instrument Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Term Loan A - 2024"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="lender">Lender / Counterparty</Label>
                                        <Input
                                            id="lender"
                                            placeholder="e.g. Chase"
                                            required
                                            value={lender}
                                            onChange={(e) => setLender(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select required value={type} onValueChange={setType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="term_loan">Term Loan</SelectItem>
                                                <SelectItem value="revolver">Revolver</SelectItem>
                                                <SelectItem value="bond">Bond</SelectItem>
                                                <SelectItem value="line_of_credit">Line of Credit</SelectItem>
                                                <SelectItem value="promissory_note">Promissory Note</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subsidiary">Subsidiary</Label>
                                        <Select required value={subsidiaryId} onValueChange={setSubsidiaryId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select entity" />
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
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        {/* Section 2: Financials */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Financials</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Initial Principal Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="rateType">Interest Rate Type</Label>
                                        <Select required value={rateType} onValueChange={setRateType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Fixed/Floating" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Fixed">Fixed</SelectItem>
                                                <SelectItem value="Floating">Floating</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="rate">Interest Rate (%)</Label>
                                        <Input
                                            id="rate"
                                            type="number"
                                            step="0.0001"
                                            placeholder="5.25"
                                            required
                                            value={rate}
                                            onChange={(e) => setRate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="baseRate">Base Rate (if floating)</Label>
                                        <Input
                                            id="baseRate"
                                            placeholder="e.g. SOFR"
                                            value={baseRate}
                                            onChange={(e) => setBaseRate(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="spread">Spread (bps)</Label>
                                        <Input
                                            id="spread"
                                            type="number"
                                            placeholder="e.g. 150"
                                            value={spread}
                                            onChange={(e) => setSpread(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        {/* Section 3: Dates */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Key Dates</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="maturityDate">Maturity Date</Label>
                                    <Input
                                        id="maturityDate"
                                        type="date"
                                        required
                                        value={maturityDate}
                                        onChange={(e) => setMaturityDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (initialData ? 'Update Instrument' : 'Create Instrument')}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
