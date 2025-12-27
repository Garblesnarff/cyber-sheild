export enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum Confidence {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface UserProject {
  id: string;
  name: string;
  fileType: 'package.json' | 'requirements.txt' | 'pom.xml' | 'go.mod';
  content: string;
  createdAt: string;
  lastScanned?: string;
}

export interface SecurityAlert {
  id: string;
  source: string;
  title: string;
  date: string;
  cveId?: string;
  description: string;
  link: string;
  severity: Severity;
}

export interface VulnerabilityResult {
  vulnerable: boolean;
  confidence: Confidence;
  package_name: string | null;
  current_version: string | null;
  patched_version: string | null;
  severity: Severity | null;
  reason: string;
}

export interface VulnerabilityRecord extends VulnerabilityResult {
  id: string;
  projectId: string;
  alertId: string;
  detectedAt: string;
  alert: SecurityAlert; // Embedded for easier UI rendering
}
