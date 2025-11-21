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
import { supabase } from "@/lib/supabase"
import { Database } from "@/types/database.types"
import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type BankAccount = Database['public']['Tables']['bank_accounts']['Row']

export default function BankAccounts() {
    const [accounts, setAccounts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const fetchAccounts = async () => {
        try {
            const { data, error } = await supabase
                .from('bank_accounts_view')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAccounts(data || [])
        } catch (error) {
            console.error('Error fetching bank accounts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAccounts()
    }, [])

    const handleEdit = (account: BankAccount) => {
        setEditingAccount(account)
        setIsFormOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this bank account? This action cannot be undone.')) {
            return
        }

        try {
            const { error } = await supabase
                .from('bank_accounts')
                .delete()
                .eq('id', id)

            if (error) {
                // Handle specific error cases
                if (error.code === '23503') {
                    alert('Cannot delete this account because it has associated transaction history. Please remove all related records first.')
                } else if (error.message.includes('permission')) {
                    alert('You do not have permission to delete this account.')
                } else {
                    alert(`Failed to delete account: ${error.message}`)
                }
                return
            }

            // Success - refresh the list
            await fetchAccounts()
        } catch (error) {
            console.error('Error deleting bank account:', error)
            alert('An unexpected error occurred while deleting the account. Please try again.')
        }
    }

    const handleFormClose = (open: boolean) => {
        setIsFormOpen(open)
        if (!open) setEditingAccount(null)
    }

    const handleFormSuccess = () => {
        fetchAccounts()
        setIsFormOpen(false)
        setEditingAccount(null)
    }

    if (loading) {
        return <div className="p-8">Loading...</div>
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
                <AddBankAccountForm onSuccess={fetchAccounts} />
                <AddBankAccountForm
                    open={isFormOpen}
                    onOpenChange={handleFormClose}
                    initialData={editingAccount}
                    onSuccess={handleFormSuccess}
                />
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
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell className="font-medium">{account.bank_name}</TableCell>
                                    <TableCell className="font-mono">{account.account_number_secure}</TableCell>
                                    <TableCell>{account.currency}</TableCell>
                                    <TableCell>{account.subsidiary_name || 'Unknown'}</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: account.currency
                                        }).format(account.latest_balance)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(account)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
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
