# AI Petri Dish

A small synthetic ecology playground where AI “colonies” mutate, compete, and adapt in response to environmental variables.

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```

## Run the backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

On Windows PowerShell:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## What it does
- Shows a dish with multiple AI colonies
- Lets you adjust nutrients, chaos, attention, and temperature
- Simulates colony energy and health
- Allows prompt mutation and incubation cycles

## Next ideas
- Connect each colony to a real LLM prompt call
- Add colony branching and extinction rules
- Add a history timeline / evolution graph
- Add a “petri dish” visual with animated growth