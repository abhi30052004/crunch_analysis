import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProbabilityChart({ data }) {
  // data format: [{ name: 'Horse 1', market: 10.5, ai: 24.5 }, ...]
  
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
          <XAxis type="number" stroke="#A1A1AA" tick={{ fill: '#A1A1AA' }} />
          <YAxis dataKey="name" type="category" stroke="#A1A1AA" tick={{ fill: '#F5F5F5', fontSize: 12 }} width={100} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          />
          <Bar dataKey="market" name="Market %" fill="#71717A" radius={[0, 4, 4, 0]} />
          <Bar dataKey="ai" name="AI %" fill="#00FF9D" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
