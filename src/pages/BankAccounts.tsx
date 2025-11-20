import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AddBankAccountForm from "@/components/bank-accounts/AddBankAccountForm"
import { MOCK_BANK_ACCOUNTS, MOCK_SUBSIDIARIES } from "@/lib/mock-data"

export default function BankAccounts() {
    const getSubsidiaryName = (id: string) => {
        return MOCK_SUBSIDIARIES.find(sub => sub.id === id)?.name || 'Unknown Entity'
    }

    const maskAccountNumber = (accountNumber: string) => {
        if (!accountNumber) return ''
        return `****${accountNumber.slice(-4)}`
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bank Accounts</h2>
                    <p className="text-muted-foreground">
                        Manage banking relationships and account details.
                    </p>
                </div>
                <AddBankAccountForm />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Accounts</CardTitle>
                    <CardDescription>
                        A list of all registered bank accounts across subsidiaries.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bank Name</TableHead>
                                <TableHead>Account Number</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead>Subsidiary</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_BANK_ACCOUNTS.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell className="font-medium">{account.bank_name}</TableCell>
                                    <TableCell className="font-mono">{maskAccountNumber(account.account_number)}</TableCell>
                                    <TableCell>{account.currency}</TableCell>
                                    <TableCell>{getSubsidiaryName(account.subsidiary_id)}</TableCell>
                                    <TableCell className="text-right">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}
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
