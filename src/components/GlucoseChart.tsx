import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertTriangle, Calendar as CalendarIcon, BarChart3, TrendingUp, Download, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

// Simulated glucose data for demo
const generateGlucoseData = (timeframe: 'weekly' | 'monthly' | 'yearly' = 'weekly') => {
  const now = new Date();
  const data = [];
  
  let dataPoints: number;
  let intervalHours: number;
  let formatTime: (date: Date) => string;
  
  switch (timeframe) {
    case 'weekly':
      dataPoints = 24; // 24 hours
      intervalHours = 1;
      formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      break;
    case 'monthly':
      dataPoints = 30; // 30 days
      intervalHours = 24;
      formatTime = (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      break;
    case 'yearly':
      dataPoints = 12; // 12 months
      intervalHours = 24 * 30; // Approximate month
      formatTime = (date) => date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      break;
    default:
      dataPoints = 24;
      intervalHours = 1;
      formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalHours * 60 * 60 * 1000);
    
    // Generate more realistic patterns based on timeframe
    let baseLevel: number;
    let variation: number;
    
    if (timeframe === 'weekly') {
      // Hourly data with meal spikes
      baseLevel = 95 + Math.sin(i * 0.3) * 20;
      const mealSpikes = i === 6 || i === 12 || i === 18 ? Math.random() * 40 : 0;
      variation = mealSpikes + (Math.random() - 0.5) * 10;
    } else if (timeframe === 'monthly') {
      // Daily averages with weekly patterns
      baseLevel = 100 + Math.sin(i * 0.2) * 15 + Math.cos(i * 0.1) * 10;
      variation = (Math.random() - 0.5) * 20;
    } else {
      // Monthly averages with seasonal trends
      baseLevel = 105 + Math.sin(i * 0.5) * 25;
      variation = (Math.random() - 0.5) * 15;
    }
    
    const glucose = Math.max(70, Math.min(200, baseLevel + variation));
    
    data.push({
      time: formatTime(time),
      glucose: Math.round(glucose),
      timestamp: time.getTime()
    });
  }
  
  return data;
};

interface GlucoseChartProps {
  data?: Array<{ time: string; glucose: number; timestamp: number }>;
  className?: string;
}

