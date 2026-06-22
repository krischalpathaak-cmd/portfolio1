# Create a Git Repository from Terminal

## 1. Initialize local repo
```powershell
git init
git add .
git commit -m "Initial commit"
```

## 2. Create remote repo on GitHub (via CLI)

### Option A — Using GitHub CLI (gh):
```powershell
gh repo create <repo-name> --public --source=. --remote=origin --push
```

### Option B — Using curl (REST API):
```powershell
curl -u "YOUR_USERNAME" https://api.github.com/user/repos -d "{\"name\":\"<repo-name>\",\"public\":true}"
git remote add origin https://github.com/YOUR_USERNAME/<repo-name>.git
git branch -M main
git push -u origin main
```

## 3. Subsequent pushes
```powershell
git add .
git commit -m "message"
git push
```
