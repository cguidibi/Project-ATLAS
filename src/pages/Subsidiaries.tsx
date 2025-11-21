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
import { supabase } from "@/lib/supabase"
import { Database } from "@/types/database.types"
import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Subsidiary = Database['public']['Tables']['subsidiaries']['Row']

export default function Subsidiaries() {
    const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
    const [loading, setLoading] = useState(true)
    const [editingSubsidiary, setEditingSubsidiary] = useState<Subsidiary | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const fetchSubsidiaries = async () => {
        try {
            const { data, error } = await supabase
                .from('subsidiaries')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setSubsidiaries(data || [])
        } catch (error) {
            console.error('Error fetching subsidiaries:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubsidiaries()
    }, [])

    const handleEdit = (subsidiary: Subsidiary) => {
        setEditingSubsidiary(subsidiary)
        setIsFormOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subsidiary?')) return

        try {
            const { error } = await supabase
                .from('subsidiaries')
                .delete()
                .eq('id', id)

            if (error) throw error
            fetchSubsidiaries()
        } catch (error) {
            console.error('Error deleting subsidiary:', error)
            alert('Failed to delete subsidiary')
        }
    }

    const handleFormClose = (open: boolean) => {
        setIsFormOpen(open)
        if (!open) setEditingSubsidiary(null)
    }

    const handleFormSuccess = () => {
        fetchSubsidiaries()
        setIsFormOpen(false)
        setEditingSubsidiary(null)
    }

    if (loading) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Subsidiaries</h2>
                    <p className="text-muted-foreground">
                        Manage your legal entities and their hierarchy.
                    </p>
                </div>
                <div className="flex gap-2">
                    <AddSubsidiaryForm onSuccess={fetchSubsidiaries} />
                    <AddSubsidiaryForm
                        open={isFormOpen}
                        onOpenChange={handleFormClose}
                        initialData={editingSubsidiary}
                        onSuccess={handleFormSuccess}
                    />
                </div>
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
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subsidiaries.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">{sub.name}</TableCell>
                                    <TableCell>{sub.country}</TableCell>
                                    <TableCell>{sub.currency}</TableCell>
                                    <TableCell>
                                        {sub.parent_id
                                            ? subsidiaries.find(p => p.id === sub.parent_id)?.name
                                            : <span className="text-muted-foreground italic">Root Entity</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(sub)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)}>
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
