import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight, Bell, BookOpen, Bus, CalendarDays, Check, ChevronDown, Clock3,
  Compass, GraduationCap, HelpCircle, LibraryBig, MapPin, Megaphone, MessageCircle,
  Phone, School, ShieldAlert, Sparkles, Utensils, BriefcaseBusiness, ClipboardList,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, Route, Switch, useLocation } from 'wouter';

type Notice = { tag: string; title: string; detail: string; date: string };
type Deadline = { title: string; dueDate: string; severity: 'warning' | 'danger' | 'ok' };
type ClassPeriod = { time: string; subject: string; room: string; faculty: string };
type NavItem = { href: string; label: string; icon: LucideIcon };

const notices: Notice[] = [
  { tag: 'EXAM', title: 'Mid-Semester Exams', detail: 'Exams begin Oct 20. Collect admit cards from Exam Cell (Admin Block).', date: 'Oct 12' },
  { tag: 'HOLIDAY', title: 'Diwali Holidays', detail: 'Campus closed Oct 28 – Nov 2. Classes resume Nov 3.', date: 'Oct 10' },
  { tag: 'DEADLINE', title: 'Scholarship Forms', detail: 'Submit completed forms to Registrar Office by Oct 25.', date: 'Oct 9' },
  { tag: 'EVENT', title: 'TechFest 2025', detail: 'Annual tech fest on Nov 15. Register at CS Dept office or online.', date: 'Oct 8' },
];

const deadlines: Deadline[] = [
  { title: 'DBMS Assignment 3', dueDate: 'Oct 18', severity: 'warning' },
  { title: 'Scholarship Form', dueDate: 'Oct 25', severity: 'danger' },
  { title: 'OS Lab Record', dueDate: 'Oct 30', severity: 'ok' },
];

const timetables: Record<'CSE-A' | 'CSE-B', ClassPeriod[]> = {
  'CSE-A': [
    { time: '09:00', subject: 'DSA', room: 'Room 101', faculty: 'Dr. Sharma' },
    { time: '11:00', subject: 'DBMS', room: 'Room 204', faculty: 'Prof. Rao' },
    { time: '14:00', subject: 'OS Lab', room: 'Lab 3', faculty: 'Mr. Kumar' },
  ],
  'CSE-B': [
    { time: '10:00', subject: 'Networks', room: 'Room 102', faculty: 'Dr. Iyer' },
    { time: '12:00', subject: 'DSA', room: 'Room 101', faculty: 'Dr. Sharma' },
    { time: '15:00', subject: 'Mathematics', room: 'Room 105', faculty: 'Prof. Gupta' },
  ],
};

const faq = [
  { key: 'exam', label: 'Exam dates', query: 'When is my next exam?', answer: 'Your next exam: Mid-Semester Exams start Oct 20. Full timetable is on the Exam Hub. Admit cards are available from the Exam Cell.' },
  { key: 'library', label: 'Library hours', query: 'When does the library close?', answer: 'Library hours: 8 AM – 9 PM on weekdays, 9 AM – 5 PM on weekends. Issue limit: 4 books, 14 days.' },
  { key: 'bonafide', label: 'Bonafide certificate', query: 'Where can I get a bonafide certificate?', answer: 'Apply at the Registrar Office (Admin Block, Room 12). Fee ₹50, ready in 2 working days.' },
  { key: 'scholarship', label: 'Scholarship', query: 'Where do I submit my scholarship form?', answer: 'Scholarship forms must be submitted to the Registrar Office by Oct 25. Bring Aadhaar copy + fee receipt.' },
  { key: 'canteen', label: 'Canteen', query: 'What time does the canteen open?', answer: 'Canteen open 8 AM – 7 PM. Today’s menu: Rice & Curry ₹40, Sandwich ₹30, Fresh Juice ₹25.' },
  { key: 'bus', label: 'Bus routes', query: 'What are the campus bus routes?', answer: 'Bus routes: R1 City Center departs 7:30 AM · R2 North Campus departs 7:45 AM. Evening return: 4:30 PM & 5:15 PM.' },
  { key: 'placement', label: 'Placements', query: 'Tell me about upcoming placements', answer: 'Upcoming drives: TCS — Nov 5 · Infosys — Nov 12. Eligibility: 7.0 CGPA+, no active backlogs. Register at Placement Cell.' },
  { key: 'contact', label: 'Emergency contacts', query: 'What are the emergency contacts?', answer: 'Emergency contacts: Security 1800-111-222 · Medical 1800-111-333 · Admin Office 1800-111-444.' },
];

