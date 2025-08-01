const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mammoth = require("mammoth");
const nodemailer = require('nodemailer');
const { PDFDocument } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

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

// אם אתה משתמש ב-CommonJS (require)
const CloudConvert = require('cloudconvert');

// או אם אתה משתמש ב-ES Modules (import)
// import CloudConvert from 'cloudconvert';

const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNGU3NTg2NGIyOTAwOGYxNjA0ZWUzOTc0ZGMzYzMxYzcwZWYyNmM3OWM0ZTg1YzYyMDVmZWVlY2EwZTI1NDBhZTNhMTI1MTEyYjFjZDg2YzciLCJpYXQiOjE3NTQwMzMxNTcuODAwMjAzLCJuYmYiOjE3NTQwMzMxNTcuODAwMjA1LCJleHAiOjQ5MDk3MDY3NTcuNzk2MDE3LCJzdWIiOiI3MjU2NDgyMCIsInNjb3BlcyI6WyJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIl19.MiT5tuSyS047YGqNugBkdvZyncWdvWgFNOfPkEPtmA9eAMwX3PKgWyBVe5O-_tyiMefvnfeEbfRkd8b87kPuUFgmZc2U3FzJi6MdlJjxbEOmctrS0t-IrMN_lDRpuo2l1Rjgk9W88OJ6J5dDR7m1L-mX0NG06PWXi2QiQs9e1QA4aqyn93ZDz3deqYvHkiFReGgpJGxcgRT8gEb76SHrawEQ50-wJzK9a19BsucwcEXc8tRMiGO9-g-gQ7tkF_pdgymvqgVvcAScsEmLw9S8-TFbvKxhvu5Jf_feTKm4SbC-4kPEp6hGWzPrv_ZVOr8gzXtinBzEx7_9Vt5AhQwfOa7CNbomi83mkLC8nMyt7eXs8G8zk5muo1OEgPCT7uIamb-CAaYuIxC6cZGBj3HzwCmOZ8Nfjk1V3y2QE2k7n0hbXzhhXXwhkJ9cP2wxIKAZ76415TKaydmVRVY_TUce14hQ3I79JoJ8aGiVOJhaJDs_POA8mhqP1UR2niyg5kW3qmEW6lwRdZCFEHkYbuRqqay9-i3VzQ6kvBl5pVKfaFwfSDudpX5iCqEqO3Y_N1DTp8q0TjRW6SnQjCwVWxLHLR33R6IYgPdRRV3HXGJuoYfJxC0C26tnNW8_oL8C-5zs-fuUNiCFMc-cqCRqEN4yUgwFhBUA7Dj48vQOSZ4Cjew');

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

app.post('/upload', uploadMemory.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { email } = req.body;
    if (!file || !email) return res.status(400).send('Missing file or email');

    let finalFilename = Date.now() + '.pdf';
    const uploadPath = path.join(__dirname, 'uploads', finalFilename);

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // המרת DOCX ל-PDF עם CloudConvert
      const job = await cloudConvert.jobs.create({
        tasks: {
          'import-my-file': {
            operation: 'import/upload'
          },
          'convert-my-file': {
            operation: 'convert',
            input: 'import-my-file',
            input_format: 'docx',
            output_format: 'pdf'
          },
          'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file'
          }
        }
      });

      const uploadTask = job.tasks.filter(
        task => task.name === 'import-my-file'
      )[0];

      // העלאת הקובץ ל-CloudConvert
      await cloudConvert.tasks.upload(uploadTask, file.buffer, file.originalname);

      // המתנה לסיום ההמרה
      const completedJob = await cloudConvert.jobs.wait(job.id);

      // קבלת הקובץ שהומר
      const exportTask = completedJob.tasks.filter(
        task => task.operation === 'export/url' && task.status === 'finished'
      )[0];

      const fileUrl = exportTask.result.files[0].url;

      // הורדת הקובץ למערכת המקומית
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();

      fs.writeFileSync(uploadPath, buffer);

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

// app.listen(3001, () => {
//   console.log('Server running at http://localhost:3001');
// });

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

