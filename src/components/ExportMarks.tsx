import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart } from './BarChart';

// Sample structure for marks data. In a real app this would come from your backend.
const SAMPLE_STUDENTS = [
  { id: 's1', name: 'Amit', marks: { Math: 78, English: 85, Science: 72 } },
  { id: 's2', name: 'Neha', marks: { Math: 92, English: 88, Science: 95 } },
  { id: 's3', name: 'Ravi', marks: { Math: 65, English: 70, Science: 60 } },
  { id: 's4', name: 'Priya', marks: { Math: 81, English: 79, Science: 84 } },
];

export function ExportMarks() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('tuition_students_marks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SAMPLE_STUDENTS;
  });
  const [subject, setSubject] = useState('Math');

  useEffect(() => {
    // persist sample data so teacher can edit later (basic)
    localStorage.setItem('tuition_students_marks', JSON.stringify(students));
  }, [students]);

  const labels = useMemo(() => students.map((s) => s.name), [students]);
  const values = useMemo(() => students.map((s) => s.marks[subject] ?? 0), [students, subject]);

  function exportCSV() {
    const header = ['Student', subject];
    const rows = students.map((s) => [s.name, s.marks[subject] ?? '']);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks_${subject}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Create an image of the SVG chart and download it
  async function downloadChartAsPng() {
    const svg = document.querySelector('#performance-chart svg') as SVGSVGElement | null;
    if (!svg) return alert('Chart not rendered yet');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const bbox = svg.getBBox();
    canvas.width = Math.max(600, Math.ceil(bbox.width));
    canvas.height = Math.max(360, Math.ceil(bbox.height));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    await new Promise<void>((res) => {
      img.onload = () => res();
      img.onerror = () => res();
      img.src = url;
    });
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `performance_${subject}.png`;
    a.click();
  }

  function shareResults() {
    // Try to share via Web Share API with CSV attached as data url
    if (navigator.canShare && navigator.canShare()) {
      // navigator.share is better for text/URL only; file sharing is complex.
      navigator.share({ title: `Marks - ${subject}`, text: 'Student performance report.' }).catch((e) => console.warn(e));
    } else {
      alert('Sharing is limited in this environment. Download CSV or PNG to share.');
    }
  }

  function showLeaderboard() {
    const ranked = [...students].sort((a, b) => (b.marks[subject] || 0) - (a.marks[subject] || 0));
    const rows = ranked.map((s, i) => `${i + 1}. ${s.name} — ${s.marks[subject] ?? 'N/A'}`).join('\n');
    alert('Leaderboard:\n' + rows);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option>Math</option>
          <option>English</option>
          <option>Science</option>
        </select>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={downloadChartAsPng}>Download Chart PNG</button>
        <button onClick={shareResults}>Share</button>
        <button onClick={showLeaderboard}>Show Leaderboard</button>
      </div>

      <div id="performance-chart" style={{ marginTop: 12 }}>
        <BarChart labels={labels} values={values} />
      </div>

      <div style={{ marginTop: 16 }}>
        <h4>Students</h4>
        <table>
          <thead>
            <tr><th>Name</th><th>{subject}</th></tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}><td>{s.name}</td><td>{s.marks[subject]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
