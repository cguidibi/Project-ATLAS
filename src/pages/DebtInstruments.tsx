import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AddDebtInstrumentForm from "@/components/debt/AddDebtInstrumentForm"
import { supabase } from "@/lib/supabase"
import { Database } from "@/types/database.types"
import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type DebtInstrument = Database['public']['Tables']['debt_instruments']['Row']

export default function DebtInstruments() {
    const [instruments, setInstruments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingInstrument, setEditingInstrument] = useState<DebtInstrument | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const fetchInstruments = async () => {
        try {
            const { data, error } = await supabase
                .from('debt_instruments')
                .select(`
                    *,
                    subsidiaries (name)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error

            const processedData = (data as any[]).map(inst => {
                const details = inst.details || {}
                return {
                    ...inst,
                    lender: details.lender || 'Unknown',
                    original_amount: details.original_amount || 0,
                    interest_rate: details.interest_rate || 0,
                    rate_type: details.rate_type || 'Fixed',
                    maturity_date: details.maturity_date || 'N/A',
                    currency: details.currency || 'USD'
                }
            })

            setInstruments(processedData)
        } catch (error) {
            console.error('Error fetching debt instruments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInstruments()
    }, [])

    const handleEdit = (instrument: DebtInstrument) => {
        setEditingInstrument(instrument)
        setIsFormOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this debt instrument?')) return

        try {
            const { error } = await supabase
                .from('debt_instruments')
                .delete()
                .eq('id', id)

            if (error) throw error
            fetchInstruments()
        } catch (error) {
            console.error('Error deleting debt instrument:', error)
            alert('Failed to delete debt instrument')
        }
    }

    const handleFormClose = (open: boolean) => {
        setIsFormOpen(open)
        if (!open) setEditingInstrument(null)
    }

    const handleFormSuccess = () => {
        fetchInstruments()
        setIsFormOpen(false)
        setEditingInstrument(null)
    }

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case 'term_loan': return 'default'
            case 'revolver': return 'secondary'
            case 'bond': return 'destructive'
            default: return 'outline'
        }
    }

    // Filter instruments for tabs (simplified logic for now)
    const activeInstruments = instruments // In a real app, filter by maturity date vs today
    const maturedInstruments = [] as any[] // Placeholder

    const InstrumentTable = ({ data }: { data: any[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Original Amount</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Maturity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((inst) => (
                    <TableRow key={inst.id}>
                        <TableCell className="font-medium">{inst.name}</TableCell>
                        <TableCell>{inst.lender}</TableCell>
                        <TableCell>
                            <Badge variant={getBadgeVariant(inst.type)}>
                                {inst.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </Badge>
                        </TableCell>
                        <TableCell>{inst.currency}</TableCell>
                        <TableCell className="text-right font-mono">
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: inst.currency
                            }).format(inst.original_amount)}
                        </TableCell>
                        <TableCell>
                            {inst.interest_rate}% ({inst.rate_type})
                        </TableCell>
                        <TableCell>{inst.maturity_date}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(inst)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(inst.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    if (loading) return <div>Loading...</div>

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Debt Instruments</h2>
                    <p className="text-muted-foreground">
                        Manage your debt portfolio, credit facilities, and bonds.
                    </p>
                </div>
                <div className="flex gap-2">
                    <AddDebtInstrumentForm onSuccess={fetchInstruments} />
                    <AddDebtInstrumentForm
                        open={isFormOpen}
                        onOpenChange={handleFormClose}
                        initialData={editingInstrument}
                        onSuccess={handleFormSuccess}
                    />
                </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList>
                    <TabsTrigger value="active">Active Facilities</TabsTrigger>
                    <TabsTrigger value="matured">Matured</TabsTrigger>
                    <TabsTrigger value="all">All Instruments</TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Facilities</CardTitle>
                            <CardDescription>Currently active debt instruments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <InstrumentTable data={activeInstruments} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="matured">
                    <Card>
                        <CardHeader>
                            <CardTitle>Matured Instruments</CardTitle>
                            <CardDescription>Past instruments that have been fully repaid or matured.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <InstrumentTable data={maturedInstruments} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Instruments</CardTitle>
                            <CardDescription>Complete history of all debt instruments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <InstrumentTable data={instruments} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
