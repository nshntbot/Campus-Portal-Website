#include "crow_all.h"
#include <map>
#include <vector>
#include <algorithm>
#include <sstream>
#include <iomanip>

// ==================== DATA (replace with your college's real data) ====================
struct Notice { std::string tag, title, detail, date; };
std::vector<Notice> notices = {
    {"EXAM",    "Mid-Semester Exams",    "Exams begin Oct 20. Collect admit cards from Exam Cell (Admin Block).", "Oct 12"},
    {"HOLIDAY", "Diwali Holidays",       "Campus closed Oct 28 – Nov 2. Classes resume Nov 3.",                   "Oct 10"},
    {"DEADLINE","Scholarship Forms",     "Submit completed forms to Registrar Office by Oct 25.",                 "Oct 9"},
    {"EVENT",   "TechFest 2025",         "Annual tech fest on Nov 15. Register at CS Dept office or online.",     "Oct 8"},
};

std::map<std::string, std::string> timetables = {
    {"CSE-A", "09:00|DSA|Room 101|Dr. Sharma;11:00|DBMS|Room 204|Prof. Rao;14:00|OS Lab|Lab 3|Mr. Kumar"},
    {"CSE-B", "10:00|Networks|Room 102|Dr. Iyer;12:00|DSA|Room 101|Dr. Sharma;15:00|Mathematics|Room 105|Prof. Gupta"},
};

std::vector<std::pair<std::string,std::string>> deadlines = {
    {"DBMS Assignment 3", "Oct 18", "warning"},
    {"Scholarship Form",  "Oct 25", "danger"},
    {"OS Lab Record",     "Oct 30", "ok"},
};

std::map<std::string, std::string> campusInfo = {
    {"exam",        "📢 Your next exam: Mid-Semester Exams start <b>Oct 20</b>. Full timetable is on the Exam Hub. Admit cards available from Exam Cell."},
    {"library",     "📚 Library hours: <b>8 AM – 9 PM</b> on weekdays, 9 AM – 5 PM on weekends. Issue limit: 4 books, 14 days."},
    {"bonafide",    "🎓 Bonafide certificates: Apply at the <b>Registrar Office</b> (Admin Block, Room 12). Fee ₹50, ready in 2 working days."},
    {"scholarship", "💰 Scholarship forms must be submitted to the <b>Registrar Office</b> by <b>Oct 25</b>. Bring Aadhaar copy + fee receipt."},
    {"canteen",     "🍱 Canteen open <b>8 AM – 7 PM</b>. Today's menu: Rice & Curry ₹40, Sandwich ₹30, Fresh Juice ₹25."},
    {"bus",         "🚌 Bus routes: <b>R1</b> City Center departs 7:30 AM · <b>R2</b> North Campus departs 7:45 AM. Evening return: 4:30 PM & 5:15 PM."},
    {"placement",   "💼 Upcoming drives: <b>TCS — Nov 5</b> · <b>Infosys — Nov 12</b>. Eligibility: 7.0 CGPA+, no active backlogs. Register at Placement Cell."},
    {"contact",     "🆘 Emergency contacts: Security <b>1800-111-222</b> · Medical <b>1800-111-333</b> · Admin Office <b>1800-111-444</b>."},
};

std::string askCampus(const std::string& q) {
    std::string l = q; std::transform(l.begin(), l.end(), l.begin(), ::tolower);
    std::map<std::vector<std::string>, std::string> rules = {
        {{"exam","test","midsem","mid sem","mid-semester"}, "exam"},
        {{"library","book","issue"}, "library"},
        {{"bonafide","certificate"}, "bonafide"},
        {{"scholarship","fee waiver","stipend"}, "scholarship"},
        {{"canteen","food","menu","lunch","eat","cafe"}, "canteen"},
        {{"bus","transport","route"}, "bus"},
        {{"placement","internship","job","tcs","infosys","company","recruit"}, "placement"},
        {{"contact","emergency","phone","number","call","help"}, "contact"},
    };
    for (auto& [keys, key] : rules)
        for (auto& k : keys)
            if (l.find(k) != std::string::npos) return campusInfo[key];
    return "🤖 I couldn't find that one. Try asking about <b>exams, library, bonafide, scholarship, canteen, buses, placements</b> or <b>emergency contacts</b>.";
}

