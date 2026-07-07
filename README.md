# Smart Task Management System (Backend API)

Production-ready task management engine built with Node.js, TypeScript, Express, and MongoDB.

## 🛠️ Tech Stack & Architecture
* **Language:** TypeScript (Strict Type Safety)
* **Runtime & Framework:** Node.js + Express (ES Modules)
* **Database:** MongoDB + Mongoose ODM (Aggregation Pipeline)
* **Security:** JWT Authentication + Role-Based Access Control (RBAC)
* **Testing:** Jest + ts-jest (Automated ESM Testing Unit Suites)

## 🚀 Key Features Implemented
1. **Authentication & Identity:** Password hashing with bcrypt, token generation, and profile management (`GET` / `PUT` `/api/users/profile`).
2. **Task Operations:** Secure, user-isolated CRUD endpoints with priority levels, custom categories, and due dates.
3. **Role-Based Protection:** Custom access rules allowing administrators (`role: 'admin'`) global data visibility across users and tasks.
4. **Analytics Pipeline:** Efficient MongoDB aggregate pipeline crunching status metrics, urgency counts, and total user productivity data.
5. **Contextual AI Engine:** Intelligent fallback string matching system parsing description content to dynamically assign execution priorities and generate truncated summaries.

## 🚦 Running the System
```bash
# Install all production & development assets
npm install

# Execute automated Jest testing suite
npm run test

# Launch the TypeScript development compilation server
npm run dev
