### Database Seeded and Server Instructions

I have created a seeding mechanism for your MongoDB collections and prepared instructions for running your backend server continuously.

### ✅ Seed Data Created
I created a new directory `backend/seeds/` and a script `seed_db.py` to populate your database.

- **Directory:** `backend/seeds/`
- **Script:** `backend/seeds/seed_db.py`
- **Action Taken:** Executed the script which successfully inserted sample data into the `predictions` collection with types `crop_prediction`, `soil_prediction`, and `plant_prediction`.

### 🚀 How to Run Your Backend Server

To keep your backend server running, you have a few options depending on your needs:

#### 1. Standard Terminal (Development)
The simplest way is to open a dedicated terminal window, navigate to the `backend` folder, and run:
```powershell
cd backend
python main.py
```
This will start the server on `http://localhost:5000`. It will stay open as long as the terminal is active.

#### 2. Background Process (Windows PowerShell)
If you want to run it in the background so it doesn't block your terminal:
```powershell
Start-Job -ScriptBlock { cd C:\Users\USER\Herd\agro_ai_project\backend; python main.py }
```
*Note: You can check if it's running using `Get-Job` and stop it with `Stop-Job`.*

#### 3. Using a Process Manager (Recommended for "Always Open")
For a more robust "always open" setup, I recommend using **PM2** (if you have Node.js installed) which can automatically restart the server if it crashes:
```bash
# Install PM2 globally
npm install -g pm2

# Start the backend
pm2 start backend/main.py --name agro-backend

# To see logs
pm2 logs agro-backend
```

### 🛠️ Next Steps
- You can now go to the **History** sections of your frontend app to see the seeded data being displayed.
- The app is now fully connected with a populated database, ready for further testing or model training!