# Installation Guide

## For Linux/macOS

```bash
# Step 1: Install frontend dependencies
npm install

# Step 2 (all-in-one command):
npm install && npm run dev & cd src/api && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python3 main.py
```

> 💡 You may want to run the backend commands in a separate terminal window to keep both servers running.

---

## For Windows

```bat
:: Step 1: Install frontend dependencies
npm install

:: Step 2: Start frontend dev server in background (opens new terminal window)
start npm run dev

:: Step 3: Navigate to backend folder
cd src\api

:: Step 4: Create a virtual environment
python -m venv venv

:: Step 5: Activate the virtual environment
venv\Scripts\activate

:: Step 6: Install backend dependencies
pip install -r requirements.txt

:: Step 7: Run the backend server
python main.py
```

> ✅ Use `cmd` or PowerShell. If you're using Git Bash or WSL, refer to the Linux/macOS section.