// ==================== UI ====================
std::string CSS = R"(
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;min-height:100vh}
.sidebar{width:240px;background:#1e293b;padding:24px 16px;position:fixed;height:100vh;border-right:1px solid #334155;display:flex;flex-direction:column;gap:4px}
.logo{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:700;color:#fff;padding:8px 12px 24px}
.logo span{background:linear-gradient(135deg,#6366f1,#8b5cf6);width:38px;height:38px;border-radius:10px;display:grid;place-items:center;font-size:18px}
.sidebar a{display:flex;align-items:center;gap:12px;color:#94a3b8;text-decoration:none;padding:11px 14px;border-radius:10px;font-size:14.5px;font-weight:500;transition:.2s}
.sidebar a:hover,.sidebar a.active{background:rgba(99,102,241,.15);color:#a5b4fc}
.main{margin-left:240px;flex:1;padding:32px 40px;max-width:1100px}
h1{font-size:26px;font-weight:700;color:#fff;margin-bottom:4px}
.sub{color:#64748b;font-size:14px;margin-bottom:28px}
.grid{display:grid;gap:18px}
.grid2{grid-template-columns:1fr 1fr}
.grid3{grid-template-columns:repeat(3,1fr)}
.card{background:#1e293b;border:1px solid #334155;border-radius:16px;padding:22px;transition:.2s}
.card:hover{border-color:#475569;transform:translateY(-2px)}
.card h2{font-size:16px;color:#fff;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.stat{font-size:28px;font-weight:700;color:#a5b4fc}
.stat small{display:block;font-size:12.5px;color:#64748b;font-weight:500;margin-top:4px}
.pill{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.5px}
.pill.EXAM{background:#7c2d12;color:#fdba74}.pill.HOLIDAY{background:#14532d;color:#86efac}
.pill.DEADLINE{background:#713f12;color:#fde047}.pill.EVENT{background:#1e3a8a;color:#93c5fd}
.item{padding:12px 0;border-bottom:1px solid #334155}
.item:last-child{border:0}
.item b{color:#f1f5f9;font-size:14.5px}.item p{color:#94a3b8;font-size:13px;margin-top:3px}
.item .date{float:right;color:#64748b;font-size:12px}
.badge-ok{color:#4ade80}.badge-warning{color:#facc15}.badge-danger{color:#f87171}
select,input{background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:12px 16px;border-radius:10px;font-size:14px;outline:none;width:100%}
select:focus,input:focus{border-color:#6366f1}
.btn{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:0;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;transition:.2s}
.btn:hover{opacity:.9;transform:translateY(-1px)}
.row{display:flex;gap:10px}
table{width:100%;border-collapse:collapse}
th{text-align:left;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.5px;padding:8px 12px}
td{padding:12px;border-top:1px solid #334155;font-size:14px;color:#cbd5e1}
/* Ask campus chat */
.chat{display:flex;flex-direction:column;gap:12px;margin-top:18px}
.bubble{max-width:80%;padding:14px 18px;border-radius:14px;font-size:14.5px;line-height:1.6}
.user{align-self:flex-end;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-bottom-right-radius:4px}
.bot{align-self:flex-start;background:#334155;color:#e2e8f0;border-bottom-left-radius:4px}
.suggest{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.chip{background:#334155;color:#a5b4fc;border:0;padding:8px 14px;border-radius:99px;font-size:13px;cursor:pointer;transition:.2s}
.chip:hover{background:#6366f1;color:#fff}
@media(max-width:820px){.sidebar{width:64px}.sidebar a span.txt,.logo b{display:none}.main{margin-left:64px;padding:20px}.grid2,.grid3{grid-template-columns:1fr}}
)";

std::string sidebar(const std::string& active) {
    auto link = [&](const std::string& url, const std::string& icon, const std::string& label) {
        std::string cls = (url == active) ? " class='active'" : "";
        return "<a href='" + url + "'" + cls + ">" + icon + "<span class='txt'>" + label + "</span></a>";
    };
    return "<div class='sidebar'><div class='logo'><span>🏛</span><b>Campus</b></div>"
        + link("/", "📊", "Dashboard")
        + link("/timetable", "📅", "Timetable")
        + link("/notices", "🔔", "Announcements")
        + link("/deadlines", "📝", "Deadlines")
        + link("/ask", "💬", "Ask Campus")
        + link("/services", "🏫", "Campus Services")
        + "</div>";
}

std::string shell(const std::string& title, const std::string& active, const std::string& body) {
    std::ostringstream o;
    o << "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>"
      "<title>" << title << "</title><style>" << CSS << "</style></head><body>"
      << sidebar(active) << "<div class='main'>" << body << "</div></body></html>";
    return o.str();
}

std::string esc(const std::string& s) {
    std::string r; for (char c : s) {
        if (c=='<') r+="&lt;"; else if (c=='>') r+="&gt;"; else if (c=='\"') r+="&quot;"; else r+=c;
    } return r;
}

// ==================== PAGES ====================
std::string dashboardPage() {
    std::string b = "<h1>Good morning, Student 👋</h1><p class='sub'>Here's what's happening on campus today.</p>";
    b += "<div class='grid grid3'>"
         "<div class='card'><div class='stat'>4<small>Classes today</small></div></div>"
         "<div class='card'><div class='stat'>3<small>Pending deadlines</small></div></div>"
         "<div class='card'><div class='stat'>2<small>Events this week</small></div></div></div>";
    b += "<div class='grid grid2' style='margin-top:18px'>";
    // Notices
    b += "<div class='card'><h2>🔔 Latest Announcements</h2>";
    for (auto& n : notices)
        b += "<div class='item'><span class='date'>" + n.date + "</span><span class='pill " + n.tag + "'>" + n.tag + "</span><br><b>" + n.title + "</b><p>" + n.detail + "</p></div>";
    b += "</div>";
    // Deadlines
    b += "<div

> ⚠️ The response reached the length limit. Reply **continue** to get the rest.
