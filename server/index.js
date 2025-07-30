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

app.post('/upload', uploadMemory.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { email } = req.body;
    if (!file || !email) return res.status(400).send('Missing file or email');

    let finalFilename = Date.now() + '.pdf';
    const uploadPath = path.join(__dirname, 'uploads', finalFilename);

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.convertToHtml({ buffer: file.buffer });
      const text = result.value.replace(/<[^>]+>/g, '');

      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const font = await pdfDoc.embedFont(fs.readFileSync(path.join(__dirname, 'fonts', 'Alef-Regular.ttf')));
      const page = pdfDoc.addPage([595.28, 841.89]);

      page.drawText(text, {
        x: 50, y: page.getHeight() - 50,
        size: 14, font, maxWidth: 495, lineHeight: 20,
      });

      fs.writeFileSync(uploadPath, await pdfDoc.save());
    } else if (file.mimetype === 'application/pdf') {
      finalFilename = Date.now() + '-' + file.originalname;
      fs.writeFileSync(path.join(__dirname, 'uploads', finalFilename), file.buffer);
    } else {
      return res.status(400).send('Unsupported file type');
    }

    emailMap.set(finalFilename, email);

const baseUrl = `http://localhost:3001` || 'https://automation-project-server.onrender.com';
const clientUrl =  `http://localhost:3000` || 'https://automation-digital-sign-flow.onrender.com';

res.json({
  fileUrl: `https://automation-project-server.onrender.com/uploads/${finalFilename}`,
  signPageUrl: `https://automation-digital-sign-flow.onrender.com/sign/${finalFilename}`
});

    // res.json({
    //   fileUrl: `http://localhost:3001/uploads/${finalFilename}`,
    //   signPageUrl: `http://localhost:3000/sign/${finalFilename}`
    // });
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

const port = process.env.PORT || 3001;
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

// const emailMap = new Map();
// const fileBufferMap = new Map();

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

// // Endpoint להורדת קובץ מהזיכרון לפי שם
// app.get('/file/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const buffer = fileBufferMap.get(filename);
//   if (!buffer) {
//     return res.status(404).send('File not found');
//   }

//   // אפשר להוסיף Content-Type דינמי לפי סיומת אם רוצים
//   res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//   res.send(buffer);
// });

// app.post('/upload', uploadMemory.single('file'), async (req, res) => {
//   try {
//     const { file } = req;
//     const { email } = req.body;
//     if (!file || !email) return res.status(400).send('Missing file or email');

//     let finalFilename = Date.now() + '.pdf';
//     let finalBuffer;

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

//       finalBuffer = await pdfDoc.save();
//     } else if (file.mimetype === 'application/pdf') {
//       finalFilename = Date.now() + '-' + file.originalname;
//       finalBuffer = file.buffer;
//     } else {
//       return res.status(400).send('Unsupported file type');
//     }

//     // שמירת הקובץ בזיכרון במפה
//     fileBufferMap.set(finalFilename, finalBuffer);
//     emailMap.set(finalFilename, email);

//    const baseUrl = `http://localhost:3001` || 'https://automation-project-server.onrender.com';
// const clientUrl =  `http://localhost:3000` || 'https://your-frontend.vercel.app';

// res.json({
//   fileUrl: `${baseUrl}/uploads/${finalFilename}`,
//   signPageUrl: `${clientUrl}/sign/${finalFilename}`
// });

//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.post('/signed/:filename', uploadDisk.single('signed'), async (req, res) => {
//   try {
//     const signedImagePath = path.join(__dirname, 'uploads', req.file.filename);
//     const originalFilename = decodeURIComponent(req.params.filename);

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

// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
