"""Generate DigiPermit Role User Stories Test Guide PDF."""
from fpdf import FPDF
from pathlib import Path

OUT = Path(__file__).resolve().parent / "ROLE-USER-STORIES-TEST-GUIDE.pdf"


class GuidePDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(100, 100, 100)
            self.cell(0, 8, "DigiPermit - Role User Stories and Testing Guide", align="C", new_x="LMARGIN", new_y="NEXT")
            self.ln(2)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

    def section_title(self, title: str):
        self.ln(4)
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(21, 101, 192)
        self.multi_cell(0, 8, title)
        self.ln(2)

    def body_text(self, text: str):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5, text)
        self.ln(1)

    def story_table(self, headers, rows, col_widths):
        from fpdf.fonts import FontFace

        heading_style = FontFace(emphasis="B", fill_color=(21, 101, 192), color=(255, 255, 255))
        with self.table(
            width=sum(col_widths),
            col_widths=tuple(col_widths),
            line_height=5,
            text_align="LEFT",
            headings_style=heading_style,
            first_row_as_headings=True,
        ) as table:
            header = table.row()
            for h in headers:
                header.cell(h)
            self.set_font("Helvetica", "", 7)
            self.set_text_color(30, 30, 30)
            for row_data in rows:
                row = table.row()
                for cell in row_data:
                    row.cell(cell)
        self.ln(3)


