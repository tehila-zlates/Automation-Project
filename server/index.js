const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mammoth = require("mammoth");
const nodemailer = require('nodemailer');
const { PDFDocument } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const axios = require('axios'); // צריך להוסיף את זה בהתחלה בקובץ
const { exec } = require('child_process');
const CloudConvert = require('cloudconvert');

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const emailMap = new Map();

const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploadDisk = multer({ storage: diskStorage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 't3265137@gmail.com',
    pass: 'updj gcqq jxnh krjj'
  }
});

// app.post('/upload', uploadMemory.single('file'), async (req, res) => {
//   try {
//     const { file } = req;
//     const { email } = req.body;
//     if (!file || !email) return res.status(400).send('Missing file or email');

//     let finalFilename = Date.now() + '.pdf';
//     const uploadPath = path.join(__dirname, 'uploads', finalFilename);

//     if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//       const result = await mammoth.convertToHtml({ buffer: file.buffer });
//       const text = result.value.replace(/<[^>]+>/g, '');

//       const pdfDoc = await PDFDocument.create();
//       pdfDoc.registerFontkit(fontkit);
//       const font = await pdfDoc.embedFont(fs.readFileSync(path.join(__dirname, 'fonts', 'Alef-Regular.ttf')));
//       const page = pdfDoc.addPage([595.28, 841.89]);

//       page.drawText(text, {
//         x: 50, y: page.getHeight() - 50,
//         size: 14, font, maxWidth: 495, lineHeight: 20,
//       });

//       fs.writeFileSync(uploadPath, await pdfDoc.save());
//     } else if (file.mimetype === 'application/pdf') {
//       finalFilename = Date.now() + '-' + file.originalname;
//       fs.writeFileSync(path.join(__dirname, 'uploads', finalFilename), file.buffer);
//     } else {
//       return res.status(400).send('Unsupported file type');
//     }

//     emailMap.set(finalFilename, email);

//     const baseUrl = `http://localhost:3001` || 'https://automation-project-server.onrender.com';
//     const clientUrl = `http://localhost:3000` || 'https://automation-digital-sign-flow.onrender.com';

//     res.json({
//       fileUrl: `https://automation-project-server.onrender.com/uploads/${finalFilename}`,
//       signPageUrl: `https://automation-digital-sign-flow.onrender.com/sign/${finalFilename}`,
//       filename: finalFilename
//     });

//     // res.json({
//     //   fileUrl: `http://localhost:3001/uploads/${finalFilename}`,
//     //   signPageUrl: `http://localhost:3000/sign/${finalFilename}`
//     // });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.post('/upload', uploadMemory.single('file'), async (req, res) => {
//   try {
//     const { file } = req;
//     const { email } = req.body;
//     if (!file || !email) return res.status(400).send('Missing file or email');

//     const uploadsDir = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir);
//     }

//     let finalFilename;
//     let uploadPath;

//     if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//       // שמירת קובץ docx זמני
//       const tempDocxName = Date.now() + '-' + file.originalname;
//       const tempDocxPath = path.join(uploadsDir, tempDocxName);
//       fs.writeFileSync(tempDocxPath, file.buffer);

//       // שם הקובץ PDF שיווצר
//       finalFilename = tempDocxName.replace(/\.docx$/, '.pdf');
//       uploadPath = path.join(uploadsDir, finalFilename);

//       // הפעלת הפקודה להמרה ל-PDF עם LibreOffice
//       await new Promise((resolve, reject) => {
//         const command = `soffice --headless --convert-to pdf --outdir "${uploadsDir}" "${tempDocxPath}"`;
//         exec(command, (error, stdout, stderr) => {
//           if (error) {
//             console.error('LibreOffice error:', stderr);
//             reject(stderr || error);
//           } else {
//             resolve();
//           }
//         });
//       });

//       // מחיקת הקובץ הזמני docx
//       fs.unlinkSync(tempDocxPath);

//       // בדיקה שה-PDF נוצר
//       if (!fs.existsSync(uploadPath)) {
//         return res.status(500).send('Conversion to PDF failed');
//       }
//     } else if (file.mimetype === 'application/pdf') {
//       finalFilename = Date.now() + '-' + file.originalname;
//       uploadPath = path.join(uploadsDir, finalFilename);
//       fs.writeFileSync(uploadPath, file.buffer);
//     } else {
//       return res.status(400).send('Unsupported file type');
//     }

//     emailMap.set(finalFilename, email);