const GlucoseChart = ({ data, className = "" }: GlucoseChartProps) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const chartData = data || generateGlucoseData(timeframe);
  const currentGlucose = chartData[chartData.length - 1]?.glucose || 95;
  
  const getGlucoseStatus = (level: number) => {
    if (level < 70) return { status: 'low', color: 'hsl(var(--destructive))', bg: 'bg-destructive/10' };
    if (level > 180) return { status: 'high', color: 'hsl(var(--destructive))', bg: 'bg-destructive/10' };
    if (level > 140) return { status: 'elevated', color: 'hsl(var(--warning))', bg: 'bg-warning/10' };
    return { status: 'normal', color: 'hsl(var(--success))', bg: 'bg-success/10' };
  };
  
  const glucoseStatus = getGlucoseStatus(currentGlucose);
  const isDangerZone = currentGlucose < 70 || currentGlucose > 180;

  const getMealSuggestion = (level: number) => {
    if (level < 70) {
      return "Have 15g of fast-acting carbs (juice, glucose tablets, or 3-4 glucose gels).";
    }
    if (level > 180) {
      return "Consider a low-carb meal with protein and vegetables. Stay hydrated and consult your doctor.";
    }
    return "";
  };

  const timeframeOptions = [
    { value: 'weekly' as const, label: 'Weekly', icon: CalendarIcon },
    { value: 'monthly' as const, label: 'Monthly', icon: BarChart3 },
    { value: 'yearly' as const, label: 'Yearly', icon: TrendingUp },
  ];

  const handleExportData = () => {
    // Placeholder for export functionality
    const csvContent = [
      ['Time', 'Glucose (mg/dL)'],
      ...chartData.map(row => [row.time, row.glucose])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glucose-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    setCustomDateRange(range);
    if (range.from && range.to) {
      setShowDatePicker(false);
      // In a real app, you'd fetch data for this date range
      // For demo, we'll just close the picker
    }
  };

  const generateChartSummary = (data: Array<{glucose: number}>) => {
    const avg = Math.round(data.reduce((sum, d) => sum + d.glucose, 0) / data.length);
    const inRange = data.filter(d => d.glucose >= 70 && d.glucose <= 140).length;
    const percentInRange = Math.round((inRange / data.length) * 100);
    const peaks = data.filter(d => d.glucose > 140).length;
    const lows = data.filter(d => d.glucose < 70).length;
    
    if (lows > 0) {
      return `⚠️ ${lows} low reading${lows > 1 ? 's' : ''} detected. Review with your healthcare provider. Average glucose: ${avg} mg/dL.`;
    } else if (percentInRange >= 80) {
      return `🎉 Excellent control! ${percentInRange}% of readings in target range (70-140 mg/dL). Average: ${avg} mg/dL. Keep up the great work!`;
    } else if (peaks > data.length * 0.3) {
      return `📈 ${peaks} high reading${peaks > 1 ? 's' : ''} detected. Consider reviewing meal timing and portions. Average: ${avg} mg/dL.`;
    } else {
      return `${percentInRange}% in target range. Average: ${avg} mg/dL. You're making progress toward your goals!`;
    }
  };

  return (
    <div className={`bg-card rounded-xl p-6 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Glucose Levels</h3>
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
          
          {/* Date Range Picker */}
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <CalendarDays className="h-3 w-3" />
                {customDateRange.from && customDateRange.to
                  ? `${format(customDateRange.from, 'MMM dd')} - ${format(customDateRange.to, 'MMM dd')}`
                  : 'Custom Range'
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={customDateRange.from}
                selected={{ from: customDateRange.from, to: customDateRange.to }}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          {/* Timeframe Selector */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {timeframeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={timeframe === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe(option.value)}
                  className="text-xs h-7 px-3"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {option.label}
                </Button>
              );
            })}
          </div>
          
          {/* Current Glucose Badge */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${glucoseStatus.bg}`} 
               style={{ color: glucoseStatus.color }}>
            {currentGlucose} mg/dL
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            
            {/* Safe zone (70-140) - Green */}
            <ReferenceArea 
              y1={70} 
              y2={140} 
              fill="hsl(var(--success))" 
              fillOpacity={0.1}
            />
            
            {/* Elevated zone (140-180) - Amber */}
            <ReferenceArea 
              y1={140} 
              y2={180} 
              fill="hsl(var(--warning))" 
              fillOpacity={0.15}
            />
            
            {/* Danger zones - Red */}
            <ReferenceArea 
              y1={60} 
              y2={70} 
              fill="hsl(var(--destructive))" 
              fillOpacity={0.2}
            />
            <ReferenceArea 
              y1={180} 
              y2={200} 
              fill="hsl(var(--destructive))" 
              fillOpacity={0.2}
            />
            
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              domain={[60, 200]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
            <ReferenceLine y={140} stroke="hsl(var(--warning))" strokeDasharray="5 5" />
            <ReferenceLine y={180} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
            <Line 
              type="monotone" 
              dataKey="glucose" 
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {isDangerZone && (
        <Alert className="mt-4 border-destructive/50 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Your glucose level is in the danger zone. {getMealSuggestion(currentGlucose)}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Chart Summary */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trend Analysis
        </h4>
        <p className="text-sm text-muted-foreground">
          {generateChartSummary(chartData)}
        </p>
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <span>Target: 70-140 mg/dL</span>
        <span>
          {timeframe === 'weekly' && `Last updated: ${new Date().toLocaleTimeString()}`}
          {timeframe === 'monthly' && `Data from last 30 days`}
          {timeframe === 'yearly' && `Data from last 12 months`}
        </span>
      </div>
    </div>
  );
};

export default GlucoseChart;