def build():
    pdf = GuidePDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Cover
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(21, 101, 192)
    pdf.ln(20)
    pdf.set_x(10)
    pdf.multi_cell(190, 10, "DigiPermit", align="C")
    pdf.set_x(10)
    pdf.multi_cell(190, 8, "Role User Stories and Testing Guide", align="C")
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(50, 50, 50)
    pdf.ln(8)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_x(10)
    pdf.multi_cell(190, 6, "Multi-User Foreign-National Visa and Permit\nCompliance Monitoring System", align="C")
    pdf.ln(10)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(80, 80, 80)
    pdf.set_x(10)
    pdf.multi_cell(190, 5, "Capstone: DS3 x IS3 x IP2\nLogin: http://localhost:4200/login\nDemo password (all users): Demo@12345", align="C")
    pdf.ln(8)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_x(10)
    pdf.multi_cell(190, 5, "Limitation: DigiPermit is a compliance-monitoring platform. It does not issue official visas or replace government immigration authorities.", align="C")

    pdf.add_page()
    pdf.section_title("Demo Accounts Quick Reference")
    pdf.story_table(
        ["Role", "Email", "Organisation"],
        [
            ["System Administrator", "admin@digipermit.demo", "Platform-wide"],
            ["Employer HR", "hr@acmeglobal.demo", "Acme Global Industries"],
            ["Foreign National (employee)", "james.okonkwo@demo.mail", "Acme Global"],
            ["Foreign National (employee)", "priya.sharma@demo.mail", "Acme Global"],
            ["University Officer", "international@metrouni.demo", "Metro University"],
            ["Foreign National (student)", "maria.santos@demo.mail", "Metro University"],
            ["Clinic Administrator", "admin@citywellness.demo", "City Wellness Clinic"],
            ["Verification Officer", "verify@digipermit.demo", "Immigration Office (sim.)"],
            ["Immigration Officer", "compliance@digipermit.demo", "Immigration Office (sim.)"],
            ["Manager / Auditor", "audit@natcompliance.demo", "National Compliance"],
        ],
        [52, 58, 80],
    )

    roles = [
        ("1. System Administrator", "Govern the platform - organisations, users, global data, oversight.", [
            ("ADM-01", "See platform-wide statistics", "Login > Dashboard", "Stats cards load"),
            ("ADM-02", "List organisations", "Organisations", "All tenants visible"),
            ("ADM-03", "Create users and assign roles (FR-3.1)", "Users > + Create User", "User created and can log in"),
            ("ADM-04", "View all permits", "All Permits", "WP-2024-ACME-001 etc. listed"),
            ("ADM-05", "View alerts", "Alerts", "Open alerts visible"),
            ("ADM-06", "View verification logs", "Verification Logs", "Audit trail listed"),
            ("ADM-07", "View analytics", "Analytics", "Data sections load"),
            ("ADM-08", "Manage IoT devices", "IoT Devices", "Device list loads"),
        ], "Negative: HR cannot access /admin/users"),
        ("2. Employer HR Officer", "Register employees, capture work visas, monitor org compliance.", [
            ("HR-01", "Org compliance dashboard", "Dashboard", "Employee/visa stats load"),
            ("HR-02", "Register foreign employee", "Foreign Employees > +", "Employee in list"),
            ("HR-03", "Capture work-visa record", "Permit Records > +", "Permit saved with QR"),
            ("HR-04", "Open digital permit document", "Permit Records > doc icon", "QR + PDF/print works"),
            ("HR-05", "Verify permit manually", "Verify Permit > WP-2024-ACME-001", "Result: Valid"),
            ("HR-06", "Review renewal requests", "Renewal Requests", "Approve works"),
            ("HR-07", "View org alerts", "Alerts", "Acme alerts visible"),
        ], "Demo: James WP-2024-ACME-001 (valid), Priya WP-2024-ACME-002 (expiring)"),
        ("3. Foreign National", "Self-service view of own permits - status, QR, notifications.", [
            ("FN-01", "See permit summary", "My Dashboard", "Own permits with badges"),
            ("FN-02", "View all my permits", "My Permits", "Only own records"),
            ("FN-03", "Scannable QR permit document", "View Permit Document", "QR + PDF download"),
            ("FN-04", "Read notifications", "Notifications", "Messages load; mark read"),
            ("FN-05", "View renewal request history", "Update Requests", "Request status shown"),
        ], "Also test maria.santos@demo.mail for study visa. Negative: cannot see others' data"),
        ("4. University Officer", "Manage students and study visas for Metro University.", [
            ("UNI-01", "Student visa dashboard", "Dashboard", "Stats load"),
            ("UNI-02", "List foreign students", "Students", "Maria, Chen, Sofia listed"),
            ("UNI-03", "View study-visa permits", "Study Visas", "SV-2024-METRO-001 etc."),
            ("UNI-04", "Register new student", "Students > register", "New student saved"),
            ("UNI-05", "View institution alerts", "Alerts", "University alerts visible"),
        ], None),
        ("5. Clinic Administrator", "Manage patients and medical-treatment visa records.", [
            ("CLI-01", "Compliance dashboard", "Dashboard", "Stats load"),
            ("CLI-02", "List foreign nationals", "Foreign Nationals", "Ahmed Hassan etc."),
            ("CLI-03", "View permit records", "Permit Records", "MT-2024-CLINIC-001 pending"),
            ("CLI-04", "Capture new permit", "Permit Records > +", "Permit saved"),
        ], "Use MT-2024-CLINIC-001 for immigration validate test"),
        ("6. Verification Officer", "Checkpoint verification - manual, QR, RFID - printable proof.", [
            ("VER-01", "Verification hub", "Verification dashboard", "Manual/QR/RFID buttons"),
            ("VER-02", "Verify by permit number", "Manual > WP-2024-ACME-001", "Valid + certificate"),
            ("VER-03", "Scan QR code", "QR Scan", "Valid result"),
            ("VER-04", "Detect bad documents", "WP-2023-ACME-003 / WP-2024-ACME-004", "Expired / Revoked"),
            ("VER-05", "Download/print certificate", "After verify > PDF/Print", "PDF saves correctly"),
            ("VER-06", "Simulate RFID scan", "RFID > RFID-ACME-001", "Valid + logged"),
            ("VER-07", "View verification logs", "Recent Logs", "Scans in list"),
        ], "Negative: cannot edit permits or manage users"),
        ("7. Immigration Officer (Simulated)", "Review pending records, validate/reject, monitor suspicious activity.", [
            ("IMM-01", "Review dashboard", "Review Dashboard", "Pending counts load"),
            ("IMM-02", "Validate pending permits", "Pending > Validate MT-2024-CLINIC-001", "Permit validated"),
            ("IMM-03", "Reject incorrect records", "Pending > Reject", "Status rejected"),
            ("IMM-04", "View suspicious activity", "Suspicious Records", "Anomalies listed"),
            ("IMM-05", "View compliance alerts", "Alerts", "Critical alerts listed"),
        ], "Academic simulation - not official Home Affairs"),
        ("8. Manager / Auditor", "Read-only executive view - analytics and reports.", [
            ("MGR-01", "Compliance overview", "Analytics", "Summary cards load"),
            ("MGR-02", "AI executive insights", "Reports > Generate Insights", "Risk + recommendations"),
            ("MGR-03", "Raw summary for Power BI", "Reports > Load Summary", "JSON displays"),
            ("MGR-04", "Read-only access only", "Check sidebar", "No CRUD menus"),
        ], "Negative: cannot register employees or create users"),
    ]

    for title, purpose, stories, note in roles:
        pdf.add_page()
        pdf.section_title(title)
        pdf.body_text(f"Purpose: {purpose}")
        if note:
            pdf.set_font("Helvetica", "I", 9)
            pdf.set_text_color(100, 100, 100)
            pdf.multi_cell(0, 5, note)
            pdf.ln(2)
        pdf.story_table(
            ["ID", "User Story", "Test Steps", "Pass If"],
            [(s[0], s[1], s[2], s[3]) for s in stories],
            [14, 52, 52, 72],
        )

    pdf.add_page()
    pdf.section_title("End-to-End Test Sequence")
    pdf.story_table(
        ["Step", "Role", "Story", "Proves"],
        [
            ["1", "Admin", "ADM-03", "Controlled user provisioning"],
            ["2", "HR", "HR-02 + HR-03", "Org onboarding (UC-01)"],
            ["3", "Admin", "ADM-03 link FN", "Self-service login (FR-4.3)"],
            ["4", "Foreign National", "FN-03", "Digital permit + QR"],
            ["5", "Verification Officer", "VER-03 + VER-05", "QR scan + PDF certificate"],
            ["6", "Immigration Officer", "IMM-02", "Pending permit validation"],
            ["7", "Manager", "MGR-02", "Executive oversight"],
            ["8", "Admin", "ADM-06", "Audit trail complete"],
        ],
        [12, 40, 40, 98],
    )

    pdf.section_title("Demo Permit Numbers for Verification")
    pdf.story_table(
        ["Permit Number", "QR Value", "Expected Result"],
        [
            ["WP-2024-ACME-001", "DIGIPERMIT:WP-2024-ACME-001", "valid"],
            ["WP-2024-ACME-002", "DIGIPERMIT:WP-2024-ACME-002", "expiring_soon"],
            ["WP-2023-ACME-003", "DIGIPERMIT:WP-2023-ACME-003", "expired"],
            ["WP-2024-ACME-004", "DIGIPERMIT:WP-2024-ACME-004", "revoked"],
            ["INVALID-999", "n/a", "not_found"],
        ],
        [45, 75, 70],
    )

    pdf.section_title("Test Results Log")
    pdf.body_text("Fill in during testing:")
    pdf.story_table(
        ["Role", "Stories", "Pass", "Fail", "Notes"],
        [
            ["System Admin", "ADM-01 to 08", "", "", ""],
            ["Employer HR", "HR-01 to 07", "", "", ""],
            ["Foreign National", "FN-01 to 05", "", "", ""],
            ["University Officer", "UNI-01 to 05", "", "", ""],
            ["Clinic Admin", "CLI-01 to 04", "", "", ""],
            ["Verification Officer", "VER-01 to 07", "", "", ""],
            ["Immigration Officer", "IMM-01 to 05", "", "", ""],
            ["Manager/Auditor", "MGR-01 to 04", "", "", ""],
        ],
        [40, 30, 18, 18, 84],
    )

    pdf.section_title("Known Limitations")
    pdf.body_text(
        "- Foreign national submit update request: view works; submit form not in UI (API exists).\n"
        "- Email/SMS notifications: in-app only.\n"
        "- Auditor uses same demo account as Manager (audit@natcompliance.demo).\n"
        "- Power BI: SQL views exist; dashboard built in Power BI Desktop."
    )

    pdf.output(str(OUT))
    print(f"Generated: {OUT}")


if __name__ == "__main__":
    build()
