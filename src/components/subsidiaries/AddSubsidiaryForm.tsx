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

export default function AddSubsidiaryForm() {
    const [open, setOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would call an API
        console.log("Form submitted")
        setOpen(false)
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subsidiary
                </Button>
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>Add Subsidiary</SheetTitle>
                        <SheetDescription>
                            Create a new legal entity in the system.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Entity Name</Label>
                            <Input id="name" placeholder="e.g. Atlas Europe Ltd." required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Select required>
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
                        <div className="grid gap-2">
                            <Label htmlFor="parent">Parent Company</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Root)</SelectItem>
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
                        <Button type="submit">Create Entity</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
