import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Search } from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data?.reports) setReports(data.reports);
      })
      .catch((err) => console.warn('Could not fetch reports API:', err));
  }, []);

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="card-panel glow-blue" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Generated Operations & Control Reports</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Auto-detected verification, calibration, and optimization artifacts</div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px 12px 6px 32px',
              fontSize: '0.8rem',
              color: '#ffffff',
              outline: 'none',
              width: '220px'
            }}
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {filteredReports.map((rep, idx) => (
          <div key={idx} className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`badge ${rep.format === 'HTML' ? 'badge-blue' : 'badge-purple'}`}>{rep.format}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{(rep.size_bytes / 1024).toFixed(1)} KB</span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{rep.title}</h4>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Modified: {rep.modified}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
              <button
                onClick={() => setPreviewFile(rep.filename)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '6px', padding: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <Eye size={14} /> Preview
              </button>

              <a
                href={`/api/reports/download/${rep.filename}`}
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#38bdf8', borderRadius: '6px', padding: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}
              >
                <Download size={14} /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Inline Report Preview Modal */}
      {previewFile && (
        <div className="modal-overlay" onClick={() => setPreviewFile(null)}>
          <div className="modal-content" style={{ maxWidth: '1000px', height: '80vh' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1.1rem' }}>Preview: {previewFile}</h3>
              <button onClick={() => setPreviewFile(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Close</button>
            </div>
            <iframe
              src={`/api/reports/download/${previewFile}`}
              title="Report Preview"
              style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff', borderRadius: '8px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
