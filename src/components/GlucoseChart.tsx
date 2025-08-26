import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Simulated glucose data for demo
const generateGlucoseData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    // Simulate realistic glucose fluctuations (70-180 mg/dL range)
    const baseLevel = 95 + Math.sin(i * 0.3) * 20;
    const mealSpikes = i === 6 || i === 12 || i === 18 ? Math.random() * 40 : 0;
    const glucose = Math.max(70, Math.min(200, baseLevel + mealSpikes + (Math.random() - 0.5) * 10));
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
  const chartData = data || generateGlucoseData();
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

  return (
    <div className={`bg-card rounded-xl p-6 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Glucose Levels</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${glucoseStatus.bg}`} 
             style={{ color: glucoseStatus.color }}>
          {currentGlucose} mg/dL
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
      
      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <span>Target: 70-140 mg/dL</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default GlucoseChart;