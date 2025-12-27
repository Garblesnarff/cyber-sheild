import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProject } from '../types';
import Card from '../components/Card';
import { Loader2, Upload, FileCode } from 'lucide-react';
import { INITIAL_PROJECT_CONTENT_NODE, INITIAL_PROJECT_CONTENT_PYTHON } from '../services/mockData';

interface AddProjectProps {
  onAdd: (project: UserProject) => void;
  onScan: (id: string) => Promise<void>;
  isScanning: boolean;
}

const AddProject: React.FC<AddProjectProps> = ({ onAdd, onScan, isScanning }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [fileType, setFileType] = useState<'package.json' | 'requirements.txt'>('package.json');
  const [content, setContent] = useState('');

  const handlePreFill = () => {
    if (fileType === 'package.json') {
      setContent(INITIAL_PROJECT_CONTENT_NODE);
    } else {
      setContent(INITIAL_PROJECT_CONTENT_PYTHON);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = crypto.randomUUID();
    const newProject: UserProject = {
      id: newId,
      name: name || 'Untitled Project',
      fileType,
      content,
      createdAt: new Date().toISOString()
    };

    onAdd(newProject);
    
    // Automatically trigger a scan
    await onScan(newId);
    
    navigate(`/projects/${newId}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Add New Project</h2>
        <p className="text-slate-400 mt-1">Paste your dependency file to start monitoring for vulnerabilities.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frontend Dashboard"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">File Type</label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="package.json">package.json (Node.js)</option>
              <option value="requirements.txt">requirements.txt (Python)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Dependency File Content
              </label>
              <button
                type="button"
                onClick={handlePreFill}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Paste Example
              </button>
            </div>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={fileType === 'package.json' ? '{\n  "dependencies": {\n    ...\n  }\n}' : 'flask==2.0.0\n...'}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
             <button
              type="submit"
              disabled={isScanning || !content}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isScanning || !content
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {isScanning ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Scanning with Gemini...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Save & Scan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProject;
