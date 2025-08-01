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
const CloudConvert = require('cloudconvert');
const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZmIyMDQyNTFkZDRhMGFkZTI5MmY3MDlmNDgzMThhZTkzN2YyMTkzZDEyNDUxNDZhMjdlNmZkNjJkOThjYTcwM2YxYzRhYTA1YTU1ZDJiODMiLCJpYXQiOjE3NTQwMzQ3NjUuNTk0OTc2LCJuYmYiOjE3NTQwMzQ3NjUuNTk0OTc3LCJleHAiOjQ5MDk3MDgzNjUuNTkwMTA2LCJzdWIiOiI3MjU2NDgyMCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQud3JpdGUiXX0.KO4g3PL0nolwXxtyNwiUmmcHnZDmZHyjsDxfp075GzcHRPfcaJ_tyAUaahipgoyU9Z7AQrdtVl5Bs6J5e3mnBGXBbDdeVYsx0LvqQ8UqxTOWyrYdl3lzmgBaUMvHGx3x7DAxBbVtzMgkGSrGvQp-TUdzzE7tArwR5owcnw4YPXBVrHzW0PJfVo6jZiBmUjPjoDB3cQP0u0kNTV5FJLz1rhwR3r7DgZQaJnnoI0cxB9j1ToPmncGRHCQIEarNeM0VjgHbQDgi0rVmIPg0xRaCUbmtdS7udX791ZTxNsU9VJ1gayeje_t72tpbhKiGrYfJxLD96MAKL8NsFUeUCVI74j0FQbfndiWB6cOFBqU64LofW09iiuzKOqXeMY2wroET6IZ0wJMkBMph1zc9AmGHq14ZUHxW9x08qbIYoXSvyV4wNgW36UBCTuisJpfwl_8UqIUwyTZZ7cBuk8raTHIzCo_dO1FA2itM-ftfu5K8lxuJiHlO-IbYw4Q7WdWlgWz1DO19e3y3KlBznUDV8pj9uDencq8ue0pZajKtfAni6HcJBj-_IeJpQDAKKOH4-TMfzrWCSM6_ILcHGlgNJkuhm3hrEO2XmnezZzOa7Gw5P_AnK7NY3yLj3wKgq_MnfBDPbv-uVScPkgL3_pqMdyCAeNbK--YdSRfGIFezb9MIiW0');

app.post('/upload', uploadMemory.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).send('Missing file');

    const job = await cloudConvert.jobs.create({
      tasks: {
        'import-my-file': { operation: 'import/upload' },
        'convert-my-file': {
          operation: 'convert',
          input: 'import-my-file',
          input_format: 'docx',
          output_format: 'pdf',
        },
        'export-my-file': { operation: 'export/url', input: 'convert-my-file' }
      }
    });

    const uploadTask = job.tasks.find(t => t.name === 'import-my-file');
    await cloudConvert.tasks.upload(uploadTask, file.buffer, file.originalname);

    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.find(t => t.operation === 'export/url' && t.status === 'finished');
    const fileUrl = exportTask.result.files[0].url;

    res.json({ pdfUrl: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Conversion failed');
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

