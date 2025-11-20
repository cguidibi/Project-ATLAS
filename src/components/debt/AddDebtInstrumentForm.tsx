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
import { MOCK_SUBSIDIARIES } from '@/lib/mock-data'

export default function AddDebtInstrumentForm() {
    const [open, setOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Debt Instrument Form submitted")
        setOpen(false)
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Instrument
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>Add Debt Instrument</SheetTitle>
                        <SheetDescription>
                            Create a new debt facility, loan, or bond.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-6 py-6">
                        {/* Section 1: Core Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Core Details</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Instrument Name</Label>
                                    <Input id="name" placeholder="e.g. Term Loan A - 2024" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="lender">Lender / Counterparty</Label>
                                        <Input id="lender" placeholder="e.g. Chase" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Term Loan">Term Loan</SelectItem>
                                                <SelectItem value="Revolver">Revolver</SelectItem>
                                                <SelectItem value="Bond">Bond</SelectItem>
                                                <SelectItem value="Line of Credit">Line of Credit</SelectItem>
                                                <SelectItem value="Promissory Note">Promissory Note</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subsidiary">Subsidiary</Label>
                                        <Select required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select entity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MOCK_SUBSIDIARIES.map((sub) => (
                                                    <SelectItem key={sub.id} value={sub.id}>
                                                        {sub.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="SGD">SGD</SelectItem>
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
                                    <Input id="amount" type="number" placeholder="0.00" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="rateType">Interest Rate Type</Label>
                                        <Select required>
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
                                        <Input id="rate" type="number" step="0.0001" placeholder="5.25" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="baseRate">Base Rate (if floating)</Label>
                                        <Input id="baseRate" placeholder="e.g. SOFR" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="spread">Spread (bps)</Label>
                                        <Input id="spread" type="number" placeholder="e.g. 150" />
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
                                    <Input id="startDate" type="date" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="maturityDate">Maturity Date</Label>
                                    <Input id="maturityDate" type="date" required />
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
                        <Button type="submit">Create Instrument</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
