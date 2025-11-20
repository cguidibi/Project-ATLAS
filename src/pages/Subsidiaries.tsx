import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AddSubsidiaryForm from "@/components/subsidiaries/AddSubsidiaryForm"
import { MOCK_SUBSIDIARIES } from "@/lib/mock-data"

export default function Subsidiaries() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Subsidiaries</h2>
                    <p className="text-muted-foreground">
                        Manage your legal entities and their hierarchy.
                    </p>
                </div>
                <AddSubsidiaryForm />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Entities</CardTitle>
                    <CardDescription>
                        A list of all registered subsidiaries and their details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead>Parent Entity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_SUBSIDIARIES.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">{sub.name}</TableCell>
                                    <TableCell>{sub.country}</TableCell>
                                    <TableCell>{sub.currency}</TableCell>
                                    <TableCell>
                                        {sub.parent_id
                                            ? MOCK_SUBSIDIARIES.find(p => p.id === sub.parent_id)?.name
                                            : <span className="text-muted-foreground italic">Root Entity</span>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
