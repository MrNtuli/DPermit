# GitHub Setup Guide (DS3)

## 1. Create repository

1. Go to [github.com/new](https://github.com/new)
2. Name: `digipermit` or `DPermit`
3. Visibility: Private (or Public if required by institution)
4. Do **not** initialise with README (project already has one)

## 2. Initialise and push (run in project root)

```powershell
cd c:\Users\Lenovo\Desktop\DPermit
git init
git add .
git commit -m "feat: initial DigiPermit capstone delivery — full-stack compliance system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/digipermit.git
git push -u origin main
```

## 3. Meaningful commit convention (for sprint marks)

Use conventional commits aligned to sprints:

```
feat(backend): sprint 1 — database migrations and auth API
feat(backend): sprint 2 — verification engine and IoT endpoints
feat(frontend): sprint 3 — role dashboards and verification UI
docs: sprint 4 — final report, test plan, presentation deck
fix(cors): allow localhost 4200 for Ionic dev server
```

## 4. Branch strategy (optional)

- `main` — stable demo-ready code
- `develop` — integration branch
- `feature/sprint-N-description` — sprint work

## 5. What NOT to commit

- `digipermit-backend/.env` (contains secrets — already in `.gitignore`)
- `node_modules/`

## 6. Evidence for DS3 marks

- Screenshot of commit history showing multiple sprint commits
- Link to repository in final report
- Each team member linked as collaborator with visible contributions

## 7. Release tag for demo

```powershell
git tag -a v1.0.0-demo -m "Release ready for Week 6 final demonstration"
git push origin v1.0.0-demo
```
