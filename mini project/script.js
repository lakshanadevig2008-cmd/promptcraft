/**
 * ============================================================================
 * PROMPTCRAFT – AI PROMPT BUILDER
 * Core Frontend Application Logic
 *
 * Architecture:
 * 1. Application State & Storage
 * 2. Pre-Configured Templates Library (12 Templates)
 * 3. Navigation & Single Page Application (SPA) Routing
 * 4. Rule-Based Prompt Generator Engine
 * 5. Prompt History & LocalStorage CRUD Management
 * 6. Heuristic Prompt Quality Checker & Auto-Improvement Engine
 * 7. Modal System & Clipboard Helpers
 * 8. Toast Notification System
 * 9. Initialization & Event Bindings
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. APPLICATION STATE & STORAGE CONFIGURATION
     -------------------------------------------------------------------------- */
  const STORAGE_KEY = 'promptcraft_saved_prompts_v1';

  const AppState = {
    currentView: 'home',
    activeTemplateCategory: 'all',
    activeHistoryCategory: 'all',
    currentGeneratedPrompt: null,
    currentQualityAnalysis: null,
    pendingDeleteId: null,
    isClearAllPending: false,
    savedPrompts: []
  };

  /* --------------------------------------------------------------------------
     2. PRE-CONFIGURED PROMPT TEMPLATES (12 CURATED TEMPLATES)
     -------------------------------------------------------------------------- */
  const TEMPLATES_DATA = [
    {
      id: 'tpl-java-oop',
      title: 'Java Programming',
      category: 'Coding',
      icon: 'code',
      description: 'Master Object-Oriented Programming in Java with complete code examples, design principles, and exception handling.',
      role: 'Senior Java Software Architect & CS Professor',
      task: 'Explain Object-Oriented Programming (OOP) concepts—Encapsulation, Inheritance, Polymorphism, and Abstraction—using clean, compilable Java 17+ code examples. Include best practices, common pitfalls, and memory management tips.',
      context: 'Preparing for university lab examinations and technical placement interviews.',
      language: 'English',
      tone: 'Professional',
      detailLevel: 'Detailed',
      audienceLevel: 'Intermediate',
      outputFormat: 'Step-by-Step',
      tags: ['Java', 'OOP', 'Clean Code', 'Lab Exam']
    },
    {
      id: 'tpl-python-script',
      title: 'Python Programming',
      category: 'Coding',
      icon: 'code',
      description: 'Write robust Python data processing scripts featuring error handling, pandas operations, and clean docstrings.',
      role: 'Senior Python Engineer & Data Specialist',
      task: 'Write a complete Python script to load, inspect, clean, and analyze a CSV dataset using Pandas. Include try-except error handling, type annotations, and a function to calculate statistical summaries.',
      context: 'College mini-project data analytics module.',
      language: 'English',
      tone: 'Professional',
      detailLevel: 'Detailed',
      audienceLevel: 'Beginner',
      outputFormat: 'Step-by-Step',
      tags: ['Python', 'Pandas', 'Script', 'Data Analysis']
    },
    {
      id: 'tpl-assignment-writing',
      title: 'Assignment Writing',
      category: 'Education',
      icon: 'book',
      description: 'Generate high-scoring college assignment outlines, conceptual explanations, and structured academic arguments.',
      role: 'University Academic Professor & Research Advisor',
      task: 'Draft a comprehensive academic assignment on "Cloud Computing Architectures and Security Challenges". Cover IaaS, PaaS, SaaS, virtualization security, and real-world enterprise adoption examples.',
      context: 'Second-year undergraduate computer science assignment submission.',
      language: 'English',
      tone: 'Formal',
      detailLevel: 'Detailed',
      audienceLevel: 'Intermediate',
      outputFormat: 'Bullet Points',
      tags: ['Academic', 'Cloud Computing', 'Research', 'College']
    },
    {
      id: 'tpl-seminar-presentation',
      title: 'Seminar Presentation',
      category: 'Education',
      icon: 'presentation',
      description: 'Create engaging slide-by-slide seminar outlines with speaker notes for 15-minute technical symposium talks.',
      role: 'Technical Keynote Speaker & Seminar Coach',
      task: 'Design a 10-slide seminar presentation outline on "Generative AI in Modern Healthcare: Opportunities, Clinical Applications, and Ethical Concerns". Include slide titles, bullet points, and speaker talking notes for each slide.',
      context: 'Department technical seminar presentation.',
      language: 'English',
      tone: 'Creative',
      detailLevel: 'Detailed',
      audienceLevel: 'Intermediate',
      outputFormat: 'Step-by-Step',
      tags: ['Seminar', 'Slide Deck', 'AI Ethics', 'Public Speaking']
    },
    {
      id: 'tpl-resume-prep',
      title: 'Resume Preparation',
      category: 'Business',
      icon: 'briefcase',
      description: 'Craft high-impact resume experience bullets using the Google XYZ formula tailored for campus placements.',
      role: 'Senior Tech Recruiter & Career Consultant',
      task: 'Transform and optimize software development project descriptions into high-impact resume bullet points using the Google XYZ framework ("Accomplished [X], as measured by [Y], by doing [Z]"). Highlight full-stack web development and database optimization.',
      context: 'Applying for campus recruitment drives and junior software engineer internships.',
      language: 'English',
      tone: 'Professional',
      detailLevel: 'Medium',
      audienceLevel: 'Beginner',
      outputFormat: 'Bullet Points',
      tags: ['Resume', 'Career', 'XYZ Formula', 'Placements']
    },
    {
      id: 'tpl-interview-prep',
      title: 'Interview Preparation',
      category: 'Business',
      icon: 'users',
      description: 'Simulate realistic technical interview rounds covering Data Structures, REST APIs, and System Design basics.',
      role: 'Technical Hiring Manager at a Tier-1 Tech Company',
      task: 'Conduct a simulated technical interview for an entry-level Full-Stack Developer position. Present 5 progressive technical questions covering Data Structures, RESTful APIs, and SQL indexing, along with evaluation criteria for ideal responses.',
      context: 'Preparing for upcoming campus placement technical interview rounds.',
      language: 'English',
      tone: 'Professional',
      detailLevel: 'Detailed',
      audienceLevel: 'Intermediate',
      outputFormat: 'Step-by-Step',
      tags: ['Mock Interview', 'Technical Round', 'DSA', 'SQL']
    },
    {
      id: 'tpl-email-writing',
      title: 'Email Writing',
      category: 'Writing',
      icon: 'mail',
      description: 'Draft polite, professional emails to professors or team leads requesting extensions, feedback, or meetings.',
      role: 'Executive Communications Specialist',
      task: 'Draft a respectful, clear, and professional email to a college professor requesting a 3-day extension on a mini-project submission deadline due to genuine technical integration hurdles. Include a proposed revised submission timeline.',
      context: 'Academic communication with university course instructor.',
      language: 'English',
      tone: 'Formal',
      detailLevel: 'Short',
      audienceLevel: 'Advanced',
      outputFormat: 'Paragraph',
      tags: ['Email', 'Formal', 'Extension', 'Academic']
    },
    {
      id: 'tpl-project-doc',
      title: 'Project Documentation',
      category: 'Coding',
      icon: 'file-text',
      description: 'Generate standardized project documentation including system architecture, database schema, and API specs.',
      role: 'Lead Systems Architect & Technical Writer',
      task: 'Generate a comprehensive Software Project Documentation outline for a web-based student management system. Include Executive Summary, Architecture Overview, Entity-Relationship (ER) Schema description, Key API endpoints, and Local Deployment steps.',
      context: 'Final semester college mini-project documentation report.',
      language: 'English',
      tone: 'Professional',
      detailLevel: 'Detailed',
      audienceLevel: 'Intermediate',
      outputFormat: 'Step-by-Step',
      tags: ['Documentation', 'System Design', 'Schema', 'Mini-Project']
    },
    {
      id: 'tpl-english-learning',
      title: 'English Learning',
      category: 'Education',
      icon: 'globe',
      description: 'Expand your professional vocabulary, idioms, and conversational fluency for placement interviews and discussions.',
      role: 'Cambridge ESL Language & Communication Coach',
      task: 'Provide 10 advanced vocabulary words and idiomatic expressions frequently used in tech corporate environments and group discussions. For each, give phonetic pronunciation guidance, simple definition, and a practical workplace conversation example.',
      context: 'Preparing for campus placement Group Discussions (GD) and HR rounds.',
      language: 'English',
      tone: 'Simple',
      detailLevel: 'Medium',
      audienceLevel: 'Beginner',
      outputFormat: 'Table',
      tags: ['Vocabulary', 'Communication', 'Group Discussion', 'Fluency']
    },
    {
      id: 'tpl-exam-prep',
      title: 'Exam Preparation',
      category: 'Education',
      icon: 'check-square',
      description: 'Create high-yield revision summaries and practice multiple-choice questions for semester exams.',
      role: 'Engineering Professor & Exam Paper Evaluator',
      task: 'Create a high-yield exam revision guide on Database Management Systems (DBMS) Normalization (1NF, 2NF, 3NF, BCNF). Include definitions, anomalous conditions eliminated by each form, and 5 short practice questions with solutions.',
      context: 'Semester university exam preparation.',
      language: 'English',
      tone: 'Professional',
      detailLevel: 'Detailed',
      audienceLevel: 'Intermediate',
      outputFormat: 'Step-by-Step',
      tags: ['DBMS', 'Normalization', 'Exam Prep', 'Questions']
    },
    {
      id: 'tpl-creative-writing',
      title: 'Creative Writing',
      category: 'Writing',
      icon: 'feather',
      description: 'Develop rich worldbuilding, character dialogue, and captivating story hooks for creative essays and scripts.',
      role: 'Published Sci-Fi Novelist & Creative Writing Mentor',
      task: 'Write an atmospheric and suspenseful opening chapter for a speculative fiction story set in 2085, where an autonomous municipal AI system suddenly begins making decisions that deviate from its core programming.',
      context: 'College creative writing magazine submission.',
      language: 'English',
      tone: 'Creative',
      detailLevel: 'Detailed',
      audienceLevel: 'Intermediate',
      outputFormat: 'Paragraph',
      tags: ['Sci-Fi', 'Storytelling', 'Creative Writing', 'Worldbuilding']
    },
    {
      id: 'tpl-business-plan',
      title: 'Business Planning',
      category: 'Business',
      icon: 'trending-up',
      description: 'Formulate Lean Business Model Canvases and startup pitch decks for student entrepreneurship competitions.',
      role: 'Startup Incubator Mentor & Venture Capital Analyst',
      task: 'Construct a Lean Business Model Canvas for an AI-powered student study productivity SaaS application. Detail the Problem, Solution, Unique Value Proposition, Customer Segments, Cost Structure, and Revenue Streams.',
      context: 'College Innovation Cell annual student startup competition.',
      language: 'English',
      tone: 'Professional',
      detailLevel: 'Detailed',
      audienceLevel: 'Intermediate',
      outputFormat: 'Table',
      tags: ['Startup', 'Lean Canvas', 'Business Plan', 'Pitch']
    }
  ];

  /* Initial Seed Data for first-time visits */
  const INITIAL_SEED_PROMPTS = [
    {
      id: 'prompt-seed-1',
      title: 'Java Polymorphism Deep-Dive',
      category: 'Coding',
      promptText: `[ROLE & PERSONA]
Act as a Senior Java Software Architect & CS Professor.

[PRIMARY TASK]
Explain Compile-time vs Runtime Polymorphism in Java with clear code snippets showing method overloading and overriding. Include practical memory explanations of dynamic method dispatch.

[CONTEXT & BACKGROUND]
College computer science lab exam and technical placement interview revision.

[TARGET AUDIENCE]
Target audience level: Intermediate (Practitioner).

[TONE & DETAIL]
Tone: Professional. Detail Level: Detailed & In-Depth.

[OUTPUT FORMAT & STRUCTURE]
Format output as: Step-by-Step Guide.
Ensure explanations are accompanied by concise, compilable Java code snippets with explanatory comments.

[LANGUAGE]
Output Language: English.

[CONSTRAINTS & RULES]
- Avoid outdated Java practices; use modern Java 17+ conventions.
- Provide real-world analogies alongside technical explanations.
- Explicitly highlight common developer pitfalls.`,
      createdAt: '2026-10-10T10:30:00.000Z',
      wordCount: 118,
      parameters: {
        category: 'Coding',
        language: 'English',
        tone: 'Professional',
        detailLevel: 'Detailed',
        audienceLevel: 'Intermediate',
        outputFormat: 'Step-by-Step'
      }
    },
    {
      id: 'prompt-seed-2',
      title: 'Academic Cloud Computing Review',
      category: 'Education',
      promptText: `[ROLE & PERSONA]
Act as a University Academic Professor & Research Advisor.

[PRIMARY TASK]
Summarize key security and compliance challenges in Multi-Cloud architectures, detailing mitigation strategies such as Zero Trust and end-to-end encryption.

[CONTEXT & BACKGROUND]
Undergraduate Information Technology assignment review.

[TARGET AUDIENCE]
Target audience level: Intermediate.

[TONE & DETAIL]
Tone: Formal & Academic. Detail Level: Medium & Balanced.

[OUTPUT FORMAT & STRUCTURE]
Format output as: Bullet Points.

[LANGUAGE]
Output Language: English.

[CONSTRAINTS & RULES]
- Keep explanations clear, well-referenced, and objective.
- Avoid promotional vendor language.`,
      createdAt: '2026-10-11T14:15:00.000Z',
      wordCount: 88,
      parameters: {
        category: 'Education',
        language: 'English',
        tone: 'Formal',
        detailLevel: 'Medium',
        audienceLevel: 'Intermediate',
        outputFormat: 'Bullet Points'
      }
    }
  ];

  /* --------------------------------------------------------------------------
     3. DOM ELEMENTS CACHE
     -------------------------------------------------------------------------- */
  const DOM = {};

  function cacheDOMElements() {
    // Navigation & Views
    DOM.siteHeader = document.getElementById('site-header');
    DOM.brandLogo = document.getElementById('brand-logo-link');
    DOM.mainNav = document.getElementById('main-nav');
    DOM.navButtons = document.querySelectorAll('[data-view]');
    DOM.appViews = document.querySelectorAll('.app-view');
    DOM.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    DOM.mobileDrawer = document.getElementById('mobile-drawer');
    DOM.savedCounterBadge = document.getElementById('saved-counter-badge');
    DOM.mobileSavedCounter = document.getElementById('mobile-saved-counter');
    DOM.headerQuickCreateBtn = document.getElementById('header-quick-create-btn');

    // Homepage Elements
    DOM.heroStartBtn = document.getElementById('hero-start-btn');
    DOM.heroTemplatesBtn = document.getElementById('hero-templates-btn');
    DOM.ctaLaunchBtn = document.getElementById('cta-launch-btn');

    // Prompt Generator Elements
    DOM.generatorForm = document.getElementById('generator-form');
    DOM.taskInput = document.getElementById('task-input');
    DOM.taskCharCount = document.getElementById('task-char-count');
    DOM.taskErrorMsg = document.getElementById('task-error-msg');
    DOM.categorySelect = document.getElementById('category-select');
    DOM.languageSelect = document.getElementById('language-select');
    DOM.toneSelect = document.getElementById('tone-select');
    DOM.detailSelect = document.getElementById('detail-select');
    DOM.audienceSelect = document.getElementById('audience-select');
    DOM.formatSelect = document.getElementById('format-select');
    DOM.roleInput = document.getElementById('role-input');
    DOM.contextInput = document.getElementById('context-input');
    DOM.btnLoadSample = document.getElementById('btn-load-sample');
    DOM.btnResetGenerator = document.getElementById('btn-reset-generator');
    DOM.generatorResultCard = document.getElementById('generator-result-card');
    DOM.resultStatusIndicator = document.getElementById('result-status-indicator');
    DOM.resultParameterBadges = document.getElementById('result-parameter-badges');
    DOM.resultPlaceholder = document.getElementById('result-placeholder');
    DOM.resultBody = document.getElementById('result-body');
    DOM.generatedPromptText = document.getElementById('generated-prompt-text');
    DOM.btnCopyPrompt = document.getElementById('btn-copy-prompt');
    DOM.copyBtnLabel = document.getElementById('copy-btn-label');
    DOM.btnSavePrompt = document.getElementById('btn-save-prompt');
    DOM.btnCheckThisPrompt = document.getElementById('btn-check-this-prompt');
    DOM.btnRegeneratePrompt = document.getElementById('btn-regenerate-prompt');
    DOM.btnClearResult = document.getElementById('btn-clear-result');
    DOM.topicChips = document.querySelectorAll('.chip-btn');

    // Templates Elements
    DOM.templatesGridContainer = document.getElementById('templates-grid-container');
    DOM.templateSearchInput = document.getElementById('template-search-input');
    DOM.templateSearchClear = document.getElementById('template-search-clear');
    DOM.templateCategoryPills = document.getElementById('template-category-pills');
    DOM.templatesEmptyState = document.getElementById('templates-empty-state');
    DOM.templatesCountBadge = document.getElementById('templates-count-badge');
    DOM.btnResetTemplateFilters = document.getElementById('btn-reset-template-filters');

    // History (My Prompts) Elements
    DOM.historyGridContainer = document.getElementById('history-grid-container');
    DOM.historySearchInput = document.getElementById('history-search-input');
    DOM.historyCategoryPills = document.getElementById('history-category-pills');
    DOM.historyEmptyState = document.getElementById('history-empty-state');
    DOM.btnHistoryGoCreate = document.getElementById('btn-history-go-create');
    DOM.btnExportPrompts = document.getElementById('btn-export-prompts');
    DOM.btnClearAllHistory = document.getElementById('btn-clear-all-history');

    // Quality Checker Elements
    DOM.checkerTextarea = document.getElementById('checker-textarea');
    DOM.checkerCharCount = document.getElementById('checker-char-count');
    DOM.checkerErrorMsg = document.getElementById('checker-error-msg');
    DOM.btnRunQualityCheck = document.getElementById('btn-run-quality-check');
    DOM.btnClearChecker = document.getElementById('btn-clear-checker');
    DOM.btnCheckerSampleWeak = document.getElementById('btn-checker-sample-weak');
    DOM.btnCheckerSampleStrong = document.getElementById('btn-checker-sample-strong');
    DOM.checkerStatusBadge = document.getElementById('checker-status-badge');
    DOM.scoreCircle = document.getElementById('score-circle');
    DOM.scoreNumberDisplay = document.getElementById('score-number-display');
    DOM.scoreGradeTitle = document.getElementById('score-grade-title');
    DOM.scoreVerdictDesc = document.getElementById('score-verdict-desc');
    DOM.scoreBarFill = document.getElementById('score-bar-fill');
    DOM.checklistItems = document.getElementById('checker-checklist-items');
    DOM.suggestionsList = document.getElementById('suggestions-list');
    DOM.btnAutoImprove = document.getElementById('btn-auto-improve');
    DOM.improvedPromptSection = document.getElementById('improved-prompt-section');
    DOM.improvedPromptText = document.getElementById('improved-prompt-text');
    DOM.btnCopyImproved = document.getElementById('btn-copy-improved');
    DOM.btnLoadImprovedToGenerator = document.getElementById('btn-load-improved-to-generator');

    // Criteria Elements in Checker
    DOM.critElements = {
      task: document.getElementById('crit-task'),
      role: document.getElementById('crit-role'),
      context: document.getElementById('crit-context'),
      audience: document.getElementById('crit-audience'),
      format: document.getElementById('crit-format'),
      constraints: document.getElementById('crit-constraints')
    };

    // Modals
    DOM.modalViewPrompt = document.getElementById('modal-view-prompt');
    DOM.modalViewCategory = document.getElementById('modal-view-category');
    DOM.modalViewTitle = document.getElementById('modal-view-title');
    DOM.modalViewDate = document.getElementById('modal-view-date');
    DOM.modalViewContent = document.getElementById('modal-view-content');
    DOM.modalBtnCopyView = document.getElementById('modal-btn-copy-view');
    DOM.modalBtnSendToChecker = document.getElementById('modal-btn-send-to-checker');

    DOM.modalEditPrompt = document.getElementById('modal-edit-prompt');
    DOM.editPromptId = document.getElementById('edit-prompt-id');
    DOM.editPromptTitle = document.getElementById('edit-prompt-title');
    DOM.editPromptCategory = document.getElementById('edit-prompt-category');
    DOM.editPromptText = document.getElementById('edit-prompt-text');
    DOM.btnSaveEditedPrompt = document.getElementById('btn-save-edited-prompt');

    DOM.modalConfirmDialog = document.getElementById('modal-confirm-dialog');
    DOM.modalConfirmTitle = document.getElementById('modal-confirm-title');
    DOM.modalConfirmMessage = document.getElementById('modal-confirm-message');
    DOM.btnConfirmProceed = document.getElementById('btn-confirm-proceed');
    DOM.btnConfirmCancel = document.getElementById('btn-confirm-cancel');

    DOM.modalSavePromptName = document.getElementById('modal-save-prompt-name');
    DOM.saveTitleInput = document.getElementById('save-title-input');
    DOM.saveTitleError = document.getElementById('save-title-error');
    DOM.btnConfirmSavePrompt = document.getElementById('btn-confirm-save-prompt');

    DOM.toastContainer = document.getElementById('toast-container');
  }

  /* --------------------------------------------------------------------------
     4. STORAGE UTILITIES & REPOSITORY
     -------------------------------------------------------------------------- */
  function loadSavedPromptsFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        AppState.savedPrompts = JSON.parse(data);
      } else {
        // First visit: initialize with curated seeds
        AppState.savedPrompts = [...INITIAL_SEED_PROMPTS];
        savePromptsToStorage();
      }
    } catch (err) {
      console.warn('LocalStorage unavailable or restricted. Operating in session memory.', err);
      AppState.savedPrompts = [...INITIAL_SEED_PROMPTS];
    }
    updateHistoryCounterBadges();
  }

  function savePromptsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState.savedPrompts));
    } catch (err) {
      console.error('Could not save prompts to localStorage:', err);
      showToast('Storage Error', 'Could not save to browser storage. Your browser storage might be full.', 'danger');
    }
    updateHistoryCounterBadges();
  }

  function updateHistoryCounterBadges() {
    const count = AppState.savedPrompts.length;
    if (DOM.savedCounterBadge) DOM.savedCounterBadge.textContent = count;
    if (DOM.mobileSavedCounter) DOM.mobileSavedCounter.textContent = count;
  }

  /* --------------------------------------------------------------------------
     5. SPA NAVIGATION & ROUTING
     -------------------------------------------------------------------------- */
  function switchView(targetViewId, scrollUp = true) {
    if (!targetViewId) return;

    // Normalize
    const viewName = targetViewId.replace('view-', '');
    AppState.currentView = viewName;

    // Toggle active view sections
    DOM.appViews.forEach(view => {
      const isTarget = view.id === `view-${viewName}`;
      if (isTarget) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Update nav links active states
    document.querySelectorAll('[data-view]').forEach(btn => {
      const viewAttr = btn.getAttribute('data-view');
      if (viewAttr === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    closeMobileDrawer();

    // Scroll to top of page/view smoothly
    if (scrollUp) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Refresh view-specific rendering if needed
    if (viewName === 'templates') {
      renderTemplates();
    } else if (viewName === 'history') {
      renderHistoryList();
    }
  }

  function toggleMobileDrawer() {
    const isOpen = DOM.mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  }

  function openMobileDrawer() {
    DOM.mobileDrawer.classList.add('open');
    DOM.mobileMenuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileDrawer() {
    DOM.mobileDrawer.classList.remove('open');
    DOM.mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }

  /* --------------------------------------------------------------------------
     6. RULE-BASED PROMPT GENERATOR LOGIC
     -------------------------------------------------------------------------- */
  /**
   * Constructs a structured prompt from provided parameters using
   * deterministic prompt-engineering templates.
   */
  function buildStructuredPrompt(params) {
    const {
      task,
      category,
      language,
      tone,
      detailLevel,
      audienceLevel,
      role,
      context,
      outputFormat
    } = params;

    // Dynamic role fallback based on category
    let effectiveRole = (role && role.trim().length > 0) ? role.trim() : getDefaultRoleForCategory(category);

    const sections = [];

    // 1. Role Section
    sections.push(`[ROLE & PERSONA]\nAct as a ${effectiveRole}.`);

    // 2. Primary Task
    sections.push(`[PRIMARY TASK & OBJECTIVE]\n${task.trim()}`);

    // 3. Background Context (if provided)
    if (context && context.trim().length > 0) {
      sections.push(`[BACKGROUND CONTEXT & DOMAIN]\n${context.trim()}`);
    }

    // 4. Target Audience
    const audienceDescriptions = {
      'Beginner': 'Beginner (Novice / Student) — Use accessible explanations, relatable analogies, and avoid unearned jargon.',
      'Intermediate': 'Intermediate (Practitioner) — Assume standard foundational knowledge; focus on practical execution and clean patterns.',
      'Advanced': 'Advanced (Senior / Expert) — Provide rigorous, in-depth architectural reasoning, trade-off comparisons, and edge-case handling.'
    };
    const audienceDesc = audienceDescriptions[audienceLevel] || audienceLevel;
    sections.push(`[TARGET AUDIENCE]\n${audienceDesc}`);

    // 5. Tone & Detail Level
    sections.push(`[TONE & DETAIL SPECIFICATION]\n- Tone: ${tone}\n- Detail Level: ${detailLevel}`);

    // 6. Output Formatting Constraints
    const formatGuidelines = {
      'Paragraph': 'Provide cohesive, fluent, and well-written paragraphs with bold key phrases.',
      'Bullet Points': 'Format as clean, concise bullet points highlighting key concepts, action items, or syntax notes.',
      'Step-by-Step': 'Structure as a numbered, sequential step-by-step walkthrough with clear instructions and milestones.',
      'Table': 'Present information in a clear Markdown table with descriptive headers and well-aligned rows.'
    };
    const formatRule = formatGuidelines[outputFormat] || `Format output as ${outputFormat}.`;
    sections.push(`[OUTPUT FORMAT & STRUCTURE]\n${formatRule}`);

    // 7. Language Instructions
    if (language === 'Tamil') {
      sections.push(`[LANGUAGE SPECIFICATION]\nRespond entirely in clear, grammatically sound, and professional Tamil (தமிழ்). Translate technical terms appropriately while keeping standard English keywords in parentheses where needed for technical clarity.`);
    } else {
      sections.push(`[LANGUAGE]\nOutput Language: English.`);
    }

    // 8. Quality Guardrails & Constraints
    sections.push(`[CONSTRAINTS & GUARDRAILS]\n- Do not produce vague generalizations or filler text; focus strictly on high-value, actionable insights.\n- Verify all code, syntax, and factual claims for strict accuracy.\n- Include concrete examples or practical use-cases to ground the explanation.`);

    return sections.join('\n\n');
  }

  function getDefaultRoleForCategory(category) {
    switch (category) {
      case 'Coding':
        return 'Senior Software Architect and Full-Stack Developer';
      case 'Education':
        return 'Experienced University Academic Professor and Subject Matter Mentor';
      case 'Writing':
        return 'Professional Content Editor and Communications Strategist';
      case 'Business':
        return 'Strategic Business Consultant and Product Manager';
      case 'Marketing':
        return 'Senior Digital Marketing Strategist and Brand Copywriter';
      case 'General':
      default:
        return 'Expert Subject Matter Specialist and Knowledge Synthesizer';
    }
  }

  function handlePromptGeneration(e) {
    if (e) e.preventDefault();

    const taskVal = DOM.taskInput.value.trim();

    // Validation
    if (!taskVal) {
      DOM.taskInput.parentElement.classList.add('has-error');
      DOM.taskErrorMsg.style.display = 'block';
      DOM.taskInput.focus();
      showToast('Validation Error', 'Please describe your task before generating a prompt.', 'warning');
      return;
    } else {
      DOM.taskInput.parentElement.classList.remove('has-error');
      DOM.taskErrorMsg.style.display = 'none';
    }

    const params = {
      task: taskVal,
      category: DOM.categorySelect.value,
      language: DOM.languageSelect.value,
      tone: DOM.toneSelect.value,
      detailLevel: DOM.detailSelect.value,
      audienceLevel: DOM.audienceSelect.value,
      role: DOM.roleInput.value.trim(),
      context: DOM.contextInput.value.trim(),
      outputFormat: DOM.formatSelect.value
    };

    const structuredPrompt = buildStructuredPrompt(params);

    AppState.currentGeneratedPrompt = {
      promptText: structuredPrompt,
      params: params,
      generatedAt: new Date().toISOString()
    };

    displayGeneratedResult(structuredPrompt, params);
    showToast('Prompt Generated', 'Your engineered prompt is ready to copy or save!', 'success');
  }

  function displayGeneratedResult(promptText, params) {
    // Show active body, hide placeholder
    DOM.resultPlaceholder.classList.add('hidden');
    DOM.resultBody.classList.remove('hidden');

    DOM.generatedPromptText.textContent = promptText;

    // Status indicator
    DOM.resultStatusIndicator.textContent = 'Engineered';
    DOM.resultStatusIndicator.className = 'status-indicator active';

    // Populate parameter badges
    DOM.resultParameterBadges.innerHTML = `
      <span class="result-tag-pill">${escapeHTML(params.category)}</span>
      <span class="result-tag-pill">${escapeHTML(params.language)}</span>
      <span class="result-tag-pill">${escapeHTML(params.tone)}</span>
      <span class="result-tag-pill">${escapeHTML(params.outputFormat)}</span>
    `;

    // Smooth scroll into view on mobile
    if (window.innerWidth < 1080) {
      DOM.generatorResultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function clearGeneratorResult() {
    AppState.currentGeneratedPrompt = null;
    DOM.generatedPromptText.textContent = '';
    DOM.resultParameterBadges.innerHTML = '';
    DOM.resultBody.classList.add('hidden');
    DOM.resultPlaceholder.classList.remove('hidden');
    DOM.resultStatusIndicator.textContent = 'Ready';
    DOM.resultStatusIndicator.className = 'status-indicator ready';
    showToast('Cleared', 'Generated prompt output cleared.', 'info');
  }

  function resetGeneratorForm() {
    DOM.generatorForm.reset();
    DOM.taskCharCount.textContent = '0 characters';
    DOM.taskInput.parentElement.classList.remove('has-error');
    DOM.taskErrorMsg.style.display = 'none';
    clearGeneratorResult();
  }

  function loadSampleTask() {
    DOM.taskInput.value = 'Explain how Database Normalization works from 1NF to 3NF, providing an unnormalized university student-course table and step-by-step decomposed schemas with SQL CREATE TABLE statements.';
    DOM.categorySelect.value = 'Coding';
    DOM.languageSelect.value = 'English';
    DOM.toneSelect.value = 'Professional';
    DOM.detailSelect.value = 'Detailed';
    DOM.audienceSelect.value = 'Intermediate';
    DOM.formatSelect.value = 'Step-by-Step';
    DOM.roleInput.value = 'Senior Database Architect & Relational Theory Specialist';
    DOM.contextInput.value = 'College computer science DBMS lab course exam revision.';
    updateTaskCharCount();
    showToast('Sample Loaded', 'DBMS normalization task loaded into generator.', 'info');
  }

  function updateTaskCharCount() {
    const len = DOM.taskInput.value.length;
    DOM.taskCharCount.textContent = `${len} character${len === 1 ? '' : 's'}`;
  }

  /* --------------------------------------------------------------------------
     7. TEMPLATE LIBRARY LOGIC
     -------------------------------------------------------------------------- */
  function renderTemplates() {
    const container = DOM.templatesGridContainer;
    if (!container) return;

    const searchTerm = DOM.templateSearchInput.value.toLowerCase().trim();
    const activeCategory = AppState.activeTemplateCategory;

    const filtered = TEMPLATES_DATA.filter(tpl => {
      const matchCategory = (activeCategory === 'all' || tpl.category.toLowerCase() === activeCategory.toLowerCase());
      const matchSearch = (
        !searchTerm ||
        tpl.title.toLowerCase().includes(searchTerm) ||
        tpl.description.toLowerCase().includes(searchTerm) ||
        tpl.category.toLowerCase().includes(searchTerm) ||
        tpl.tags.some(t => t.toLowerCase().includes(searchTerm))
      );
      return matchCategory && matchSearch;
    });

    if (DOM.templatesCountBadge) {
      DOM.templatesCountBadge.textContent = `${filtered.length} Template${filtered.length === 1 ? '' : 's'} Available`;
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      DOM.templatesEmptyState.classList.remove('hidden');
      return;
    }

    DOM.templatesEmptyState.classList.add('hidden');

    const html = filtered.map(tpl => {
      const catClass = `cat-${tpl.category.toLowerCase()}`;
      const tagsHtml = tpl.tags.map(tag => `<span class="meta-chip">${escapeHTML(tag)}</span>`).join('');

      return `
        <article class="template-card" data-template-id="${tpl.id}">
          <div class="template-card-header">
            <span class="template-card-category ${catClass}">${escapeHTML(tpl.category)}</span>
            <div class="template-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
          </div>
          <h3 class="template-card-title">${escapeHTML(tpl.title)}</h3>
          <p class="template-card-desc">${escapeHTML(tpl.description)}</p>
          <div class="template-card-meta">
            ${tagsHtml}
          </div>
          <div class="template-card-footer">
            <button type="button" class="btn btn-primary btn-sm w-100 btn-use-template" data-template-id="${tpl.id}">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Use Template
            </button>
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = html;
  }

  function applyTemplateToGenerator(templateId) {
    const template = TEMPLATES_DATA.find(t => t.id === templateId);
    if (!template) return;

    // Switch view to generator
    switchView('generator', true);

    // Populate all fields
    DOM.taskInput.value = template.task;
    DOM.categorySelect.value = template.category;
    DOM.languageSelect.value = template.language || 'English';
    DOM.toneSelect.value = template.tone || 'Professional';
    DOM.detailSelect.value = template.detailLevel || 'Detailed';
    DOM.audienceSelect.value = template.audienceLevel || 'Intermediate';
    DOM.formatSelect.value = template.outputFormat || 'Step-by-Step';
    DOM.roleInput.value = template.role || '';
    DOM.contextInput.value = template.context || '';

    updateTaskCharCount();
    DOM.taskInput.parentElement.classList.remove('has-error');
    DOM.taskErrorMsg.style.display = 'none';

    // Auto-generate prompt for instant gratification
    handlePromptGeneration();

    showToast('Template Loaded', `Loaded "${template.title}" template into the builder!`, 'success');
  }

  /* --------------------------------------------------------------------------
     8. MY PROMPTS (LOCALSTORAGE HISTORY CRUD)
     -------------------------------------------------------------------------- */
  function renderHistoryList() {
    const container = DOM.historyGridContainer;
    if (!container) return;

    const searchTerm = DOM.historySearchInput ? DOM.historySearchInput.value.toLowerCase().trim() : '';
    const activeCategory = AppState.activeHistoryCategory;

    const filtered = AppState.savedPrompts.filter(item => {
      const matchCategory = (activeCategory === 'all' || (item.category && item.category.toLowerCase() === activeCategory.toLowerCase()));
      const matchSearch = (
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm) ||
        item.promptText.toLowerCase().includes(searchTerm)
      );
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '';
      DOM.historyEmptyState.classList.remove('hidden');
      return;
    }

    DOM.historyEmptyState.classList.add('hidden');

    const html = filtered.map(item => {
      const dateStr = formatDate(item.createdAt);
      const catClass = `cat-${(item.category || 'general').toLowerCase()}`;
      const previewText = escapeHTML(item.promptText.substring(0, 220)) + (item.promptText.length > 220 ? '...' : '');

      return `
        <article class="history-card" data-prompt-id="${item.id}">
          <div class="history-card-header">
            <div>
              <span class="template-card-category ${catClass}">${escapeHTML(item.category || 'General')}</span>
              <h3 class="history-card-title">${escapeHTML(item.title)}</h3>
              <span class="history-date">${dateStr}</span>
            </div>
          </div>
          <div class="history-card-preview" title="Click to view full prompt">${previewText}</div>
          <div class="history-card-footer">
            <button type="button" class="btn btn-outline btn-sm btn-view-history" data-prompt-id="${item.id}">
              View
            </button>
            <div class="history-card-actions">
              <button type="button" class="btn btn-ghost btn-sm btn-copy-history" data-prompt-id="${item.id}" title="Copy Prompt">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <button type="button" class="btn btn-ghost btn-sm btn-edit-history" data-prompt-id="${item.id}" title="Edit Prompt">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button type="button" class="btn btn-ghost btn-sm text-danger btn-delete-history" data-prompt-id="${item.id}" title="Delete Prompt">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = html;
  }

  function openSavePromptModal() {
    let textToSave = '';
    let category = 'General';

    if (AppState.currentGeneratedPrompt) {
      textToSave = AppState.currentGeneratedPrompt.promptText;
      category = AppState.currentGeneratedPrompt.params.category;
    } else {
      textToSave = DOM.generatedPromptText.textContent.trim();
    }

    if (!textToSave) {
      showToast('No Prompt to Save', 'Generate a prompt first before saving.', 'warning');
      return;
    }

    // Propose default title based on task input or first words
    const defaultTitle = DOM.taskInput.value.trim().substring(0, 35) || `${category} AI Prompt`;
    DOM.saveTitleInput.value = defaultTitle;
    DOM.saveTitleError.style.display = 'none';

    openModal(DOM.modalSavePromptName);
    DOM.saveTitleInput.focus();
  }

  function confirmSavePrompt() {
    const titleVal = DOM.saveTitleInput.value.trim();
    if (!titleVal) {
      DOM.saveTitleError.style.display = 'block';
      DOM.saveTitleInput.focus();
      return;
    }

    let textToSave = '';
    let category = 'General';
    let params = {};

    if (AppState.currentGeneratedPrompt) {
      textToSave = AppState.currentGeneratedPrompt.promptText;
      category = AppState.currentGeneratedPrompt.params.category;
      params = AppState.currentGeneratedPrompt.params;
    } else {
      textToSave = DOM.generatedPromptText.textContent.trim();
      category = DOM.categorySelect.value;
    }

    const newPrompt = {
      id: 'prompt-' + Date.now(),
      title: titleVal,
      category: category,
      promptText: textToSave,
      createdAt: new Date().toISOString(),
      wordCount: textToSave.split(/\s+/).length,
      parameters: params
    };

    AppState.savedPrompts.unshift(newPrompt);
    savePromptsToStorage();
    closeModal(DOM.modalSavePromptName);

    showToast('Saved to My Prompts', `"${titleVal}" was saved successfully!`, 'success');
  }

  function openViewPromptModal(promptId) {
    const item = AppState.savedPrompts.find(p => p.id === promptId);
    if (!item) return;

    DOM.modalViewCategory.textContent = item.category || 'General';
    DOM.modalViewCategory.className = `modal-badge cat-${(item.category || 'general').toLowerCase()}`;
    DOM.modalViewTitle.textContent = item.title;
    DOM.modalViewDate.textContent = `Created on ${formatDate(item.createdAt)}`;
    DOM.modalViewContent.textContent = item.promptText;

    // Attach current item ID to modal action buttons
    DOM.modalBtnCopyView.setAttribute('data-prompt-id', item.id);
    DOM.modalBtnSendToChecker.setAttribute('data-prompt-id', item.id);

    openModal(DOM.modalViewPrompt);
  }

  function openEditPromptModal(promptId) {
    const item = AppState.savedPrompts.find(p => p.id === promptId);
    if (!item) return;

    DOM.editPromptId.value = item.id;
    DOM.editPromptTitle.value = item.title;
    DOM.editPromptCategory.value = item.category || 'General';
    DOM.editPromptText.value = item.promptText;

    openModal(DOM.modalEditPrompt);
    DOM.editPromptTitle.focus();
  }

  function saveEditedPrompt() {
    const id = DOM.editPromptId.value;
    const title = DOM.editPromptTitle.value.trim();
    const category = DOM.editPromptCategory.value;
    const text = DOM.editPromptText.value.trim();

    if (!title || !text) {
      showToast('Validation Error', 'Title and prompt text cannot be empty.', 'warning');
      return;
    }

    const index = AppState.savedPrompts.findIndex(p => p.id === id);
    if (index !== -1) {
      AppState.savedPrompts[index].title = title;
      AppState.savedPrompts[index].category = category;
      AppState.savedPrompts[index].promptText = text;
      AppState.savedPrompts[index].wordCount = text.split(/\s+/).length;

      savePromptsToStorage();
      renderHistoryList();
      closeModal(DOM.modalEditPrompt);
      showToast('Prompt Updated', 'Changes were saved successfully.', 'success');
    }
  }

  function promptDeleteConfirmation(promptId) {
    const item = AppState.savedPrompts.find(p => p.id === promptId);
    if (!item) return;

    AppState.pendingDeleteId = promptId;
    AppState.isClearAllPending = false;

    DOM.modalConfirmTitle.textContent = 'Delete Saved Prompt?';
    DOM.modalConfirmMessage.textContent = `Are you sure you want to permanently delete "${item.title}"? This action cannot be undone.`;
    DOM.btnConfirmProceed.textContent = 'Delete Prompt';
    DOM.btnConfirmProceed.className = 'btn btn-danger';

    openModal(DOM.modalConfirmDialog);
  }

  function promptClearAllConfirmation() {
    if (AppState.savedPrompts.length === 0) {
      showToast('History is Empty', 'You have no saved prompts to clear.', 'info');
      return;
    }

    AppState.pendingDeleteId = null;
    AppState.isClearAllPending = true;

    DOM.modalConfirmTitle.textContent = 'Clear All Saved Prompts?';
    DOM.modalConfirmMessage.textContent = `Are you sure you want to delete all ${AppState.savedPrompts.length} saved prompts? This will permanently wipe your browser prompt history.`;
    DOM.btnConfirmProceed.textContent = 'Clear All History';
    DOM.btnConfirmProceed.className = 'btn btn-danger';

    openModal(DOM.modalConfirmDialog);
  }

  function executeConfirmedAction() {
    if (AppState.isClearAllPending) {
      AppState.savedPrompts = [];
      savePromptsToStorage();
      renderHistoryList();
      closeModal(DOM.modalConfirmDialog);
      showToast('History Cleared', 'All saved prompts have been removed.', 'info');
    } else if (AppState.pendingDeleteId) {
      AppState.savedPrompts = AppState.savedPrompts.filter(p => p.id !== AppState.pendingDeleteId);
      savePromptsToStorage();
      renderHistoryList();
      closeModal(DOM.modalConfirmDialog);
      showToast('Deleted', 'Prompt was deleted successfully.', 'success');
    }
    AppState.pendingDeleteId = null;
    AppState.isClearAllPending = false;
  }

  function exportPromptsToJSON() {
    if (AppState.savedPrompts.length === 0) {
      showToast('Export Error', 'No saved prompts available to export.', 'warning');
      return;
    }

    try {
      const jsonStr = JSON.stringify(AppState.savedPrompts, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `promptcraft-history-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Export Complete', 'Exported saved prompts as JSON file.', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Export Error', 'Failed to generate download file.', 'danger');
    }
  }

  /* --------------------------------------------------------------------------
     9. PROMPT QUALITY CHECKER (RULE-BASED HEURISTICS ENGINE)
     -------------------------------------------------------------------------- */
  /**
   * Analyzes prompt text across 6 core prompt-engineering dimensions:
   * 1. Task Objective (25 pts)
   * 2. Role Persona (15 pts)
   * 3. Context & Background (15 pts)
   * 4. Target Audience (15 pts)
   * 5. Output Format (15 pts)
   * 6. Specific Constraints (15 pts)
   * Max Score: 100
   */
  function evaluatePromptQuality(text) {
    if (!text || text.trim().length === 0) {
      return null;
    }

    const clean = text.toLowerCase();
    const wordCount = text.trim().split(/\s+/).length;

    const analysis = {
      score: 0,
      criteria: {},
      suggestions: [],
      detectedRole: null,
      detectedCategory: 'General'
    };

    // 1. Clear Task & Objective (25 pts)
    const taskActionVerbs = [
      'explain', 'write', 'create', 'generate', 'analyze', 'design', 'describe',
      'build', 'implement', 'summarize', 'review', 'compare', 'discuss', 'draft',
      'formulate', 'provide', 'test', 'evaluate', 'solve', 'develop', 'outline'
    ];
    const hasActionVerb = taskActionVerbs.some(v => new RegExp(`\\b${v}\\b`, 'i').test(clean));
    const hasAdequateLength = clean.length >= 35 && wordCount >= 7;

    const taskPassed = hasActionVerb && hasAdequateLength;
    analysis.criteria.task = {
      name: 'Clear Task & Objective',
      pts: taskPassed ? 25 : (hasActionVerb || hasAdequateLength ? 12 : 0),
      max: 25,
      passed: taskPassed,
      detail: taskPassed
        ? 'Identified clear action verbs and substantial task definition.'
        : 'Task lacks strong action verbs (e.g. "explain", "implement", "analyze") or is too brief.'
    };
    if (!taskPassed) {
      analysis.suggestions.push('Begin your prompt with a strong command verb such as "Explain", "Analyze", "Develop", or "Write" to define unambiguous intent.');
    }

    // 2. Role / Expertise Persona (15 pts)
    const roleKeywords = [
      'act as', 'you are', 'role:', 'expert in', 'as a senior', 'as an experienced',
      'persona', 'specialist', 'tutor', 'architect', 'engineer', 'coach', 'professor',
      'consultant', 'adviser', 'evaluator'
    ];
    const rolePassed = roleKeywords.some(kw => clean.includes(kw));
    analysis.criteria.role = {
      name: 'Role / Expertise Persona',
      pts: rolePassed ? 15 : 0,
      max: 15,
      passed: rolePassed,
      detail: rolePassed
        ? 'Expert persona or role assignment successfully recognized.'
        : 'Missing an assigned expert persona (e.g., "Act as a Senior Software Architect").'
    };
    if (!rolePassed) {
      analysis.suggestions.push('Assign an explicit role (e.g., "Act as a Senior Computer Science Professor") to anchor the AI\'s tone and depth.');
    }

    // 3. Context & Background (15 pts)
    const contextKeywords = [
      'context', 'background', 'scenario', 'project', 'because', 'goal',
      'situation', 'use case', 'for college', 'for exam', 'for interview',
      'purpose', 'objective is', 'environment'
    ];
    const contextPassed = contextKeywords.some(kw => clean.includes(kw)) || clean.length > 180;
    analysis.criteria.context = {
      name: 'Context & Background',
      pts: contextPassed ? 15 : 0,
      max: 15,
      passed: contextPassed,
      detail: contextPassed
        ? 'Adequate background context or operational scenario present.'
        : 'Missing contextual framing. Why are you asking for this, and what is the broader scenario?'
    };
    if (!contextPassed) {
      analysis.suggestions.push('Provide background details explaining why this output is needed (e.g., "This is for a college lab exam review").');
    }

    // 4. Target Audience (15 pts)
    const audienceKeywords = [
      'audience', 'beginner', 'intermediate', 'advanced', 'student', 'kid',
      'novice', 'senior', 'professional', 'expert', 'layman', 'practitioner',
      'reader', 'for someone who', 'undergraduate'
    ];
    const audiencePassed = audienceKeywords.some(kw => clean.includes(kw));
    analysis.criteria.audience = {
      name: 'Target Audience Identified',
      pts: audiencePassed ? 15 : 0,
      max: 15,
      passed: audiencePassed,
      detail: audiencePassed
        ? 'Reader proficiency level specified.'
        : 'Target audience not specified. AI might respond at the wrong technical level.'
    };
    if (!audiencePassed) {
      analysis.suggestions.push('Clarify your audience\'s skill level (e.g., "Explain for a beginner student with minimal coding experience").');
    }

    // 5. Expected Output Format (15 pts)
    const formatKeywords = [
      'format', 'bullet', 'table', 'step-by-step', 'step by step', 'paragraph',
      'json', 'markdown', 'code snippet', 'checklist', 'outline', 'summary',
      'numbered list', 'syntax snippet'
    ];
    const formatPassed = formatKeywords.some(kw => clean.includes(kw));
    analysis.criteria.format = {
      name: 'Expected Output Format',
      pts: formatPassed ? 15 : 0,
      max: 15,
      passed: formatPassed,
      detail: formatPassed
        ? 'Specific structure requested (bullets, table, code, or steps).'
        : 'No structural format specified (paragraphs vs bullets vs table).'
    };
    if (!formatPassed) {
      analysis.suggestions.push('Specify the exact output format you expect (e.g., "Format response as a step-by-step guide with code snippets").');
    }

    // 6. Specific Constraints & Guardrails (15 pts)
    const constraintKeywords = [
      'constraint', 'avoid', 'do not', 'don\'t', 'limit', 'only', 'must include',
      'ensure', 'strictly', 'without', 'length:', 'max', 'keep it', 'rules:',
      'no fluff', 'concise'
    ];
    const constraintPassed = constraintKeywords.some(kw => clean.includes(kw));
    analysis.criteria.constraints = {
      name: 'Constraints & Guardrails',
      pts: constraintPassed ? 15 : 0,
      max: 15,
      passed: constraintPassed,
      detail: constraintPassed
        ? 'Boundaries, exclusions, or rules specified.'
        : 'Lacks guardrails. The AI may add irrelevant fluff or stray off-topic.'
    };
    if (!constraintPassed) {
      analysis.suggestions.push('Add negative constraints or guardrails (e.g., "Do not use deprecated libraries; keep code examples under 30 lines").');
    }

    // Calculate total score
    analysis.score = Object.values(analysis.criteria).reduce((acc, c) => acc + c.pts, 0);

    // Grade classification
    if (analysis.score >= 85) {
      analysis.grade = 'Excellent Structure';
      analysis.gradeClass = 'score-excellent';
      analysis.verdict = 'Production-ready prompt! This prompt gives the AI crystal-clear guidance, audience calibration, and rigid constraints.';
    } else if (analysis.score >= 70) {
      analysis.grade = 'Good Quality';
      analysis.gradeClass = 'score-good';
      analysis.verdict = 'Solid foundation. Adding an explicit role persona or negative guardrails will elevate output accuracy.';
    } else if (analysis.score >= 50) {
      analysis.grade = 'Fair / Average';
      analysis.gradeClass = 'score-fair';
      analysis.verdict = 'The prompt communicates basic intent, but leaves format, audience, and constraints open to guesswork by the AI.';
    } else {
      analysis.grade = 'Needs Improvement';
      analysis.gradeClass = 'score-poor';
      analysis.verdict = 'Too brief or under-specified. An AI will likely respond with generic, unfocused, or hallucinated answers.';
    }

    return analysis;
  }

  function runQualityCheck() {
    const text = DOM.checkerTextarea.value.trim();

    if (!text) {
      DOM.checkerErrorMsg.style.display = 'block';
      DOM.checkerTextarea.focus();
      showToast('Validation Error', 'Please enter a prompt to analyze.', 'warning');
      return;
    } else {
      DOM.checkerErrorMsg.style.display = 'none';
    }

    const analysis = evaluatePromptQuality(text);
    AppState.currentQualityAnalysis = analysis;

    displayQualityResults(analysis);
    showToast('Quality Analyzed', `Estimated score: ${analysis.score}/100 (${analysis.grade})`, 'info');
  }

  function displayQualityResults(analysis) {
    // Score number and grade
    DOM.scoreNumberDisplay.textContent = analysis.score;
    DOM.scoreGradeTitle.textContent = analysis.grade;
    DOM.scoreVerdictDesc.textContent = analysis.verdict;

    // Circle class and Progress bar fill
    DOM.scoreCircle.className = `score-circle ${analysis.gradeClass}`;
    DOM.scoreBarFill.style.width = `${analysis.score}%`;

    // Status indicator badge
    DOM.checkerStatusBadge.textContent = `${analysis.score}/100`;
    DOM.checkerStatusBadge.className = `status-indicator ${analysis.score >= 70 ? 'active' : 'ready'}`;

    // Update Checklist items
    const critKeys = ['task', 'role', 'context', 'audience', 'format', 'constraints'];
    critKeys.forEach(k => {
      const crit = analysis.criteria[k];
      const el = DOM.critElements[k];
      if (el && crit) {
        if (crit.passed) {
          el.className = 'checklist-item passed';
          el.querySelector('.crit-icon').textContent = '✓';
          el.querySelector('.crit-pts').textContent = `${crit.pts}/${crit.max} pts`;
        } else {
          el.className = 'checklist-item missing';
          el.querySelector('.crit-icon').textContent = '!';
          el.querySelector('.crit-pts').textContent = `${crit.pts}/${crit.max} pts`;
        }
        el.querySelector('.crit-detail').textContent = crit.detail;
      }
    });

    // Populate suggestions
    if (analysis.suggestions.length === 0) {
      DOM.suggestionsList.innerHTML = `<li>Outstanding! Your prompt covers all recommended structural elements.</li>`;
    } else {
      DOM.suggestionsList.innerHTML = analysis.suggestions.map(s => `<li>${escapeHTML(s)}</li>`).join('');
    }

    // Enable "Improve Prompt Automatically" button
    DOM.btnAutoImprove.disabled = false;

    // Reset enhanced box if previously shown
    DOM.improvedPromptSection.classList.add('hidden');
  }

  /**
   * Generates an improved, professional version of any weak or input prompt
   * by automatically infusing missing prompt-engineering dimensions.
   */
  function autoImprovePrompt() {
    const rawText = DOM.checkerTextarea.value.trim();
    if (!rawText) return;

    // Heuristically infer category / domain
    const clean = rawText.toLowerCase();
    let inferredRole = 'Subject Matter Specialist & Technical Advisor';
    let inferredCategory = 'General';
    let inferredFormat = 'Step-by-Step with Key Takeaways';

    if (clean.includes('python') || clean.includes('java') || clean.includes('code') || clean.includes('sql') || clean.includes('bug') || clean.includes('script')) {
      inferredRole = 'Senior Software Architect & Full-Stack Systems Engineer';
      inferredCategory = 'Coding';
      inferredFormat = 'Step-by-Step with Clean Syntax Code Snippets';
    } else if (clean.includes('exam') || clean.includes('student') || clean.includes('assignment') || clean.includes('study') || clean.includes('college')) {
      inferredRole = 'University Academic Professor & Curriculum Mentor';
      inferredCategory = 'Education';
      inferredFormat = 'Structured Conceptual Breakdown with Examples';
    } else if (clean.includes('resume') || clean.includes('interview') || clean.includes('business') || clean.includes('market') || clean.includes('startup')) {
      inferredRole = 'Senior Executive Career Consultant & Industry Recruiter';
      inferredCategory = 'Business';
      inferredFormat = 'Actionable Bullet Points and Practical Templates';
    }

    const improvedPrompt = `[ROLE & PERSONA]
Act as a ${inferredRole}.

[PRIMARY TASK]
${rawText}

[CONTEXT & DOMAIN]
Provide comprehensive explanations designed for academic review and technical application. Highlight core principles, underlying mechanics, and trade-offs.

[TARGET AUDIENCE]
Target audience: Intermediate (Practitioner / Student). Maintain high technical accuracy while ensuring concepts are explained clearly from first principles.

[TONE & STYLE]
Tone: Professional, direct, and constructive. Avoid unnecessary conversational preamble.

[OUTPUT FORMAT & STRUCTURE]
${inferredFormat}.
Ensure the response is clearly segmented with bold headings and concise bulleted takeaways.

[CONSTRAINTS & GUARDRAILS]
- Do not provide surface-level or generic statements; provide accurate, verifiable, and actionable details.
- Where code or formulas are required, adhere to current industry standards and clean practices.
- Conclude with a brief summary of common pitfalls to avoid.`;

    DOM.improvedPromptText.textContent = improvedPrompt;
    DOM.improvedPromptSection.classList.remove('hidden');

    DOM.improvedPromptSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Prompt Enhanced', 'Generated an improved, structured version using heuristic rules.', 'success');
  }

  function loadCheckerSample(type) {
    if (type === 'weak') {
      DOM.checkerTextarea.value = 'explain java oops concepts';
      DOM.checkerCharCount.textContent = `${DOM.checkerTextarea.value.length} characters`;
      runQualityCheck();
    } else if (type === 'strong') {
      DOM.checkerTextarea.value = `Act as a Senior Java Software Architect.
Explain Object-Oriented Programming (OOP) concepts in Java—Encapsulation, Inheritance, Polymorphism, and Abstraction—for an intermediate college student preparing for a lab exam.
Format the output as a numbered step-by-step guide with clean compilable Java 17+ code snippets.
Constraints: Do not use deprecated APIs; include error handling notes and dynamic dispatch memory explanations.`;
      DOM.checkerCharCount.textContent = `${DOM.checkerTextarea.value.length} characters`;
      runQualityCheck();
    }
  }

  function clearChecker() {
    DOM.checkerTextarea.value = '';
    DOM.checkerCharCount.textContent = '0 characters';
    DOM.checkerErrorMsg.style.display = 'none';
    DOM.scoreNumberDisplay.textContent = '0';
    DOM.scoreGradeTitle.textContent = 'No Evaluation Yet';
    DOM.scoreVerdictDesc.textContent = 'Enter your prompt on the left and click "Analyze Quality Score" to see how well it\'s structured.';
    DOM.scoreCircle.className = 'score-circle';
    DOM.scoreBarFill.style.width = '0%';
    DOM.checkerStatusBadge.textContent = 'Waiting for Input';
    DOM.checkerStatusBadge.className = 'status-indicator';

    const critKeys = ['task', 'role', 'context', 'audience', 'format', 'constraints'];
    critKeys.forEach(k => {
      const el = DOM.critElements[k];
      if (el) {
        el.className = 'checklist-item';
        el.querySelector('.crit-icon').textContent = '•';
      }
    });

    DOM.suggestionsList.innerHTML = '<li>Submit your prompt above to receive tailored recommendations.</li>';
    DOM.btnAutoImprove.disabled = true;
    DOM.improvedPromptSection.classList.add('hidden');
    showToast('Cleared', 'Quality checker inputs cleared.', 'info');
  }

  /* --------------------------------------------------------------------------
     10. CLIPBOARD & COPY HELPERS
     -------------------------------------------------------------------------- */
  function copyTextToClipboard(text, successMessage = 'Prompt copied to clipboard!') {
    if (!text) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showToast('Copied!', successMessage, 'success');
        })
        .catch(err => {
          fallbackCopyText(text, successMessage);
        });
    } else {
      fallbackCopyText(text, successMessage);
    }
  }

  function fallbackCopyText(text, successMessage) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        showToast('Copied!', successMessage, 'success');
      } else {
        showToast('Copy Failed', 'Please manually select and copy the text.', 'warning');
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
      showToast('Copy Failed', 'Could not copy to clipboard.', 'danger');
    }
  }

  /* --------------------------------------------------------------------------
     11. MODAL SYSTEM
     -------------------------------------------------------------------------- */
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.add('hidden');
    });
    document.body.style.overflow = '';
  }

  /* --------------------------------------------------------------------------
     12. TOAST NOTIFICATION SYSTEM
     -------------------------------------------------------------------------- */
  function showToast(title, message, type = 'info') {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    // SVG icon based on type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-body">
        <h4 class="toast-title">${escapeHTML(title)}</h4>
        <p class="toast-msg">${escapeHTML(message)}</p>
      </div>
      <button type="button" class="toast-close" aria-label="Close notification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    DOM.toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // Auto-remove after 3.8 seconds
    setTimeout(() => {
      removeToast(toast);
    }, 3800);
  }

  function removeToast(toastEl) {
    if (!toastEl || !toastEl.parentNode) return;
    toastEl.classList.add('toast-hiding');
    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
    }, 250);
  }

  /* --------------------------------------------------------------------------
     13. UTILITY FUNCTIONS
     -------------------------------------------------------------------------- */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(isoString) {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  }

  /* --------------------------------------------------------------------------
     14. EVENT BINDINGS & REGISTRATION
     -------------------------------------------------------------------------- */
  function bindEventListeners() {
    // 1. Navigation clicks
    document.addEventListener('click', e => {
      const viewTrigger = e.target.closest('[data-view]');
      if (viewTrigger) {
        e.preventDefault();
        const targetView = viewTrigger.getAttribute('data-view');
        switchView(targetView, true);
      }
    });

    // Mobile menu toggle
    if (DOM.mobileMenuToggle) {
      DOM.mobileMenuToggle.addEventListener('click', toggleMobileDrawer);
    }

    // Header Quick Create
    if (DOM.headerQuickCreateBtn) {
      DOM.headerQuickCreateBtn.addEventListener('click', () => switchView('generator', true));
    }

    // Hero buttons
    if (DOM.heroStartBtn) {
      DOM.heroStartBtn.addEventListener('click', () => switchView('generator', true));
    }
    if (DOM.heroTemplatesBtn) {
      DOM.heroTemplatesBtn.addEventListener('click', () => switchView('templates', true));
    }
    if (DOM.ctaLaunchBtn) {
      DOM.ctaLaunchBtn.addEventListener('click', () => switchView('generator', true));
    }

    // 2. Generator events
    if (DOM.generatorForm) {
      DOM.generatorForm.addEventListener('submit', handlePromptGeneration);
    }
    if (DOM.taskInput) {
      DOM.taskInput.addEventListener('input', () => {
        updateTaskCharCount();
        if (DOM.taskInput.value.trim().length > 0) {
          DOM.taskInput.parentElement.classList.remove('has-error');
          DOM.taskErrorMsg.style.display = 'none';
        }
      });
    }
    if (DOM.btnLoadSample) {
      DOM.btnLoadSample.addEventListener('click', loadSampleTask);
    }
    if (DOM.btnResetGenerator) {
      DOM.btnResetGenerator.addEventListener('click', resetGeneratorForm);
    }
    if (DOM.btnClearResult) {
      DOM.btnClearResult.addEventListener('click', clearGeneratorResult);
    }
    if (DOM.btnRegeneratePrompt) {
      DOM.btnRegeneratePrompt.addEventListener('click', () => {
        handlePromptGeneration();
        showToast('Regenerated', 'Prompt was regenerated with updated structure.', 'info');
      });
    }

    // Quick topic chips in generator
    DOM.topicChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const topic = chip.getAttribute('data-topic');
        if (topic) {
          DOM.taskInput.value = `Provide a comprehensive, production-ready explanation and implementation guide for ${topic}, including best practices and potential pitfalls.`;
          updateTaskCharCount();
          DOM.taskInput.parentElement.classList.remove('has-error');
          DOM.taskErrorMsg.style.display = 'none';
          showToast('Topic Selected', `Loaded topic: ${topic}`, 'info');
        }
      });
    });

    // Copy generated prompt
    if (DOM.btnCopyPrompt) {
      DOM.btnCopyPrompt.addEventListener('click', () => {
        const text = DOM.generatedPromptText.textContent;
        if (!text) return;
        copyTextToClipboard(text, 'Generated prompt copied to clipboard!');
        if (DOM.copyBtnLabel) {
          DOM.copyBtnLabel.textContent = 'Copied!';
          setTimeout(() => {
            DOM.copyBtnLabel.textContent = 'Copy Prompt';
          }, 2000);
        }
      });
    }

    // Save generated prompt
    if (DOM.btnSavePrompt) {
      DOM.btnSavePrompt.addEventListener('click', openSavePromptModal);
    }
    if (DOM.btnConfirmSavePrompt) {
      DOM.btnConfirmSavePrompt.addEventListener('click', confirmSavePrompt);
    }

    // Send generated prompt to Quality Checker
    if (DOM.btnCheckThisPrompt) {
      DOM.btnCheckThisPrompt.addEventListener('click', () => {
        const text = DOM.generatedPromptText.textContent.trim();
        if (!text) return;
        DOM.checkerTextarea.value = text;
        DOM.checkerCharCount.textContent = `${text.length} characters`;
        switchView('checker', true);
        runQualityCheck();
      });
    }

    // 3. Templates events
    if (DOM.templateSearchInput) {
      DOM.templateSearchInput.addEventListener('input', e => {
        if (DOM.templateSearchClear) {
          DOM.templateSearchClear.classList.toggle('hidden', !e.target.value);
        }
        renderTemplates();
      });
    }
    if (DOM.templateSearchClear) {
      DOM.templateSearchClear.addEventListener('click', () => {
        DOM.templateSearchInput.value = '';
        DOM.templateSearchClear.classList.add('hidden');
        renderTemplates();
        DOM.templateSearchInput.focus();
      });
    }
    if (DOM.templateCategoryPills) {
      DOM.templateCategoryPills.addEventListener('click', e => {
        const btn = e.target.closest('.pill-btn');
        if (btn) {
          DOM.templateCategoryPills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          AppState.activeTemplateCategory = btn.getAttribute('data-category');
          renderTemplates();
        }
      });
    }
    if (DOM.btnResetTemplateFilters) {
      DOM.btnResetTemplateFilters.addEventListener('click', () => {
        DOM.templateSearchInput.value = '';
        if (DOM.templateSearchClear) DOM.templateSearchClear.classList.add('hidden');
        AppState.activeTemplateCategory = 'all';
        DOM.templateCategoryPills.querySelectorAll('.pill-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === 'all');
        });
        renderTemplates();
      });
    }

    // Template grid delegated clicks (Use Template)
    if (DOM.templatesGridContainer) {
      DOM.templatesGridContainer.addEventListener('click', e => {
        const btn = e.target.closest('.btn-use-template');
        if (btn) {
          const tplId = btn.getAttribute('data-template-id');
          applyTemplateToGenerator(tplId);
        }
      });
    }

    // 4. History (My Prompts) events
    if (DOM.historySearchInput) {
      DOM.historySearchInput.addEventListener('input', renderHistoryList);
    }
    if (DOM.historyCategoryPills) {
      DOM.historyCategoryPills.addEventListener('click', e => {
        const btn = e.target.closest('.pill-btn');
        if (btn) {
          DOM.historyCategoryPills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          AppState.activeHistoryCategory = btn.getAttribute('data-category');
          renderHistoryList();
        }
      });
    }
    if (DOM.btnHistoryGoCreate) {
      DOM.btnHistoryGoCreate.addEventListener('click', () => switchView('generator', true));
    }
    if (DOM.btnExportPrompts) {
      DOM.btnExportPrompts.addEventListener('click', exportPromptsToJSON);
    }
    if (DOM.btnClearAllHistory) {
      DOM.btnClearAllHistory.addEventListener('click', promptClearAllConfirmation);
    }

    // History card delegated clicks (View, Copy, Edit, Delete)
    if (DOM.historyGridContainer) {
      DOM.historyGridContainer.addEventListener('click', e => {
        // View
        const viewBtn = e.target.closest('.btn-view-history') || e.target.closest('.history-card-preview');
        if (viewBtn) {
          const card = viewBtn.closest('.history-card');
          const id = card ? card.getAttribute('data-prompt-id') : null;
          if (id) openViewPromptModal(id);
          return;
        }

        // Copy
        const copyBtn = e.target.closest('.btn-copy-history');
        if (copyBtn) {
          const id = copyBtn.getAttribute('data-prompt-id');
          const item = AppState.savedPrompts.find(p => p.id === id);
          if (item) copyTextToClipboard(item.promptText, `"${item.title}" copied to clipboard!`);
          return;
        }

        // Edit
        const editBtn = e.target.closest('.btn-edit-history');
        if (editBtn) {
          const id = editBtn.getAttribute('data-prompt-id');
          openEditPromptModal(id);
          return;
        }

        // Delete
        const deleteBtn = e.target.closest('.btn-delete-history');
        if (deleteBtn) {
          const id = deleteBtn.getAttribute('data-prompt-id');
          promptDeleteConfirmation(id);
          return;
        }
      });
    }

    // Modal Edit save
    if (DOM.btnSaveEditedPrompt) {
      DOM.btnSaveEditedPrompt.addEventListener('click', saveEditedPrompt);
    }

    // Modal Confirmation proceed
    if (DOM.btnConfirmProceed) {
      DOM.btnConfirmProceed.addEventListener('click', executeConfirmedAction);
    }

    // Modal View Prompt actions
    if (DOM.modalBtnCopyView) {
      DOM.modalBtnCopyView.addEventListener('click', () => {
        const text = DOM.modalViewContent.textContent;
        copyTextToClipboard(text, 'Prompt copied from viewer!');
      });
    }
    if (DOM.modalBtnSendToChecker) {
      DOM.modalBtnSendToChecker.addEventListener('click', () => {
        const text = DOM.modalViewContent.textContent.trim();
        closeModal(DOM.modalViewPrompt);
        DOM.checkerTextarea.value = text;
        DOM.checkerCharCount.textContent = `${text.length} characters`;
        switchView('checker', true);
        runQualityCheck();
      });
    }

    // 5. Quality Checker events
    if (DOM.checkerTextarea) {
      DOM.checkerTextarea.addEventListener('input', () => {
        const len = DOM.checkerTextarea.value.length;
        DOM.checkerCharCount.textContent = `${len} character${len === 1 ? '' : 's'}`;
        if (len > 0) DOM.checkerErrorMsg.style.display = 'none';
      });
    }
    if (DOM.btnRunQualityCheck) {
      DOM.btnRunQualityCheck.addEventListener('click', runQualityCheck);
    }
    if (DOM.btnClearChecker) {
      DOM.btnClearChecker.addEventListener('click', clearChecker);
    }
    if (DOM.btnCheckerSampleWeak) {
      DOM.btnCheckerSampleWeak.addEventListener('click', () => loadCheckerSample('weak'));
    }
    if (DOM.btnCheckerSampleStrong) {
      DOM.btnCheckerSampleStrong.addEventListener('click', () => loadCheckerSample('strong'));
    }
    if (DOM.btnAutoImprove) {
      DOM.btnAutoImprove.addEventListener('click', autoImprovePrompt);
    }
    if (DOM.btnCopyImproved) {
      DOM.btnCopyImproved.addEventListener('click', () => {
        const text = DOM.improvedPromptText.textContent;
        copyTextToClipboard(text, 'Enhanced prompt copied to clipboard!');
      });
    }
    if (DOM.btnLoadImprovedToGenerator) {
      DOM.btnLoadImprovedToGenerator.addEventListener('click', () => {
        const text = DOM.improvedPromptText.textContent.trim();
        if (!text) return;

        // Populate task into generator
        DOM.taskInput.value = DOM.checkerTextarea.value.trim() || text;
        updateTaskCharCount();
        switchView('generator', true);
        handlePromptGeneration();
        showToast('Transferred', 'Prompt transferred into Interactive Builder.', 'success');
      });
    }

    // 6. Generic Modal Close buttons & Backdrop clicks
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', e => {
        const backdrop = e.target.closest('.modal-backdrop');
        closeModal(backdrop);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Escape key to dismiss modals
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });

    // Header scroll background shadow effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        DOM.siteHeader.classList.add('scrolled');
      } else {
        DOM.siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     15. INITIALIZATION
     -------------------------------------------------------------------------- */
  function initApp() {
    cacheDOMElements();
    loadSavedPromptsFromStorage();
    bindEventListeners();
    renderTemplates();
    renderHistoryList();

    // Check if initial hash exists (e.g., #generator, #templates)
    const hash = window.location.hash.replace('#', '');
    if (['home', 'generator', 'templates', 'history', 'checker'].includes(hash)) {
      switchView(hash, false);
    } else {
      switchView('home', false);
    }

    console.log('%cPromptCraft Initialized Successfully', 'color: #6366f1; font-weight: bold; font-size: 14px;');
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
