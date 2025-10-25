import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Navbar from '@/components/Navbar';

const generateComparisonData = (period: string) => {
  const dataPoints = period === 'week' ? 7 : 30;
  const currentPeriod = [];
  const previousPeriod = [];

  for (let i = 0; i < dataPoints; i++) {
    const label = period === 'week' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i] : `Day ${i + 1}`;
    const currentAvg = 95 + Math.sin(i * 0.5) * 15 + (Math.random() - 0.5) * 10;
    const previousAvg = 98 + Math.sin(i * 0.5) * 18 + (Math.random() - 0.5) * 12;

    currentPeriod.push({
      label,
      current: Math.round(currentAvg),
      previous: Math.round(previousAvg),
    });
  }

  return currentPeriod;
};

const Trends = () => {
  const navigate = useNavigate();
  const [comparisonPeriod, setComparisonPeriod] = useState('week');
  const chartData = generateComparisonData(comparisonPeriod);

  // Calculate metrics
  const currentAvg = Math.round(chartData.reduce((sum, d) => sum + d.current, 0) / chartData.length);
  const previousAvg = Math.round(chartData.reduce((sum, d) => sum + d.previous, 0) / chartData.length);
  const avgChange = currentAvg - previousAvg;
  
  const currentInRange = chartData.filter(d => d.current >= 70 && d.current <= 140).length;
  const previousInRange = chartData.filter(d => d.previous >= 70 && d.previous <= 140).length;
  const inRangeChange = ((currentInRange / chartData.length) * 100) - ((previousInRange / chartData.length) * 100);

  const currentSpikes = chartData.filter(d => d.current > 140).length;
  const previousSpikes = chartData.filter(d => d.previous > 140).length;
  const spikeChange = ((currentSpikes - previousSpikes) / (previousSpikes || 1)) * 100;

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangeColor = (change: number, inverse = false) => {
    if (inverse) {
      if (change < 0) return 'text-success';
      if (change > 0) return 'text-destructive';
    } else {
      if (change > 0) return 'text-success';
      if (change < 0) return 'text-destructive';
    }
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Comparative Trends</h1>
            <p className="text-muted-foreground">Compare your glucose patterns over time</p>
          </div>
        </div>

        {/* Period Selector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Comparison Period</CardTitle>
              <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week vs Last Week</SelectItem>
                  <SelectItem value="month">This Month vs Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[60, 200]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name={comparisonPeriod === 'week' ? 'This Week' : 'This Month'}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="previous"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={comparisonPeriod === 'week' ? 'Last Week' : 'Last Month'}
                    dot={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Statistical Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Average Glucose</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{currentAvg} mg/dL</span>
                  <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(avgChange, true)}`}>
                    {getChangeIcon(-avgChange)}
                    {Math.abs(avgChange)} mg/dL
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Previous: {previousAvg} mg/dL
                </div>
                {avgChange < 0 && (
                  <p className="text-xs text-success mt-2">
                    Great! Your average glucose has decreased.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Time in Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {Math.round((currentInRange / chartData.length) * 100)}%
                  </span>
                  <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(inRangeChange)}`}>
                    {getChangeIcon(inRangeChange)}
                    {Math.abs(Math.round(inRangeChange))}%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Previous: {Math.round((previousInRange / chartData.length) * 100)}%
                </div>
                {inRangeChange > 0 && (
                  <p className="text-xs text-success mt-2">
                    Excellent! You're spending more time in the healthy range.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Glucose Spikes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{currentSpikes} spikes</span>
                  <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(spikeChange, true)}`}>
                    {getChangeIcon(-spikeChange)}
                    {Math.abs(Math.round(spikeChange))}%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Previous: {previousSpikes} spikes
                </div>
                {spikeChange < 0 && (
                  <p className="text-xs text-success mt-2">
                    Wonderful! You've reduced glucose spikes.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {avgChange < 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Your average glucose has improved by {Math.abs(avgChange)} mg/dL - keep up the great work!</span>
                </li>
              )}
              {inRangeChange > 5 && (
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>You've increased time in the healthy range by {Math.round(inRangeChange)}% - excellent progress!</span>
                </li>
              )}
              {spikeChange < -20 && (
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Glucose spikes have decreased significantly - your meal choices are working well.</span>
                </li>
              )}
              {avgChange >= 0 && inRangeChange <= 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-warning">•</span>
                  <span>Consider reviewing your meal patterns and activity levels with your healthcare provider.</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Trends;