//     res.json({
//       fileUrl: `https://automation-project-server.onrender.com/uploads/${finalFilename}`,
//       signPageUrl: `https://automation-digital-sign-flow.onrender.com/sign/${finalFilename}`,
//       filename: finalFilename
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).send('Internal Server Error');
//   }
// });
const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTM5NmIzZDIyYjFmOGNmZTQ2N2QzMmE0MTJiODQ5OGYyZTM0Zjk5NTgzNDVjMTlmMzFiZTUxYzQ3Y2ZjNzY2NzZkZDY4MWI4NDM5YzExZjMiLCJpYXQiOjE3NTQzMTA3NDcuODM1MTE5LCJuYmYiOjE3NTQzMTA3NDcuODM1MTIsImV4cCI6NDkwOTk4NDM0Ny44Mjk2MjgsInN1YiI6IjcyNTY0ODIwIiwic2NvcGVzIjpbInVzZXIud3JpdGUiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSIsInByZXNldC5yZWFkIiwicHJlc2V0LndyaXRlIiwidXNlci5yZWFkIl19.Qq4xtLSi3VKdcnU_fOO6nezuQtVM4oohoZyJbh1tj6tVwGzozFIvfRxIS2r0osN-plE7zr9jlpPoRuoE5N455Aqj99tZYlN_V0dpYSG5Z2A0kaELZtok5M6OX9Aw8-ot_IYqAEs9EM-jnRZImOBoHS0BLJp4-WscBJPXm0PP4xutpGXrTzJ5_XuC0AzDYe72FoyDXxPTldPt7emHJBRz35tLcUvkyKtnRt0rK4n9844k5VKXkrgB97XwibIST4IWtj1lmcguVpu01U3WoRe54bfkyGLeuyFgFwGD9Qh2Xo1MfhgmqWJuJWfJyjOh0cxE4-poX5yy3Z-wYQBjUZybq6tNUK7sPwFBYCnZyBXluEEkB4xrvxtlZbt8TaUcDTtlCVMI8q1Cml34QntnNtxkoByVaos4M-rTzTESx9QY551G7OMwFK09Dj_SgIlGl1SCBEVlWYmxS3cY42QL5IN23ITKMuJhfW2oqcKt7Wl5HGODkA6TIMEbEwIjPSlMvgY9J6L5EvUSDghBXeE9BgUcXP21-1lenmCRgQcUwU0VmI1E2kVL0YLP06490OZfAmlc0LJR7Mgb2a5b5FFbrE6oADi9gcnjw_Cf3ndewZB33XJ8pnE0IRDDwGn_ren2G2qlnvILPhE6q4PN1bIVuLSgE5tfgGLMGwOMFR9gEAeQgy8');

