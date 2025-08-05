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

const cloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');

const defaultClient = cloudmersiveConvertApiClient.ApiClient.instance;
const Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = 'eb65c816-005f-4635-8e23-37e2604c3cd1';

const convertApi = new cloudmersiveConvertApiClient.ConvertDocumentApi();

app.post('/upload', uploadMemory.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { email } = req.body;
    if (!file || !email) return res.status(400).send('Missing file or email');

    const finalFilename = Date.now().toString();
    const uploadPathNoExt = path.join(__dirname, 'uploads', finalFilename);
    const uploadPathWithPdf = path.join(__dirname, 'uploads', finalFilename + '.pdf');

    let pdfBytes;

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const converted = await new Promise((resolve, reject) => {
        convertApi.convertDocumentDocxToPdf(file.buffer, (error, data) => {
          if (error) {
            console.error('Cloudmersive conversion error:', error);
            return reject(error);
          }
          resolve(data);
        });
      });
      pdfBytes = converted;
    } else if (file.mimetype === 'application/pdf') {
      pdfBytes = file.buffer;
    } else {
      return res.status(400).send('Unsupported file type');
    }

    fs.writeFileSync(uploadPathNoExt, pdfBytes);
    fs.writeFileSync(uploadPathWithPdf, pdfBytes);

    emailMap.set(finalFilename, email);

    res.json({
      fileUrl: `https://automation-project-server.onrender.com/uploads/${finalFilename}.pdf`,
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
    const originalFilename = decodeURIComponent(req.params.filename);
    const filePath = path.join(__dirname, 'uploads', originalFilename);
    const signedImagePath = path.join(__dirname, 'uploads', req.file.filename);

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

    // כאן מוסיפים את הסיומת רק לשם של קובץ החתימה
    const signedFilename = originalFilename + '_signed.pdf';
    const signedPath = path.join(__dirname, 'uploads', signedFilename);
    fs.writeFileSync(signedPath, signatureBytes);

    const email = emailMap.get(originalFilename);
    if (!email) return res.status(400).send({ error: 'Email not found', emailMap });

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