import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, TrendingUp, Clock, Calendar } from 'lucide-react';

// Mock transaction data
const mockTransactions = [
  { date: '2025-10-20', mealName: 'Mediterranean Salmon Bowl', amount: 12.50, status: 'Completed' },
  { date: '2025-10-19', mealName: 'Asian Chicken Stir-Fry', amount: 8.75, status: 'Completed' },
  { date: '2025-10-18', mealName: 'Greek Yogurt Parfait', amount: 6.25, status: 'Completed' },
  { date: '2025-10-17', mealName: 'Quinoa Buddha Bowl', amount: 11.00, status: 'Completed' },
  { date: '2025-10-16', mealName: 'Mediterranean Salmon Bowl', amount: 12.50, status: 'Completed' },
  { date: '2025-10-15', mealName: 'Low-Carb Pizza', amount: 15.00, status: 'Pending' },
  { date: '2025-10-14', mealName: 'Asian Chicken Stir-Fry', amount: 8.75, status: 'Completed' },
];

const Earnings = () => {
  const { earnings } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="text-muted-foreground mt-2">
          Track your earnings from meal creations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.pending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Processing next week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.thisMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              October 2025
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Last Payout
          </CardTitle>
          <CardDescription>
            Your last payout was processed on {earnings.lastPayoutDate}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Earnings are calculated based on meal usage by patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Meal Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.mealName}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={
                      transaction.status === 'Completed' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-yellow-600 dark:text-yellow-400'
                    }>
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
