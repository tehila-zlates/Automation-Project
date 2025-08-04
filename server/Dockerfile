# השתמש בבסיס של Node.js (גרסה עדכנית, לדוגמה 18)
FROM node:18-slim

# התקן חבילות דרושות להפעלת LibreOffice
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-dejavu \
    && rm -rf /var/lib/apt/lists/*

# יצירת תיקיית עבודה
WORKDIR /app

# העתק את package.json ו package-lock.json (אם יש)
COPY package*.json ./

# התקן את התלויות
RUN npm install

# העתק את כל הקוד לתוך המכולה
COPY . .

# חשוף פורט 3001 (או מה שהשרת שלך משתמש בו)
EXPOSE 3001

# הפעלת השרת
CMD ["node", "index.js"]
