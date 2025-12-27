import { SecurityAlert, Severity } from '../types';

// Simulating RSS Feed Items
export const MOCK_RSS_FEED: SecurityAlert[] = [
  {
    id: 'alert-001',
    source: 'CVEFeed.io',
    title: 'Axios SSRF Vulnerability',
    date: new Date().toISOString(),
    cveId: 'CVE-2024-1234',
    description: 'A server-side request forgery (SSRF) vulnerability exists in Axios versions prior to 1.6.0 where the library does not properly filter URLs.',
    link: 'https://cvefeed.io/vuln/cve-2024-1234',
    severity: Severity.HIGH,
  },
  {
    id: 'alert-002',
    source: 'GitHub Advisory',
    title: 'Lodash Prototype Pollution',
    date: new Date(Date.now() - 86400000).toISOString(),
    cveId: 'CVE-2023-9999',
    description: 'Lodash versions prior to 4.17.21 are vulnerable to prototype pollution via the template function.',
    link: 'https://github.com/advisories/GHSA-35jh-r3h4-6jhm',
    severity: Severity.CRITICAL,
  },
  {
    id: 'alert-003',
    source: 'CISA KEV',
    title: 'Log4j Remote Code Execution',
    date: new Date(Date.now() - 172800000).toISOString(),
    cveId: 'CVE-2021-44228',
    description: 'Apache Log4j2 2.0-beta9 through 2.15.0 (excluding security releases 2.12.2, 2.12.3, and 2.3.1) JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints.',
    link: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    severity: Severity.CRITICAL,
  },
  {
    id: 'alert-004',
    source: 'PyPI Advisory',
    title: 'Requests library exposure of sensitive headers',
    date: new Date(Date.now() - 200000000).toISOString(),
    cveId: 'CVE-2023-32681',
    description: 'Requests 2.31.0 and earlier can leak the Proxy-Authorization header to the destination server when redirecting to a same-site HTTPS endpoint.',
    link: 'https://pypi.org/project/requests/',
    severity: Severity.MEDIUM,
  }
];

export const INITIAL_PROJECT_CONTENT_NODE = `{
  "name": "legacy-app",
  "version": "1.0.0",
  "dependencies": {
    "axios": "0.21.1",
    "react": "16.8.0",
    "lodash": "4.17.15",
    "express": "4.17.1"
  }
}`;

export const INITIAL_PROJECT_CONTENT_PYTHON = `
flask==2.0.1
requests==2.25.1
numpy>=1.19.0
pandas==1.2.4
`;