app.post('/upload', uploadMemory.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { email } = req.body;
    if (!file || !email) return res.status(400).send('Missing file or email');

    let finalFilename = Date.now() + '.pdf';
    const uploadPath = path.join(__dirname, 'uploads', finalFilename);

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // שימוש ב-CloudConvert
      const job = await cloudConvert.jobs.create({
        tasks: {
          'upload-file': {
            operation: 'import/base64',
            file: file.buffer.toString('base64'),
            filename: file.originalname
          },
          'convert-file': {
            operation: 'convert',
            input: 'upload-file',
            input_format: 'docx',
            output_format: 'pdf'
          },
          'export-file': {
            operation: 'export/url',
            input: 'convert-file'
          }
        }
      });

      const exportTask = job.tasks.filter(task => task.name === 'export-file')[0];
      const fileUrl = exportTask.result.files[0].url;

      const pdfBuffer = await fetch(fileUrl).then(res => res.arrayBuffer());
      fs.writeFileSync(uploadPath, Buffer.from(pdfBuffer));

    } else if (file.mimetype === 'application/pdf') {
      finalFilename = Date.now() + '-' + file.originalname;
      fs.writeFileSync(path.join(__dirname, 'uploads', finalFilename), file.buffer);
    } else {
      return res.status(400).send('Unsupported file type');
    }

    emailMap.set(finalFilename, email);

    res.json({
      fileUrl: `https://automation-project-server.onrender.com/uploads/${finalFilename}`,
      signPageUrl: `https://automation-digital-sign-flow.onrender.com/sign/${finalFilename}`,
      filename: finalFilename
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/signed/:filename', uploadDisk.single('signed'), async (req, res) => {
  try {
    const signedImagePath = path.join(__dirname, 'uploads', req.file.filename);
    const originalFilename = decodeURIComponent(req.params.filename);

    let signatureBytes;

    if (req.file.mimetype.startsWith('image/')) {
      const signaturePdf = await PDFDocument.create();
      const page = signaturePdf.addPage([595.28, 841.89]);
      const imgBytes = fs.readFileSync(signedImagePath);
      const image = req.file.mimetype === 'image/png'
        ? await signaturePdf.embedPng(imgBytes)
        : await signaturePdf.embedJpg(imgBytes);

      page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
      signatureBytes = await signaturePdf.save();
    } else if (req.file.mimetype === 'application/pdf') {
      signatureBytes = fs.readFileSync(signedImagePath);
    } else {
      return res.status(400).send('Unsupported signature type');
    }

    const signedFilename = originalFilename.replace('.pdf', '_signed.pdf');
    const signedPath = path.join(__dirname, 'uploads', signedFilename);
    fs.writeFileSync(signedPath, signatureBytes);

    const email = emailMap.get(originalFilename);
    if (!email) return res.status(400).send('Email not found for this file');

    await transporter.sendMail({
      from: 't3265137@gmail.com',
      to: email,
      subject: 'המסמך החתום שלך',
      text: 'המסמך החתום מצורף כאן.',
      attachments: [{ filename: signedFilename, path: signedPath }]
    });

    fs.unlinkSync(signedImagePath);
    res.send({ success: true });

  } catch (err) {
    console.error('Signing error:', err);
    res.status(500).send('Error while processing signed file');
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const mammoth = require("mammoth");
// const nodemailer = require('nodemailer');
// const { PDFDocument } = require('pdf-lib');
// const fontkit = require('@pdf-lib/fontkit');

// const app = express();
// app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use((req, res, next) => {
//   if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
//     res.sendFile(path.join(__dirname, 'digital-sign-flow/build', 'index.html'));
//   } else {
//     next();
//   }
// });

// const emailMap = new Map();

// const memoryStorage = multer.memoryStorage();
// const uploadMemory = multer({ storage: memoryStorage });

// const diskStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });
// const uploadDisk = multer({ storage: diskStorage });

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 't3265137@gmail.com',
//     pass: 'updj gcqq jxnh krjj'
//   }
// });



// app.post('/upload', uploadMemory.single('file'), async (req, res) => {
//   try {
//     const { file } = req;
//     const { email } = req.body;
//     if (!file || !email) return res.status(400).send('444');

//     let finalFilename = Date.now() + '.pdf';
//     const uploadPath = path.join(__dirname, 'uploads', finalFilename);

//     if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//       const result = await mammoth.convertToHtml({ buffer: file.buffer });
//       const text = result.value.replace(/<[^>]+>/g, '');

//       const pdfDoc = await PDFDocument.create();
//       pdfDoc.registerFontkit(fontkit);
//       const font = await pdfDoc.embedFont(fs.readFileSync(path.join(__dirname, 'fonts', 'Alef-Regular.ttf')));
//       const page = pdfDoc.addPage([595.28, 841.89]);

//       page.drawText(text, {
//         x: 50, y: page.getHeight() - 50,
//         size: 14, font, maxWidth: 495, lineHeight: 20,
//       });

//       fs.writeFileSync(uploadPath, await pdfDoc.save());
//     } else if (file.mimetype === 'application/pdf') {
//       finalFilename = Date.now() + '-' + file.originalname;
//       fs.writeFileSync(path.join(__dirname, 'uploads', finalFilename), file.buffer);
//     } else {
//       return res.status(400).send('333');
//     }
//     const CLIENT_URL = 'https://automation-digital-sign-flow.onrender.com'; // כתובת של השרת שלך בענן
//     const SERVER_URL = 'https://automation-project-server.onrender.com'; // כתובת של השרת שלך בענן

//     emailMap.set(finalFilename, email);
//     res.json({
//   fileUrl: `https://automation-project-server.onrender.com/uploads/${finalFilename}`, 
//   signPageUrl: `https://automation-digital-sign-flow.onrender.com/sign/${finalFilename}`
// });
//   } catch (err) {
//     console.error("222", err);
//     res.status(500).send('111');
//   }
// });

// app.post('/signed/:filename', uploadDisk.single('signed'), async (req, res) => {
//   try {
//     const signedImagePath = path.join(__dirname, 'uploads', req.file.filename);
//     const originalFilename = decodeURIComponent(req.params.filename);
//     const originalPdf = await PDFDocument.load(fs.readFileSync(path.join(__dirname, 'uploads', originalFilename)));


//     let signatureBytes;

//     if (req.file.mimetype.startsWith('image/')) {
//       const signaturePdf = await PDFDocument.create();
//       const page = signaturePdf.addPage([595.28, 841.89]);
//       const imgBytes = fs.readFileSync(signedImagePath);
//       const image = req.file.mimetype === 'image/png'
//         ? await signaturePdf.embedPng(imgBytes)
//         : await signaturePdf.embedJpg(imgBytes);

//       page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
//       signatureBytes = await signaturePdf.save();
//     } else if (req.file.mimetype === 'application/pdf') {
//       signatureBytes = fs.readFileSync(signedImagePath);
//     } else {
//       return res.status(400).send('Unsupported signature type');
//     }

//     const signedFilename = originalFilename.replace('.pdf', '_signed.pdf');
//     const signedPath = path.join(__dirname, 'uploads', signedFilename);
//     fs.writeFileSync(signedPath, signatureBytes);

//     const email = emailMap.get(originalFilename);
//     if (!email) return res.status(400).send('Email not found for this file');

//     await transporter.sendMail({
//       from: 't3265137@gmail.com',
//       to: email,
//       subject: 'המסמך החתום שלך',
//       text: 'המסמך החתום מצורף כאן.',
//       attachments: [{ filename: signedFilename, path: signedPath }]
//     });

//     fs.unlinkSync(signedImagePath);
//     res.send({ success: true });

//   } catch (err) {
//     console.error('Signing error:', err);
//     res.status(500).send('Error while processing signed file');
//   }
// });

// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).send('Internal Server Error');
// });

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // app.listen(3001, () => {
// //   console.log('Server running at http://localhost:3001');
// // });

// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

