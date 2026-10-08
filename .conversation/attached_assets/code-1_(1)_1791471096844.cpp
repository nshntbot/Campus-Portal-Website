    // Deadlines card
    b += "<div class='card'><h2>📝 Upcoming Deadlines</h2>";
    for (auto& d : deadlines) {
        std::string color = d.second == "danger" ? "badge-danger" : d.second == "warning" ? "badge-warning" : "badge-ok";
        b += "<div class='item'><b>" + d.first + "</b><span class='date " + color + "'>● " + d.second + "</span></div>";
    }
    b += "</div></div>";
    // Quick ask banner
    b += "<div class='card' style='margin-top:18px;background:linear-gradient(135deg,#312e81,#1e1b4b)'>"
         "<h2>💬 Ask Campus</h2><p style='color:#a5b4fc;font-size:14px;margin-bottom:14px'>Ask anything about campus — exams, library, buses, contacts.</p>"
         "<a href='/ask'><button class='btn'>Open Ask Campus →</button></a></div>";
    return shell("Dashboard", "/", b);
}

std::string timetablePage(const std::string& section) {
    std::string b = "<h1>📅 Today's Timetable</h1><p class='sub'>Select your section to see today's classes.</p>"
        "<div class='card'><form method='get' class='row'>"
        "<select name='section'><option value=''>Select section…</option><option" + std::string(section=="CSE-A"?" selected":"") + ">CSE-A</option><option" + std::string(section=="CSE-B"?" selected":"") + ">CSE-B</option></select>"
        "<button class='btn' style='width:auto'>Show</button></form>";
    if (timetables.count(section)) {
        b += "<table style='margin-top:18px'><tr><th>Time</th><th>Subject</th><th>Room</th><th>Faculty</th></tr>";
        std::stringstream ss(timetables[section]); std::string row;
        while (std::getline(ss, row, ';')) {
            std::stringstream r(row); std::string t, s, room, f;
            std::getline(r, t, '|'); std::getline(r, s, '|'); std::getline(r, room, '|'); std::getline(r, f, '|');
            b += "<tr><td><b>" + t + "</b></td><td>" + s + "</td><td>" + room + "</td><td>" + f + "</td></tr>";
        }
        b += "</table>";
    } else if (!section.empty()) {
        b += "<p style='margin-top:14px;color:#f87171'>No timetable found for that section.</p>";
    }
    b += "</div>";
    return shell("Timetable", "/timetable", b);
}

std::string noticesPage() {
    std::string b = "<h1>🔔 Announcements</h1><p class='sub'>Exams, holidays, deadlines and events.</p>";
    for (auto& n : notices)
        b += "<div class='card' style='margin-bottom:14px'><span class='pill " + n.tag + "'>" + n.tag + "</span>"
             "<b style='display:block;margin-top:10px;font-size:16px;color:#fff'>" + n.title + "</b>"
             "<p style='color:#94a3b8;font-size:14px;margin-top:6px'>" + n.detail + "</p>"
             "<p style='color:#64748b;font-size:12px;margin-top:8px'>Posted " + n.date + "</p></div>";
    return shell("Announcements", "/notices", b);
}

std::string deadlinesPage() {
    std::string b = "<h1>📝 Assignment & Deadline Tracker</h1><p class='sub'>Keep track of what's due and when.</p><div class='card'>";
    b += "<table><tr><th>Task</th><th>Due Date</th><th>Status</th></tr>";
    for (auto& d : deadlines) {
        std::string color = d.second == "danger" ? "badge-danger" : d.second == "warning" ? "badge-warning" : "badge-ok";
        std::string status = d.second == "danger" ? "URGENT" : d.second == "warning" ? "Due soon" : "On track";
        b += "<tr><td><b>" + d.first + "</b></td><td>" + d.second + "</td><td><span class='" + color + "'>● " + status + "</span></td></tr>";
    }
    b += "</table></div>";
    return shell("Deadlines", "/deadlines", b);
}

std::string askPage(const std::string& q, const std::string& answer) {
    std::string b = "<h1>💬 Ask Campus</h1><p class='sub'>Instant answers from approved university information.</p><div class='card'>"
        "<form method='get' class='row'><input name='q' placeholder='e.g. When does the library close?' value='" + esc(q) + "'>"
        "<button class='btn' style='width:auto'>Ask 🤖</button></form>";
    if (!q.empty()) {
        b += "<div class='chat'><div class='bubble user'>" + esc(q) + "</div><div class='bubble bot'>" + answer + "</div></div>";
    }
    b += "<div class='suggest'>"
         "<button class='chip' onclick=\"location='/ask?q=When is my next exam?'\">When is my next exam?</button>"
         "<button class='chip' onclick=\"location='/ask?q=Where do I submit my scholarship form?'\">Scholarship form?</button>"
         "<button class='chip' onclick=\"location='/ask?q=When does the library close?'\">Library hours?</button>"
         "<button class='chip' onclick=\"location='/ask?q=Who do I contact for a bonafide certificate?'\">Bonafide certificate?</button>"
         "<button class='chip' onclick=\"location='/ask?q=What time does the canteen open?'\">Canteen timings?</button>"
         "</div></div>";
    return shell("Ask Campus", "/ask", b);
}

std::string servicesPage() {
    struct S { std::string icon, name, info; };
    std::vector<S> svc = {
        {"📚", "Library", "Hours: 8 AM – 9 PM (weekdays). 4 books, 14 days."},
        {"🍱", "Canteen", "8 AM – 7 PM · Rice ₹40 · Sandwich ₹30 · Juice ₹25."},
        {"🚌", "Transport", "R1 City Center 7:30 AM · R2 North Campus 7:45 AM."},
        {"🆘", "Emergency", "Security 1800-111-222 · Medical 1800-111-333 · Admin 1800-111-444."},
        {"💼", "Placement Cell", "Drives: TCS Nov 5 · Infosys Nov 12 · Register at Placement Cell."},
        {"🎓", "Registrar Office", "Admin Block Rm 12 · Bonafide ₹50 · Scholarships due Oct 25."},
    };
    std::string b = "<h1>🏫 Campus Services</h1><p class='sub'>Everything you need, one place.</p><div class='grid grid3'>";
    for (auto& s : svc)
        b += "<div class='card'><h2>" + s.icon + " " + s.name + "</h2><p style='color:#94a3b8;font-size:13.5px;line-height:1.6'>" + s.info + "</p></div>";
    b += "</div>";
    return shell("Services", "/services", b);
}

// ==================== ROUTES ====================
int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([] { return dashboardPage(); });

    CROW_ROUTE(app, "/timetable")
    .methods("GET"_method)([](const crow::request& req) {
        std::string s = req.url_params.get("section") ? req.url_params.get("section") : "";
        return timetablePage(s);
    });

    CROW_ROUTE(app, "/notices")([] { return noticesPage(); });
    CROW_ROUTE(app, "/deadlines")([] { return deadlinesPage(); });

    CROW_ROUTE(app, "/ask")
    .methods("GET"_method)([](const crow::request& req) {
        std::string q = req.url_params.get("q") ? req.url_params.get("q") : "";
        return askPage(q, q.empty() ? "" : askCampus(q));
    });

    CROW_ROUTE(app, "/services")([] { return servicesPage(); });

    app.port(18080).multithreaded().run();
}
