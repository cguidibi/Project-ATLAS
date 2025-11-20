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
import { MOCK_DEBT_INSTRUMENTS, DebtInstrument, DebtType } from "@/lib/mock-data"

export default function DebtInstruments() {
    const activeInstruments = MOCK_DEBT_INSTRUMENTS.filter(i => i.status === 'Active')
    const maturedInstruments = MOCK_DEBT_INSTRUMENTS.filter(i => i.status === 'Matured')

    const getBadgeVariant = (type: DebtType) => {
        switch (type) {
            case 'Term Loan': return 'default' // Blue-ish (primary)
            case 'Revolver': return 'secondary' // Gray-ish
            case 'Bond': return 'destructive' // Red-ish (using destructive for distinct color, though not "bad")
            default: return 'outline'
        }
    }

    const InstrumentTable = ({ data }: { data: DebtInstrument[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Original Amount</TableHead>
                    <TableHead className="text-right">Interest Rate</TableHead>
                    <TableHead className="text-right">Maturity</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((instrument) => (
                    <TableRow key={instrument.id}>
                        <TableCell className="font-medium">{instrument.name}</TableCell>
                        <TableCell>{instrument.lender}</TableCell>
                        <TableCell>
                            <Badge variant={getBadgeVariant(instrument.type)}>
                                {instrument.type}
                            </Badge>
                        </TableCell>
                        <TableCell>{instrument.currency}</TableCell>
                        <TableCell className="text-right">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: instrument.currency }).format(instrument.original_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                            {instrument.interest_rate.toFixed(2)}% <span className="text-xs text-muted-foreground">({instrument.rate_type})</span>
                        </TableCell>
                        <TableCell className="text-right">{instrument.maturity_date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Debt Instruments</h2>
                    <p className="text-muted-foreground">
                        Manage your debt portfolio, credit facilities, and bonds.
                    </p>
                </div>
                <AddDebtInstrumentForm />
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
                            <InstrumentTable data={MOCK_DEBT_INSTRUMENTS} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
