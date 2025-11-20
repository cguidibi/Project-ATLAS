import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Building2, Landmark, FileText, PieChart } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Subsidiaries', href: '/subsidiaries', icon: Building2 },
    { name: 'Bank Accounts', href: '/bank-accounts', icon: Landmark },
    { name: 'Debt Instruments', href: '/debt-instruments', icon: FileText },
    { name: 'Reports', href: '/reports', icon: PieChart },
]

export default function Sidebar() {
    const location = useLocation()

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-lg font-bold tracking-tight">Project ATLAS</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t p-4">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        JD
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">Treasurer</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