const navItems: NavItem[] = [
  { href: '/', label: 'Overview', icon: Compass },
  { href: '/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/notices', label: 'Announcements', icon: Megaphone },
  { href: '/deadlines', label: 'Deadlines', icon: ClipboardList },
  { href: '/ask', label: 'Ask Campus', icon: MessageCircle },
  { href: '/services', label: 'Campus services', icon: School },
];

const services: { name: string; icon: LucideIcon; info: string; foot: string }[] = [
  { name: 'Library', icon: LibraryBig, info: 'Hours: 8 AM – 9 PM (weekdays). 4 books, 14 days.', foot: 'Weekday & weekend hours' },
  { name: 'Canteen', icon: Utensils, info: '8 AM – 7 PM · Rice ₹40 · Sandwich ₹30 · Juice ₹25.', foot: 'Food & refreshments' },
  { name: 'Transport', icon: Bus, info: 'R1 City Center 7:30 AM · R2 North Campus 7:45 AM.', foot: 'Evening return: 4:30 PM & 5:15 PM' },
  { name: 'Emergency', icon: ShieldAlert, info: 'Security 1800-111-222 · Medical 1800-111-333 · Admin 1800-111-444.', foot: 'Campus help contacts' },
  { name: 'Placement Cell', icon: BriefcaseBusiness, info: 'Drives: TCS Nov 5 · Infosys Nov 12 · Register at Placement Cell.', foot: 'Eligibility: 7.0 CGPA+, no active backlogs' },
  { name: 'Registrar Office', icon: GraduationCap, info: 'Admin Block Rm 12 · Bonafide ₹50 · Scholarships due Oct 25.', foot: 'Certificates & scholarship forms' },
];

