import { DocumentTemplate } from '../types/document';

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'blank',
    title: 'Blank Document',
    description: 'Start fresh with an empty page and standard formatting.',
    category: 'General',
    icon: 'FileText',
    content: `<p><br></p>`,
    columnSettings: { count: 1, gap: 15, showRule: false, applyTo: 'whole-document' },
  },
  {
    id: 'welcome',
    title: 'Welcome to DocMaster',
    description: 'Sample document showcasing columns, tables, formatting & Hindi text.',
    category: 'General',
    icon: 'Sparkles',
    content: `
      <h1 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">Welcome to DocMaster</h1>
      <p style="font-size: 16px; color: #475569;"><em>Your professional mobile-first document editor with multi-column layout.</em></p>
      
      <p>DocMaster provides desktop-class document authoring directly on your mobile device. You can create complex articles, academic notes, multi-column newsletters, and formal reports with ease.</p>
      
      <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <strong style="color: #1e3a8a;">💡 Multi-Column Feature:</strong>
        <p style="margin: 4px 0 0 0; color: #1e40af;">You can switch between 1, 2, 3, 4, or 5 columns at any time using the <strong>Columns</strong> button. The text flows dynamically between columns just like in desktop publishing software!</p>
      </div>

      <h2 style="color: #1e293b; margin-top: 24px;">Key Capabilities</h2>
      <ul>
        <li><strong>Multi-Column Layout:</strong> Flow text across 1 to 5 balanced columns with customizable spacing.</li>
        <li><strong>Rich Typography:</strong> Over 15 professional fonts including Devanagari Hindi font support.</li>
        <li><strong>Precision Formatting:</strong> Font sizes 1px to 100px, custom line spacing, highlighting, and alignment.</li>
        <li><strong>Interactive Tables:</strong> Insert grids up to 10x10, manage rows, columns, and cell styling.</li>
        <li><strong>Local Persistence:</strong> Automatic local saving ensures you never lose work on refresh.</li>
      </ul>

      <h2 style="color: #1e293b; margin-top: 24px;">Multi-Language & Hindi Support (हिंदी समर्थन)</h2>
      <p>DocMaster fully supports Unicode Hindi text seamlessly alongside English:</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; font-family: 'Noto Sans Devanagari', sans-serif;">
        <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 6px 0;">नमस्ते! डॉकमास्टर में आपका स्वागत है।</p>
        <p style="color: #334155; margin: 0;">बिहार बोर्ड, कक्षा 9, हिंदी माध्यम और सभी भारतीय भाषाओं के दस्तावेज़ यहाँ सरलता से तैयार करें।</p>
      </div>

      <h2 style="color: #1e293b; margin-top: 24px;">Sample Data Table</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
        <thead>
          <tr style="background-color: #1e40af; color: white;">
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Feature</th>
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Mobile Support</th>
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Multi-Columns (1–5)</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Full Touch Controls</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; color: #16a34a; font-weight: bold;">Active</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Export PDF & DOCX</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Instant Download & Print</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; color: #16a34a; font-weight: bold;">Active</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Offline Storage</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">IndexedDB / LocalStorage</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; color: #16a34a; font-weight: bold;">Active</td>
          </tr>
        </tbody>
      </table>
    `,
    columnSettings: { count: 2, gap: 18, showRule: true, applyTo: 'whole-document' },
  },
  {
    id: 'school_notes',
    title: 'School Notes',
    description: 'Structured layout for classroom lectures, key terms, and summaries.',
    category: 'Education',
    icon: 'GraduationCap',
    content: `
      <h1 style="color: #0f766e; border-bottom: 2px solid #14b8a6; padding-bottom: 6px;">Subject: Physics & Energy Conservation</h1>
      <p style="color: #64748b; font-size: 14px;"><strong>Date:</strong> October 2026 &nbsp;|&nbsp; <strong>Instructor:</strong> Prof. Sharma &nbsp;|&nbsp; <strong>Topic:</strong> Thermodynamics</p>
      
      <h2 style="color: #134e4a; margin-top: 20px;">1. Core Principles</h2>
      <p>The First Law of Thermodynamics states that energy cannot be created or destroyed in an isolated system; it can only change forms.</p>
      
      <ul>
        <li><strong>Internal Energy (U):</strong> Total microscopic kinetic and potential energy of molecules.</li>
        <li><strong>Heat Transfer (Q):</strong> Energy exchange driven by temperature gradient.</li>
        <li><strong>Work Done (W):</strong> Mechanical energy transfer across system boundaries.</li>
      </ul>

      <h2 style="color: #134e4a; margin-top: 20px;">2. Mathematical Formulation</h2>
      <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; padding: 12px; border-radius: 6px; font-family: 'Roboto Mono', monospace;">
        ΔU = Q - W
      </div>

      <h2 style="color: #134e4a; margin-top: 20px;">3. Key Takeaways & Exam Points</h2>
      <p>Remember that for an isothermal expansion of an ideal gas, ΔU = 0, which means all added heat equals the work performed by the system.</p>
    `,
    columnSettings: { count: 1, gap: 15, showRule: false, applyTo: 'whole-document' },
  },
  {
    id: 'assignment',
    title: 'Assignment',
    description: 'Homework assignment with student metadata and problem breakdown.',
    category: 'Education',
    icon: 'BookOpen',
    content: `
      <div style="border-bottom: 2px solid #475569; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="color: #1e293b; margin: 0 0 6px 0;">Assignment 03: Data Structures</h1>
        <p style="margin: 0; color: #64748b; font-size: 14px;">Course: CS201 &nbsp;|&nbsp; Student: Alex Mercer &nbsp;|&nbsp; Due Date: October 15, 2026</p>
      </div>

      <h2 style="color: #334155;">Problem 1: Binary Search Tree Balancing</h2>
      <p>Explain the difference between standard Binary Search Trees and self-balancing AVL trees. Discuss the worst-case lookup time complexities.</p>
      
      <h3 style="color: #475569;">Solution:</h3>
      <p>A standard BST can degenerate into a linked list with <em>O(n)</em> time complexity if elements are inserted in sorted order. AVL trees maintain balance through rotations, guaranteeing <em>O(log n)</em> search, insertion, and deletion times.</p>

      <h2 style="color: #334155; margin-top: 24px;">Problem 2: Complexity Comparison</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Algorithm</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Average Time</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">Worst Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Binary Search</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">O(log n)</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">O(log n)</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Quick Sort</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">O(n log n)</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">O(n²)</td>
          </tr>
        </tbody>
      </table>
    `,
    columnSettings: { count: 1, gap: 15, showRule: false, applyTo: 'whole-document' },
  },
  {
    id: 'letter',
    title: 'Formal Letter',
    description: 'Clean formal correspondence template with sender and recipient sections.',
    category: 'Business',
    icon: 'Mail',
    content: `
      <p style="margin: 0; line-height: 1.4;"><strong>Johnathan Doe</strong><br>124 Innovation Way<br>Tech City, TC 94016<br>j.doe@example.com</p>
      
      <p style="margin-top: 24px;">October 1, 2026</p>
      
      <p style="margin-top: 20px; line-height: 1.4;"><strong>Hiring Committee</strong><br>Acme Global Solutions Inc.<br>500 Enterprise Blvd<br>San Francisco, CA 94105</p>
      
      <p style="margin-top: 24px;">Dear Members of the Committee,</p>
      
      <p>I am writing to express my strong interest in the Senior Systems Engineer position at Acme Global Solutions. With over eight years of hands-on experience architecting scalable distributed software, I am excited about the opportunity to contribute to your core engineering objectives.</p>
      
      <p>Throughout my career, I have prioritized system reliability, clean architecture, and intuitive user experiences. I welcome the opportunity to discuss how my skill set aligns with your team's roadmap.</p>
      
      <p style="margin-top: 24px;">Sincerely,<br><br><strong>Johnathan Doe</strong></p>
    `,
    columnSettings: { count: 1, gap: 15, showRule: false, applyTo: 'whole-document' },
  },
  {
    id: 'resume',
    title: 'Modern Resume',
    description: 'Professional two-column resume highlighting qualifications and accomplishments.',
    category: 'Personal',
    icon: 'UserCheck',
    content: `
      <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 18px;">
        <h1 style="color: #0369a1; margin: 0 0 4px 0; font-size: 28px;">Sarah Jenkins</h1>
        <p style="color: #475569; margin: 0; font-size: 14px;">Senior Product Designer &amp; Mobile Architect &nbsp;|&nbsp; sarah.j@example.com &nbsp;|&nbsp; (555) 234-5678</p>
      </div>

      <h2 style="color: #0369a1; font-size: 18px; margin-top: 16px;">Professional Experience</h2>
      <p style="margin: 0;"><strong>Lead UI/UX Engineer</strong> – Nova Technologies (2022–Present)</p>
      <ul style="margin-top: 4px;">
        <li>Spearheaded redesign of flagship mobile workspace app, growing DAU by 44%.</li>
        <li>Implemented multi-column responsive document rendering for tablets and phones.</li>
      </ul>

      <p style="margin: 12px 0 0 0;"><strong>Product Designer</strong> – Helix Interactive (2019–2022)</p>
      <ul style="margin-top: 4px;">
        <li>Designed comprehensive design system utilized across 12 cross-platform products.</li>
        <li>Conducted user testing sessions with over 150 enterprise participants.</li>
      </ul>

      <h2 style="color: #0369a1; font-size: 18px; margin-top: 20px;">Skills &amp; Technologies</h2>
      <p><strong>Design:</strong> Mobile UI/UX, Design Systems, Typography, Wireframing, User Research</p>
      <p><strong>Technical:</strong> TypeScript, React, Tailwind CSS, Responsive Web Architecture, Mobile Viewports</p>

      <h2 style="color: #0369a1; font-size: 18px; margin-top: 20px;">Education</h2>
      <p style="margin: 0;"><strong>B.S. in Human-Computer Interaction</strong><br>University of California, Berkeley &nbsp;|&nbsp; 2015–2019</p>
    `,
    columnSettings: { count: 2, gap: 16, showRule: true, applyTo: 'whole-document' },
  },
  {
    id: 'report',
    title: 'Business Report',
    description: 'Executive project report with summary, multi-column analysis, and metrics table.',
    category: 'Business',
    icon: 'TrendingUp',
    content: `
      <h1 style="color: #1e3a8a; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Q3 Performance & Market Growth Report</h1>
      <p style="color: #64748b; font-size: 14px;">Prepared by: Strategic Analytics Group &nbsp;|&nbsp; Published: October 2026</p>
      
      <h2 style="color: #1e40af; margin-top: 20px;">Executive Summary</h2>
      <p>During the third quarter, key operational metrics exhibited strong expansion. Organic user acquisition rose by 32%, driven predominantly by the successful rollout of the mobile document collaboration suite.</p>
      
      <div style="background-color: #f1f5f9; padding: 12px; border-radius: 6px; margin: 16px 0;">
        <strong style="color: #0f172a;">Key Milestone:</strong> Cross-platform document rendering achieved 99.98% layout fidelity across Android and iOS viewports.
      </div>

      <h2 style="color: #1e40af; margin-top: 24px;">Quarterly Revenue Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #1e40af; color: white;">
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Segment</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Q2 Target</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Q3 Actual</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Variance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Enterprise Subscriptions</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$420,000</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$495,000</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; color: #16a34a;">+17.8%</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Professional Cloud Seats</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$180,000</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$212,000</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; color: #16a34a;">+17.7%</td>
          </tr>
        </tbody>
      </table>
    `,
    columnSettings: { count: 2, gap: 18, showRule: false, applyTo: 'whole-document' },
  },
];
