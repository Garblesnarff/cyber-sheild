import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserProject, VulnerabilityRecord } from '../types';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { Loader2, RefreshCw, Trash2, CheckCircle2, ExternalLink } from 'lucide-react';

interface ProjectDetailProps {
  projects: UserProject[];
  vulnerabilities: VulnerabilityRecord[];
  onScan: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  isScanning: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, vulnerabilities, onScan, onDelete, isScanning }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return <div className="text-center py-20 text-slate-500">Project not found</div>;
  }

  const projectVulns = vulnerabilities.filter(v => v.projectId === project.id);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{project.name}</h2>
          <p className="text-slate-400 text-sm mt-1">
            File: <span className="font-mono text-slate-300">{project.fileType}</span> • 
            Last Scanned: {project.lastScanned ? new Date(project.lastScanned).toLocaleString() : 'Never'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => onScan(project.id)}
            disabled={isScanning}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            {isScanning ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            <span>Re-scan</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors border border-red-900/30"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-medium text-white flex items-center space-x-2">
            <span>Vulnerability Report</span>
            {projectVulns.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{projectVulns.length}</span>
            )}
          </h3>

          {projectVulns.length === 0 ? (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <div className="flex flex-col items-center justify-center py-12 text-emerald-400">
                <CheckCircle2 size={48} className="mb-4" />
                <h4 className="text-lg font-medium">All Clear!</h4>
                <p className="text-sm opacity-80 mt-1">No known vulnerabilities found in your dependencies.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {projectVulns.map(vuln => (
                <Card key={vuln.id} className="border-l-4 border-l-red-500 relative">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1">
                       <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-bold text-lg text-slate-100">{vuln.alert.title}</h4>
                          <Badge severity={vuln.severity} />
                       </div>
                       
                       <p className="text-sm text-slate-400 mb-4">{vuln.alert.description}</p>

                       <div className="bg-slate-950 rounded p-3 mb-4 text-sm">
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <span className="block text-xs text-slate-500">Package Found</span>
                             <span className="font-mono text-slate-300">{vuln.package_name}</span>
                           </div>
                           <div>
                             <span className="block text-xs text-slate-500">Current Version</span>
                             <span className="font-mono text-red-300">{vuln.current_version}</span>
                           </div>
                         </div>
                       </div>

                       <div className="flex items-center space-x-2 text-sm">
                         <span className="text-slate-500">Gemini Analysis:</span>
                         <span className="text-slate-300 italic">{vuln.reason}</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 min-w-[140px]">
                      <a 
                        href={vuln.alert.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>View Source</span>
                      </a>
                      <div className="text-xs text-center text-slate-500 mt-2">
                        Confidence: <span className={
                          vuln.confidence === 'high' ? 'text-emerald-400' : 'text-amber-400'
                        }>{vuln.confidence.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Raw Dependency File">
             <div className="bg-slate-950 p-4 rounded-lg overflow-x-auto">
               <pre className="text-xs font-mono text-slate-400 whitespace-pre-wrap">{project.content}</pre>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
