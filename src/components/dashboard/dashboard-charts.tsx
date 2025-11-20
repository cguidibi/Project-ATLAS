import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Hardcoded data for visual perfection
const maturityData = [
    { year: "2025", amount: 12500000 },
    { year: "2026", amount: 8000000 },
    { year: "2027", amount: 15000000 },
    { year: "2028", amount: 5000000 },
    { year: "2029", amount: 4500000 },
]

const liquidityData = [
    { name: "USD", value: 8500000, color: "#0ea5e9" }, // Sky 500
    { name: "EUR", value: 2500000, color: "#22c55e" }, // Green 500
    { name: "GBP", value: 1500000, color: "#eab308" }, // Yellow 500
]

export function DebtMaturityChart() {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Debt Maturity Profile</CardTitle>
                <CardDescription>Principal repayment obligations by year</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={maturityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000000}M`}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, 'Principal']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="amount" fill="#0f172a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export function LiquidityPieChart() {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Liquidity by Currency</CardTitle>
                <CardDescription>Current cash distribution across accounts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={liquidityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {liquidityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
