
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from '@/components/ui/animated';
import { Database, Workflow, Shield, UserCircle2, PieChart, Wallet, BellRing, Settings, LineChart } from 'lucide-react';

const AppArchitectureDiagram = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">FinWise App Architecture</CardTitle>
        <CardDescription>System components and data flow</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[700px] p-4">
          {/* Core Architecture */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-100 mb-4"
            >
              <h3 className="text-sm font-medium text-blue-700 mb-1">Frontend (React + TypeScript)</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <ArchModule 
                  icon={<UserCircle2 size={14} />} 
                  title="Auth Module" 
                  color="purple" 
                />
                <ArchModule 
                  icon={<Wallet size={14} />} 
                  title="Transactions" 
                  color="green" 
                />
                <ArchModule 
                  icon={<PieChart size={14} />} 
                  title="Analytics" 
                  color="orange" 
                />
                <ArchModule 
                  icon={<LineChart size={14} />} 
                  title="Budget" 
                  color="pink" 
                />
                <ArchModule 
                  icon={<Settings size={14} />} 
                  title="Settings" 
                  color="gray" 
                />
              </div>
            </motion.div>
            
            <div className="h-8 w-0.5 bg-gray-200"></div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100 mb-4"
            >
              <h3 className="text-sm font-medium text-gray-700 mb-1">Data Layer</h3>
              <div className="flex gap-4">
                <div className="px-3 py-1 bg-blue-50 rounded text-xs text-blue-700 border border-blue-100">
                  <div className="flex items-center">
                    <Database size={12} className="mr-1" />
                    Local Storage
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-50 rounded text-xs text-green-700 border border-green-100">
                  <div className="flex items-center">
                    <Workflow size={12} className="mr-1" />
                    React Query
                  </div>
                </div>
                <div className="px-3 py-1 bg-purple-50 rounded text-xs text-purple-700 border border-purple-100">
                  <div className="flex items-center">
                    <Shield size={12} className="mr-1" />
                    Auth Context
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Data Flow Diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">Data Flow & Components</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <ModuleCard 
                  title="Authentication Module" 
                  icon={<Shield className="h-4 w-4 text-purple-500" />}
                  color="purple"
                >
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• User registration</li>
                    <li>• Login/logout</li>
                    <li>• Auth state management</li>
                    <li>• Session persistence</li>
                  </ul>
                </ModuleCard>
              </div>
              
              <div className="col-span-1">
                <ModuleCard 
                  title="Transaction Module" 
                  icon={<Wallet className="h-4 w-4 text-green-500" />}
                  color="green"
                >
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• UPI integration</li>
                    <li>• Transaction CRUD</li>
                    <li>• Filters & searching</li>
                    <li>• Transaction history</li>
                  </ul>
                </ModuleCard>
              </div>
              
              <div className="col-span-1">
                <ModuleCard 
                  title="Analytics Module" 
                  icon={<PieChart className="h-4 w-4 text-orange-500" />}
                  color="orange"
                >
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Spending insights</li>
                    <li>• Category breakdowns</li>
                    <li>• Trend analysis</li>
                    <li>• Data visualization</li>
                  </ul>
                </ModuleCard>
              </div>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper components
const ArchModule = ({ icon, title, color }: { icon: React.ReactNode, title: string, color: string }) => {
  const bgColor = {
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
    green: 'bg-green-50 border-green-100 text-green-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
    pink: 'bg-pink-50 border-pink-100 text-pink-700',
    gray: 'bg-gray-50 border-gray-100 text-gray-700',
  }[color] || 'bg-blue-50 border-blue-100 text-blue-700';
  
  return (
    <div className={`px-3 py-1 rounded text-xs border flex items-center ${bgColor}`}>
      {icon}
      <span className="ml-1">{title}</span>
    </div>
  );
};

const ModuleCard = ({ 
  title, 
  icon, 
  color, 
  children 
}: { 
  title: string, 
  icon: React.ReactNode, 
  color: string,
  children: React.ReactNode
}) => {
  const borderColor = {
    blue: 'border-blue-200',
    purple: 'border-purple-200',
    green: 'border-green-200',
    orange: 'border-orange-200',
    pink: 'border-pink-200',
    gray: 'border-gray-200',
  }[color] || 'border-blue-200';
  
  return (
    <div className={`p-3 border ${borderColor} rounded-lg bg-white shadow-sm`}>
      <div className="flex items-center mb-2">
        {icon}
        <h4 className="text-sm font-medium ml-1">{title}</h4>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default AppArchitectureDiagram;
