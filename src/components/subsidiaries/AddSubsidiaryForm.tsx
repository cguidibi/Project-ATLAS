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

type Subsidiary = Database['public']['Tables']['subsidiaries']['Row']

interface AddSubsidiaryFormProps {
    initialData?: Subsidiary | null
    onSuccess?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function AddSubsidiaryForm({ initialData, onSuccess, open: controlledOpen, onOpenChange }: AddSubsidiaryFormProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? onOpenChange! : setInternalOpen

    const [loading, setLoading] = useState(false)

    // Form state
    const [name, setName] = useState('')
    const [country, setCountry] = useState('')
    const [currency, setCurrency] = useState('')
    const [parentId, setParentId] = useState<string>('none')

    // Reset form when opening/closing or initialData changes
    React.useEffect(() => {
        if (open) {
            if (initialData) {
                setName(initialData.name)
                setCountry(initialData.country)
                setCurrency(initialData.currency)
                setParentId(initialData.parent_id || 'none')
            } else {
                // Reset for new entry
                setName('')
                setCountry('')
                setCurrency('')
                setParentId('none')
            }
        }
    }, [open, initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const subsidiaryData: Database['public']['Tables']['subsidiaries']['Insert'] = {
                name,
                country,
                currency,
                parent_id: parentId === 'none' ? null : parentId
            }

            let error
            if (initialData) {
                // Update
                const { error: updateError } = await supabase
                    .from('subsidiaries')
                    .update(subsidiaryData)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('subsidiaries')
                    .insert([subsidiaryData])
                error = insertError
            }

            if (error) throw error

            setOpen(false)
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error('Error saving subsidiary:', error)
            alert('Failed to save subsidiary')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {/* Only show trigger button if not controlled (or if we want to allow opening from here even if controlled) */}
                {!isControlled && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subsidiary
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>{initialData ? 'Edit Subsidiary' : 'Add Subsidiary'}</SheetTitle>
                        <SheetDescription>
                            {initialData ? 'Update the details of this legal entity.' : 'Create a new legal entity in the system.'}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Entity Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Atlas Europe Ltd."
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Select required value={country} onValueChange={setCountry}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="de">Germany</SelectItem>
                                    <SelectItem value="sg">Singapore</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Functional Currency</Label>
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
                            <Label htmlFor="parent">Parent Company</Label>
                            <Select value={parentId} onValueChange={setParentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Root)</SelectItem>
                                    {/* Ideally fetch potential parents here, for now hardcoded or passed in */}
                                    <SelectItem value="1">Atlas Holdings Inc.</SelectItem>
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
                            {loading ? 'Saving...' : (initialData ? 'Update Entity' : 'Create Entity')}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
