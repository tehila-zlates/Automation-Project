# משתמשים בתמונה רשמית של Node עם בסיס דביאן
FROM node:20-bullseye

# מתקינים LibreOffice ומנקים cache של apt להפחתת גודל התמונה
RUN apt-get update && apt-get install -y libreoffice && rm -rf /var/lib/apt/lists/*

# יוצרים תיקייה לפרויקט
WORKDIR /usr/src/app

# מונעים הורדת דפדפן כרום ב-puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_ENV=production

# מעתיקים רק את קבצי התלויות כדי לייעל את הבנייה
COPY package*.json ./

# מתקינים את התלויות
RUN npm install

# מעתיקים את כל הקוד לפרויקט
COPY . .

# פותחים את הפורט שהאפליקציה מאזינה עליו
EXPOSE 3001

# פקודת הרצה
CMD ["node", "index.js"]
