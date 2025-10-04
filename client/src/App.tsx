import React, { useState } from 'react';
import { Route, Switch, Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from '@/components/Dashboard';
import { ExportControlAssessment } from '@/components/ExportControlAssessment';
import { GenericAssessment } from '@/components/GenericAssessment';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const frameworks = [
    { id: 'dashboard', name: 'Dashboard', component: Dashboard },
    { id: 'nist', name: 'NIST AI-RMF', component: () => <GenericAssessment frameworkName="NIST AI-RMF" /> },
    { id: 'eu-ai-act', name: 'EU AI Act', component: () => <GenericAssessment frameworkName="EU AI Act" /> },
    { id: 'gdpr', name: 'GDPR', component: () => <GenericAssessment frameworkName="GDPR" /> },
    { id: 'iso-42001', name: 'ISO/IEC 42001', component: () => <GenericAssessment frameworkName="ISO/IEC 42001" /> },
    { id: 'soc2', name: 'SOC 2', component: () => <GenericAssessment frameworkName="SOC 2" /> },
    { id: 'singapore', name: 'Singapore', component: () => <GenericAssessment frameworkName="Singapore Model AI Governance" /> },
    { id: 'export-control', name: 'Export Control ⭐', component: ExportControlAssessment },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">ConformityXAI</h1>
                <p className="text-xs text-gray-500">AI Compliance Assessment Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {frameworks.map(fw => (
                <Button
                  key={fw.id}
                  variant={activeTab === fw.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(fw.id)}
                >
                  {fw.name}
                </Button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {frameworks.map(fw => (
                <Button
                  key={fw.id}
                  variant={activeTab === fw.id ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(fw.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  {fw.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="hidden">
            {frameworks.map(fw => (
              <TabsTrigger key={fw.id} value={fw.id}>
                {fw.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {frameworks.map(fw => (
            <TabsContent key={fw.id} value={fw.id}>
              <fw.component />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">ConformityXAI</h3>
              <p className="text-sm text-gray-600">
                Comprehensive AI compliance assessment platform supporting 12+ regulatory frameworks
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Frameworks</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>NIST AI Risk Management Framework</li>
                <li>EU Artificial Intelligence Act</li>
                <li>Export Control Compliance</li>
                <li>GDPR, SOC 2, ISO/IEC 42001</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Proprietary Algorithms</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Automated Export Liability Index™</li>
                <li>Statutory Civic Penalty Exposure™</li>
                <li>Criminal Liability Probability</li>
                <li className="text-xs italic">by Rohan Sharma, ZenoLabs.AI</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2024 ConformityXAI. All rights reserved. Product Version 1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
