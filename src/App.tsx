import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Subsidiaries from './pages/Subsidiaries'
import BankAccounts from './pages/BankAccounts'
import DebtInstruments from './pages/DebtInstruments'
import Dashboard from './pages/Dashboard'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="subsidiaries" element={<Subsidiaries />} />
                    <Route path="bank-accounts" element={<BankAccounts />} />
                    <Route path="debt-instruments" element={<DebtInstruments />} />
                    <Route path="reports" element={<div className="p-6">Reports Placeholder</div>} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