function getAnswer(query: string) {
  const normalized = query.toLowerCase();
  const match = faq.find(({ key }) => {
    const terms: Record<string, string[]> = {
      exam: ['exam', 'test', 'midsem', 'mid sem', 'mid-semester'],
      library: ['library', 'book', 'issue'],
      bonafide: ['bonafide', 'certificate'],
      scholarship: ['scholarship', 'fee waiver', 'stipend'],
      canteen: ['canteen', 'food', 'menu', 'lunch', 'eat', 'cafe'],
      bus: ['bus', 'transport', 'route'],
      placement: ['placement', 'internship', 'job', 'tcs', 'infosys', 'company', 'recruit'],
      contact: ['contact', 'emergency', 'phone', 'number', 'call', 'help'],
    };
    return terms[key].some((term) => normalized.includes(term));
  });
  return match?.answer ?? 'I couldn’t find that one. Try asking about exams, library, bonafide certificates, scholarships, canteen, buses, placements or emergency contacts.';
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="portal-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <Link href="/" className="brand" data-testid="link-brand">
          <span className="brand-mark"><School size={21} strokeWidth={1.8} /></span>
          <span><span className="brand-name">Campus Portal</span><span className="brand-sub">Student companion</span></span>
        </Link>
        <div className="nav-label">Your campus</div>
        <nav className="nav-list">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link${location === href ? ' active' : ''}`} aria-current={location === href ? 'page' : undefined} data-testid={`link-nav-${href === '/' ? 'overview' : href.slice(1)}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-note"><strong>Everything in its place.</strong>Reliable campus information, right when you need it.</div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="top-context"><MapPin size={14} /><span>Student campus guide</span></div>
          <div className="top-right"><span className="status-dot" aria-hidden="true" />Campus information desk</div>
        </header>
        <main className="page-content page-enter">{children}</main>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`mobile-link${location === href ? ' active' : ''}`} aria-label={label} aria-current={location === href ? 'page' : undefined} data-testid={`mobile-nav-${href === '/' ? 'overview' : href.slice(1)}`}>
              <Icon aria-hidden="true" /><span>{label === 'Announcements' ? 'Notices' : label === 'Campus services' ? 'Services' : label === 'Overview' ? 'Home' : label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

function Footer() {
  return <footer className="footer-line"><span>Campus Portal · Student companion</span><span>Campus information, clearly gathered</span></footer>;
}

function NoticeTag({ tag }: { tag: string }) {
  return <span className={`tag ${tag.toLowerCase()}`} data-testid={`notice-tag-${tag.toLowerCase()}`}>{tag}</span>;
}

function Dashboard() {
  return (
    <>
      <div className="dashboard-intro">
        <div><Eyebrow>Campus at a glance</Eyebrow><h1>Your campus, in one place.</h1><p className="page-subtitle" style={{ marginBottom: 0 }}>A clear view of classes, campus updates and what’s coming up.</p></div>
        <div className="date-stamp" data-testid="text-dashboard-snapshot">STUDENT SNAPSHOT</div>
      </div>
      <section className="welcome-banner" data-testid="card-campus-welcome">
        <div className="welcome-label">A good place to start</div>
        <h2>Everything you need to know, without the channel-hopping.</h2>
        <p>Class schedules, important dates and campus services are gathered here.</p>
      </section>
      <div className="stats-grid">
        <article className="stat-card" data-testid="stat-notices"><div className="stat-top"><span>Campus notices</span><span className="stat-icon"><Bell size={15} /></span></div><div className="stat-value">04</div><div className="stat-foot">Updates to keep in view</div></article>
        <article className="stat-card" data-testid="stat-deadlines"><div className="stat-top"><span>Tracked deadlines</span><span className="stat-icon"><Clock3 size={15} /></span></div><div className="stat-value">03</div><div className="stat-foot">Dates and status at a glance</div></article>
        <article className="stat-card" data-testid="stat-sections"><div className="stat-top"><span>Sections listed</span><span className="stat-icon"><BookOpen size={15} /></span></div><div className="stat-value">02</div><div className="stat-foot">CSE-A and CSE-B timetables</div></article>
      </div>
      <div className="content-grid">
        <section className="panel" aria-labelledby="latest-notices-heading">
          <div className="panel-heading"><h2 id="latest-notices-heading"><Megaphone size={17} />Latest announcements</h2><Link href="/notices" className="text-link" data-testid="link-all-notices">All updates <ArrowRight size={13} /></Link></div>
          <div className="notice-list">
            {notices.slice(0, 3).map((notice) => <article className="notice-row" key={notice.title} data-testid={`notice-preview-${notice.tag.toLowerCase()}`}><div className="notice-meta"><NoticeTag tag={notice.tag} /><span className="notice-date">{notice.date}</span></div><div className="notice-title">{notice.title}</div><p className="notice-detail">{notice.detail}</p></article>)}
          </div>
        </section>
        <section className="panel" aria-labelledby="upcoming-deadlines-heading">
          <div className="panel-heading"><h2 id="upcoming-deadlines-heading"><Clock3 size={17} />Upcoming deadlines</h2><Link href="/deadlines" className="text-link" data-testid="link-deadline-tracker">View tracker <ArrowRight size={13} /></Link></div>
          <div className="deadline-list">
            {deadlines.map((deadline) => <article className="deadline-item" key={deadline.title} data-testid={`deadline-preview-${deadline.title.toLowerCase().replaceAll(' ', '-')}`}><div><div className="deadline-title">{deadline.title}</div><div className="deadline-date">Due {deadline.dueDate}</div></div><span className={`severity ${deadline.severity}`}>{severityLabel(deadline.severity)}</span></article>)}
          </div>
        </section>
      </div>
      <section className="action-band"><div><h3>Need a quick campus answer?</h3><p>Ask about exams, library hours, transport, certificates and more.</p></div><Link href="/ask" className="button-primary" data-testid="button-open-ask">Ask Campus <ArrowRight size={15} /></Link></section>
      <Footer />
    </>
  );
}

function TimetablePage() {
  const [section, setSection] = useState<'CSE-A' | 'CSE-B'>('CSE-A');
  const periods = timetables[section];
  return (
    <>
      <Eyebrow>Plan your day</Eyebrow><h1>Today’s timetable</h1><p className="page-subtitle">Select your section to see the classes, rooms and faculty listed for the day.</p>
      <section className="panel" data-testid="panel-timetable">
        <div className="section-toolbar">
          <div><div className="deadline-summary"><CalendarDays size={15} />Class schedule</div></div>
          <label className="select-label" htmlFor="section-select">Your section
            <span className="select-wrap"><select id="section-select" className="select-control" value={section} onChange={(event) => setSection(event.target.value as 'CSE-A' | 'CSE-B')} data-testid="select-section"><option value="CSE-A">CSE-A</option><option value="CSE-B">CSE-B</option></select><ChevronDown size={14} /></span>
          </label>
        </div>
        <div className="table-scroll">
          <table className="class-table" data-testid="table-timetable"><thead><tr><th>Time</th><th>Subject</th><th>Room</th><th>Faculty</th></tr></thead><tbody>
            {periods.map((period) => <tr key={`${section}-${period.time}`} data-testid={`class-period-${period.time.replace(':', '')}`}><td>{period.time}</td><td>{period.subject}</td><td>{period.room}</td><td><span className="faculty-name"><span className="faculty-initial">{period.faculty.split(' ').at(-1)?.slice(0, 1)}</span>{period.faculty}</span></td></tr>)}
          </tbody></table>
        </div>
        <div className="deadline-summary" style={{ marginTop: 14 }}><Check size={14} />Showing {periods.length} periods for {section}</div>
      </section>
      <Footer />
    </>
  );
}

function NoticesPage() {
  return (
    <>
      <Eyebrow>From around campus</Eyebrow><h1>Announcements</h1><p className="page-subtitle">Exams, holidays, deadlines and events—gathered in one reliable place.</p>
      <div className="notice-cards">
        {notices.map((notice) => <article className="notice-card" key={notice.title} data-testid={`notice-card-${notice.tag.toLowerCase()}`}>
          <div className="notice-calendar"><small>Posted</small><strong>{notice.date}</strong></div>
          <div><NoticeTag tag={notice.tag} /><h2>{notice.title}</h2><p>{notice.detail}</p></div>
        </article>)}
      </div>
      <Footer />
    </>
  );
}

function severityLabel(severity: Deadline['severity']) {
  if (severity === 'danger') return 'Urgent';
  if (severity === 'warning') return 'Due soon';
  return 'On track';
}

function DeadlinesPage() {
  return (
    <>
      <Eyebrow>Keep the important dates close</Eyebrow><h1>Deadlines & assignments</h1><p className="page-subtitle">A simple tracker for what’s due and how soon it needs your attention.</p>
      <section className="panel" data-testid="panel-deadlines">
        <div className="panel-heading"><h2><ClipboardList size={17} />Your deadline tracker</h2><span className="deadline-summary"><span className="status-dot" />{deadlines.length} listed</span></div>
        <div className="table-scroll"><table className="deadline-table" data-testid="table-deadlines"><thead><tr><th>Task</th><th>Due date</th><th>Status</th></tr></thead><tbody>
          {deadlines.map((deadline) => <tr key={deadline.title} data-testid={`deadline-row-${deadline.title.toLowerCase().replaceAll(' ', '-')}`}><td>{deadline.title}</td><td className="due-date">{deadline.dueDate}</td><td><span className={`severity ${deadline.severity}`}>{severityLabel(deadline.severity)}</span></td></tr>)}
        </tbody></table></div>
      </section>
      <div className="action-band"><div><h3>Scholarship form coming up</h3><p>Forms are due Oct 25 at the Registrar Office.</p></div><Link href="/notices" className="button-quiet" data-testid="link-scholarship-notice">View announcement <ArrowRight size={14} /></Link></div>
      <Footer />
    </>
  );
}

function AskPage() {
  const [query, setQuery] = useState('');
  const [asked, setAsked] = useState('');
  const submitQuery = (value: string) => {
    const clean = value.trim();
    if (clean) { setQuery(clean); setAsked(clean); }
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuery(query);
  };
  return (
    <div className="ask-layout">
      <div className="ask-intro">
        <div className="ask-emblem"><MessageCircle size={25} /></div>
        <Eyebrow>Answers from campus information</Eyebrow>
        <h1>Ask Campus</h1>
        <p className="page-subtitle">A quick way to find the details students ask for most. Choose a prompt or type your question.</p>
      </div>
      <section className="panel ask-panel" data-testid="panel-ask">
        <form className="ask-form" onSubmit={handleSubmit}>
          <input className="ask-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. When does the library close?" aria-label="Ask a campus question" data-testid="input-campus-question" />
          <button className="button-primary" type="submit" data-testid="button-ask-submit"><Sparkles size={15} />Ask Campus</button>
        </form>
        <div className="suggestion-label">Popular questions</div>
        <div className="suggestions">
          {faq.map(({ key, label, query: suggestion }) => <button className="suggestion" type="button" key={key} onClick={() => submitQuery(suggestion)} data-testid={`suggestion-${key}`}>{label}</button>)}
        </div>
        {asked && <div className="answer-thread" aria-live="polite" data-testid="answer-thread">
          <div className="question-bubble" data-testid="text-asked-question">{asked}</div>
          <div className="answer-card" data-testid="card-campus-answer"><div className="answer-label">Campus information</div><p className="answer-text">{getAnswer(asked)}</p></div>
        </div>}
      </section>
      <div className="deadline-summary" style={{ justifyContent: 'center', marginTop: 15 }}><HelpCircle size={14} />Answers use the campus information listed in this portal.</div>
      <Footer />
    </div>
  );
}

function ServicesPage() {
  return (
    <>
      <Eyebrow>Helpful places & people</Eyebrow><h1>Campus services</h1><p className="page-subtitle">The everyday details for getting around, finding support and making campus life easier.</p>
      <div className="services-grid">
        {services.map(({ name, icon: Icon, info, foot }) => <article className="service-card" key={name} data-testid={`service-card-${name.toLowerCase().replaceAll(' ', '-')}`}>
          <div className="service-top"><span className="service-icon"><Icon size={18} /></span><h2>{name}</h2></div>
          <p>{info}</p>
          <div className="service-foot">{name === 'Emergency' ? <Phone size={12} /> : name === 'Transport' ? <Bus size={12} /> : <MapPin size={12} />}{foot}</div>
        </article>)}
      </div>
      <Footer />
    </>
  );
}

function NotFound() {
  return <div className="not-found"><div><div className="not-found-mark">404</div><Eyebrow>Off the campus map</Eyebrow><h1>That page isn’t here.</h1><p>Head back to the campus overview to find your way.</p><Link href="/" className="button-primary" data-testid="link-back-home">Return to overview <ArrowRight size={15} /></Link></div></div>;
}

function App() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/timetable" component={TimetablePage} />
        <Route path="/notices" component={NoticesPage} />
        <Route path="/deadlines" component={DeadlinesPage} />
        <Route path="/ask" component={AskPage} />
        <Route path="/services" component={ServicesPage} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

export default App;
