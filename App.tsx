import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/AddProject';
import ProjectDetail from './pages/ProjectDetail';
import { UserProject, VulnerabilityRecord, SecurityAlert } from './types';
import { MOCK_RSS_FEED, INITIAL_PROJECT_CONTENT_NODE } from './services/mockData';
import { analyzeVulnerability } from './services/geminiService';

const App: React.FC = () => {
  // Global State (Mocking a database)
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityRecord[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Initialize with a demo project on first load
  useEffect(() => {
    if (projects.length === 0) {
      const demoProject: UserProject = {
        id: 'proj-123',
        name: 'Legacy Node Backend',
        fileType: 'package.json',
        content: INITIAL_PROJECT_CONTENT_NODE,
        createdAt: new Date().toISOString(),
      };
      setProjects([demoProject]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddProject = (project: UserProject) => {
    setProjects(prev => [project, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setVulnerabilities(prev => prev.filter(v => v.projectId !== id));
  };

  // The Core Logic: Scanning a project against the Feed using Gemini
  const handleScanProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setIsScanning(true);
    
    // Clear old vulns for this project to avoid dupes in this demo
    setVulnerabilities(prev => prev.filter(v => v.projectId !== projectId));

    const newVulns: VulnerabilityRecord[] = [];

    // Simulate polling by iterating through our Mock RSS Feed
    for (const alert of MOCK_RSS_FEED) {
      try {
        const result = await analyzeVulnerability(alert, project.content, project.fileType);
        
        if (result.vulnerable) {
          newVulns.push({
            ...result,
            id: crypto.randomUUID(),
            projectId: project.id,
            alertId: alert.id,
            detectedAt: new Date().toISOString(),
            alert: alert
          });
        }
      } catch (e) {
        console.error("Error analyzing alert", alert.id, e);
      }
    }

    // Update state
    setVulnerabilities(prev => [...prev, ...newVulns]);
    
    // Update last scanned
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, lastScanned: new Date().toISOString() } : p
    ));

    setIsScanning(false);
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard projects={projects} vulnerabilities={vulnerabilities} />} />
          <Route path="/projects" element={<Navigate to="/" replace />} />
          <Route 
            path="/projects/new" 
            element={
              <AddProject 
                onAdd={handleAddProject} 
                onScan={handleScanProject} 
                isScanning={isScanning} 
              />
            } 
          />
          <Route 
            path="/projects/:id" 
            element={
              <ProjectDetail 
                projects={projects} 
                vulnerabilities={vulnerabilities}
                onScan={handleScanProject}
                onDelete={handleDeleteProject}
                isScanning={isScanning}
              />
            } 
          />
          <Route path="/alerts" element={<Dashboard projects={projects} vulnerabilities={vulnerabilities} />} />
          <Route path="/settings" element={<div className="text-center text-slate-500 py-20">Settings not implemented in demo.</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
