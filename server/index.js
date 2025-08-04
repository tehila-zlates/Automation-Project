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
const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDAzODk5ZmMzNjBkYzA2MDM2ZmNhODJhMGUyZmFlZjlmNjEyNmQzODRhNWJhOGYyOWI3YmM0ODFiMTFkOTQ3YTA1ODQ5ZThkMzkwNjU0MzEiLCJpYXQiOjE3NTQzMTMxNzYuOTI5OTExLCJuYmYiOjE3NTQzMTMxNzYuOTI5OTEyLCJleHAiOjQ5MDk5ODY3NzYuOTI1MTQyLCJzdWIiOiI3MjU2NDgyMCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.foQ4RKiDidHX7vZeHLW0z1_gG5XrvlZJPuHmbhrvDcmIBlWmMqe7p0Xq2aO8zebgJeLt7HQjVKoFYTlsZYHGqIf0AyCp6Ozvou85dfZU4C_fG-2K_AbnFkt8mbtVZZFNZwF31j6eu6Qcx2KDMK0oH8BNA0OEhRTfJSp_Y6eqI1wCMJctBZXBmZNQ7Kqy_c9l_9OQoxJUkcONONF_Tp2nTggOk03YGXXKe0XTC-IbNTMRX42glE4Fq1bRY-MU0df4v8C1BjBEhtU72ZQ6-2w9otXJeE4jBWhgi0NGXizt68klynLSVGoFGneCwwiWFt3AxVm6Zuhp36qbjJVfwHzSEmm5EicKZCVQ65Zc-GWfsgJCoCj3JLHMOa4Kar5NIrcyVvTekaQmJ_uOyQ10HxSZrnrRGqvcPzKp6lV6RZmeqjZ0aLrVp9gFn1NPcE25X6-VRkLeu5xV4ULOG-WbM-jVu3FdaXPgLlOlOjYuU8encX6TIMk9g-ATT_QSkhBFqhpLNc4Ox2uKZZtAe6iTfA0VwnaQqjzRhvifa9GC9Rkc_0Ox_6Nw_pRxSSEO1ewp7GLld2VLxhteUI4H4PMihpQvnQuskOWc3ewNkO7vR5YU6hYObwWRR8A5nTTvrbEev5-731Z5hg3p5RKwnW2XfnqEsjnDdTzWkYZuqRk_oJ_1Iyc');

app.post('/upload', uploadMemory.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { email } = req.body;
    if (!file || !email) return res.status(400).send('Missing file or email');

    let finalFilename = Date.now() + '.pdf';
    const uploadPath = path.join(__dirname, 'uploads', finalFilename);

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // יצירת Job להמרת DOCX ל־PDF
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

      // המתנה לסיום המשימות
      const completedJob = await cloudConvert.jobs.wait(job.id);

      const exportTask = completedJob.tasks.find(
        task => task.name === 'export-file' && task.status === 'finished'
      );

      if (!exportTask || !exportTask.result || !exportTask.result.files || exportTask.result.files.length === 0) {
        return res.status(500).send('Conversion failed - no result');
      }

      const fileUrl = exportTask.result.files[0].url;
      const pdfBuffer = await fetch(fileUrl).then(r => r.arrayBuffer());
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

