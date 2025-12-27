import React from 'react';
import { Link } from 'react-router-dom';
import { UserProject, VulnerabilityRecord, Severity } from '../types';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { Shield, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

interface DashboardProps {
  projects: UserProject[];
  vulnerabilities: VulnerabilityRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects, vulnerabilities }) => {
  const criticalCount = vulnerabilities.filter(v => v.severity === Severity.CRITICAL).length;
  const highCount = vulnerabilities.filter(v => v.severity === Severity.HIGH).length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Monitored Projects</p>
              <p className="text-3xl font-bold text-white mt-1">{projects.length}</p>
            </div>
            <div className="bg-blue-600/20 p-3 rounded-lg text-blue-400">
              <FileText size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Vulnerabilities</p>
              <p className="text-3xl font-bold text-white mt-1">{vulnerabilities.length}</p>
            </div>
            <div className="bg-red-600/20 p-3 rounded-lg text-red-400">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Security Score</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">
                {projects.length === 0 ? '-' : Math.max(0, 100 - (criticalCount * 20) - (highCount * 10))}%
              </p>
            </div>
            <div className="bg-emerald-600/20 p-3 rounded-lg text-emerald-400">
              <Shield size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Projects">
          {projects.length === 0 ? (
             <div className="text-center py-8 text-slate-500">
               No projects yet.
             </div>
          ) : (
            <div className="space-y-4">
              {projects.map(project => (
                <Link key={project.id} to={`/projects/${project.id}`} className="block group">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-transparent group-hover:border-blue-500/50 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-800 rounded text-slate-400">
                        {project.fileType === 'package.json' ? 'JS' : 'PY'}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-200">{project.name}</h4>
                        <p className="text-xs text-slate-500">{project.fileType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {project.lastScanned ? (
                        <span className="text-xs text-slate-500">
                          Scanned: {new Date(project.lastScanned).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-500">Not Scanned</span>
                      )}
                      <ArrowRight size={16} className="text-slate-600 group-hover:text-blue-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card title="Recent Alerts">
          {vulnerabilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Shield size={48} className="mb-4 opacity-20" />
              <p>No vulnerabilities detected. Good job!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vulnerabilities.slice(0, 5).map(vuln => (
                <div key={vuln.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-200 text-sm line-clamp-1">{vuln.alert.title}</h4>
                    <Badge severity={vuln.severity} />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    Affected: <span className="text-slate-300 font-mono">{vuln.package_name} {vuln.current_version}</span>
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">{vuln.reason}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
