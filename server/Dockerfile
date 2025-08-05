# משתמשים בתמונה רשמית של Node עם בסיס דביאן
FROM node:18-bullseye

# מתקינים LibreOffice
RUN apt-get update && apt-get install -y libreoffice

# יוצרים תיקייה לפרויקט
WORKDIR /usr/src/app

# מעתיקים את package.json ו-package-lock.json
COPY package*.json ./

# מתקינים תלותיות
RUN npm install

# מעתיקים את כל הקוד לתוך הקונטיינר
COPY . .

# מגדירים את הפורט שהאפליקציה מאזינה עליו
EXPOSE 3001

# פקודת הרצה
CMD ["node", "index.js"]
