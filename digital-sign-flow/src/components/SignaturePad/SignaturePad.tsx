// // import React, { useRef, useEffect, useState } from 'react';
// // import { PDFDocument } from 'pdf-lib';

// // function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
// //   const canvasRef = useRef<HTMLCanvasElement>(null);
// //   const [isDrawing, setIsDrawing] = useState(false);

// //   useEffect(() => {
// //     const iframe = document.querySelector('iframe');
// //     const canvas = canvasRef.current;
// //     if (iframe && canvas) {
// //       const rect = iframe.getBoundingClientRect();
// //       canvas.width = rect.width;
// //       canvas.height = rect.height;
// //     }
// //   }, []);

// //   const startDrawing = (e: any) => {
// //     setIsDrawing(true);
// //     const ctx = canvasRef.current?.getContext('2d');
// //     if (ctx) {
// //       ctx.beginPath();
// //       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
// //     }
// //   };

// //   const draw = (e: any) => {
// //     if (!isDrawing) return;
// //     const ctx = canvasRef.current?.getContext('2d');
// //     if (ctx) {
// //       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
// //       ctx.strokeStyle = 'blue';
// //       ctx.lineWidth = 2;
// //       ctx.stroke();
// //     }
// //   };

// //   const stopDrawing = () => {
// //     setIsDrawing(false);
// //   };

// //   const handleSave = async () => {
// //     if (!canvasRef.current) return;

// //     try {
// //       // 1. הורד את ה-PDF המקורי
// //       const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());

// //       // 2. טען את ה-PDF עם pdf-lib
// //       const pdfDoc = await PDFDocument.load(existingPdfBytes);

// //       // 3. המר את החתימה מ-canvas ל-PNG
// //       const pngDataUrl = canvasRef.current.toDataURL('image/png');
// //       const pngImageBytes = Uint8Array.from(
// //         atob(pngDataUrl.split(',')[1]),
// //         (c) => c.charCodeAt(0)
// //       );

// //       // 4. הטמע את תמונת החתימה ב-PDF
// //       const pngImage = await pdfDoc.embedPng(pngImageBytes);

// //       const pages = pdfDoc.getPages();
// //       const firstPage = pages[0];
// //       const { width, height } = firstPage.getSize();

// //       // 5. חשב מיקום וגודל החתימה - כאן אפשר לשנות לפי הצורך
// //       // לדוגמה למקם בחלק התחתון של העמוד, בגודל שמתאים ל-canvas
// //       const imgWidth = canvasRef.current.width;
// //       const imgHeight = canvasRef.current.height;

// //       firstPage.drawImage(pngImage, {
// //         x: 50, // מיקום אופקי
// //         y: 50, // מיקום אנכי
// //         width: imgWidth,
// //         height: imgHeight,
// //       });

// //       // 6. שמור את ה-PDF החדש
// //       const pdfBytes = await pdfDoc.save();

// //       // 7. המר ל-Blob ושלח חזרה
// //       const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
// //       await onSigned(signedBlob);
// //     } catch (error) {
// //       alert('שגיאה בשמירת הקובץ החתום: ' + error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h3>חתום על הקובץ</h3>
// //       <div style={{ position: 'relative', height: '100vh' }}>
// //         <iframe
// //           src={fileUrl}
// //           style={{
// //             width: '100%',
// //             height: '100%',
// //             border: 'none',
// //           }}
// //         />

// //         <canvas
// //           ref={canvasRef}
// //           onMouseDown={startDrawing}
// //           onMouseMove={draw}
// //           onMouseUp={stopDrawing}
// //           onMouseLeave={stopDrawing}
// //           style={{
// //             position: 'absolute',
// //             top: 0,
// //             left: 0,
// //             width: '100%',
// //             height: '100%',
// //             zIndex: 10,
// //             backgroundColor: 'transparent',
// //             pointerEvents: 'auto',
// //           }}
// //         />
// //       </div>

// //       <button className="btn btn-success mt-2" onClick={handleSave}>
// //         סיום חתימה ושליחה
// //       </button>
// //     </div>
// //   );
// // }

// // export default SignDocument;
// import React, { useRef, useEffect, useState } from 'react';
// import { PDFDocument } from 'pdf-lib';

// function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   useEffect(() => {
    
//     const iframe = document.querySelector('iframe');
//     const canvas = canvasRef.current;
    
//     if (iframe && canvas) {
//       const rect = iframe.getBoundingClientRect();
//       canvas.width = rect.width;
//       canvas.height = rect.height;

//       // חשוב: התאמה גם ב־style כדי לשמור יחס נכון בין פיקסלים להצגה
//       canvas.style.width = `${rect.width}px`;
//       canvas.style.height = `${rect.height}px`;
//     }
//   }, []);

//   const startDrawing = (e: any) => {
//     setIsDrawing(true);
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     }
//   };

//   const draw = (e: any) => {
//     if (!isDrawing) return;
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.strokeStyle = 'blue';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSave = async () => {
//     if (!canvasRef.current) return;

//     try {
//       const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);

//       const pngDataUrl = canvasRef.current.toDataURL('image/png');
//       const pngImageBytes = Uint8Array.from(
//         atob(pngDataUrl.split(',')[1]),
//         (c) => c.charCodeAt(0)
//       );
//       const pngImage = await pdfDoc.embedPng(pngImageBytes);
//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];
//       const { width, height } = firstPage.getSize();

//       // התאמת גודל התמונה לפי גודל תצוגת canvas (לא גודל פיקסלים פנימי)
//       const displayWidth = canvasRef.current.getBoundingClientRect().width;
//       const displayHeight = canvasRef.current.getBoundingClientRect().height;

//       // הדבקה בגודל זהה על המסמך (ביחידות נקודה של PDF)
//       firstPage.drawImage(pngImage, {
//         x: 50,
//         y: 50,
//         width: displayWidth,
//         height: displayHeight,
//       });

//       const pdfBytes = await pdfDoc.save();
//       const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//       await onSigned(signedBlob);
//     } catch (error) {
//       alert('שגיאה בשמירת הקובץ החתום: ' + error);
//     }
//   };

//   return (
//     <div>
//       <h3>חתום על הקובץ</h3>
//       <div ref={containerRef} style={{ position: 'relative', height: '100vh' }}>
//         <iframe
//           src={fileUrl}
//           style={{ width: '100%', height: '100%', border: 'none' }}
//         />

//         <canvas
//           ref={canvasRef}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             zIndex: 10,
//             backgroundColor: 'transparent',
//             pointerEvents: 'auto',
//             cursor: 'crosshair', // 🔥 שינוי הסמן לצורת חתימה
//           }}
//         />
//       </div>

//       <button className="btn btn-success mt-2" onClick={handleSave}>
//         סיום חתימה ושליחה
//       </button>
//     </div>
//   );
// }

// export default SignDocument;

// import React, { useRef, useEffect, useState } from 'react';
// import { PDFDocument } from 'pdf-lib';

// function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   useEffect(() => {
//     const iframe = document.querySelector('iframe');
//     const canvas = canvasRef.current;
//     if (iframe && canvas) {
//       const rect = iframe.getBoundingClientRect();
//       canvas.width = rect.width;
//       canvas.height = rect.height;
//       canvas.style.width = `${rect.width}px`;
//       canvas.style.height = `${rect.height}px`;
//     }
//   }, []);

//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     }
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.strokeStyle = 'blue';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSave = async () => {
//     if (!canvasRef.current) return;

//     try {
//       const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);

//       const pngDataUrl = canvasRef.current.toDataURL('image/png');
//       const pngImageBytes = Uint8Array.from(
//         atob(pngDataUrl.split(',')[1]),
//         (c) => c.charCodeAt(0)
//       );
//       const pngImage = await pdfDoc.embedPng(pngImageBytes);

//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];
//       const { width: pageWidth, height: pageHeight } = firstPage.getSize();

//       const canvasRect = canvasRef.current.getBoundingClientRect();
//       const scaleX = pageWidth / canvasRef.current.width;
//       const scaleY = pageHeight / canvasRef.current.height;

//       const displayWidth = canvasRect.width * scaleX;
//       const displayHeight = canvasRect.height * scaleY;

//       firstPage.drawImage(pngImage, {
//         x: 50,
//         y: 50,
//         width: displayWidth,
//         height: displayHeight,
//       });

//       const pdfBytes = await pdfDoc.save();
//       const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//       await onSigned(signedBlob);
//     } catch (error) {
//       alert('שגיאה בשמירת הקובץ החתום: ' + error);
//     }
//   };

//   return (
//     <div>
//       <h3>חתום על הקובץ</h3>
//       <div style={{ position: 'relative', height: '100vh' }}>
//         <iframe src={fileUrl} style={{ width: '100%', height: '100%', border: 'none' }} />

//         <canvas
//           ref={canvasRef}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             zIndex: 10,
//             backgroundColor: 'transparent',
//             pointerEvents: 'auto',
//             cursor: 'crosshair',
//           }}
//         />
//       </div>

//       <button className="btn btn-success mt-2" onClick={handleSave}>
//         סיום חתימה ושליחה
//       </button>
//     </div>
//   );
// }

// export default SignDocument;

// import React, { useRef, useEffect, useState } from 'react';
// import { PDFDocument } from 'pdf-lib';

// function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   useEffect(() => {
//     const iframe = document.querySelector('iframe');
//     const canvas = canvasRef.current;
//     if (iframe && canvas) {
//       const rect = iframe.getBoundingClientRect();

//       // חשוב מאוד: להגדיר את הגודל הפנימי של הקנבס בדיוק לפי גודל התצוגה
//       canvas.width = rect.width;
//       canvas.height = rect.height;

//       // להגדיר את הגודל החזותי לפי אותו גודל
//       canvas.style.width = `${rect.width}px`;
//       canvas.style.height = `${rect.height}px`;
//     }
//   }, []);

//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     }
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.strokeStyle = 'blue';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSave = async () => {
//     if (!canvasRef.current) return;

//     try {
//       const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);

//       const pngDataUrl = canvasRef.current.toDataURL('image/png');
//       const pngImageBytes = Uint8Array.from(
//         atob(pngDataUrl.split(',')[1]),
//         (c) => c.charCodeAt(0)
//       );
//       const pngImage = await pdfDoc.embedPng(pngImageBytes);

//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];
//       const { width: pageWidth, height: pageHeight } = firstPage.getSize();

//       // יחס המרה בין פיקסלים של הקנבס ליחידות ה-PDF (נקודות)
//       const scaleX = pageWidth / canvasRef.current.width;
//       const scaleY = pageHeight / canvasRef.current.height;

//       // אנחנו רוצים שהחתימה תכסה את כל הקנבס בגודל היחסי שלו, ללא שינוי מיקום (x=0, y=0)
//       firstPage.drawImage(pngImage, {
//         x: 0,
//         y: 0,
//         width: canvasRef.current.width * scaleX,
//         height: canvasRef.current.height * scaleY,
//       });

//       const pdfBytes = await pdfDoc.save();
//       const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//       await onSigned(signedBlob);
//     } catch (error) {
//       alert('שגיאה בשמירת הקובץ החתום: ' + error);
//     }
//   };

//   return (
//     <div>
//       <h3>חתום על הקובץ</h3>
//       <div style={{ position: 'relative', height: '100vh' }}>
//         <iframe src={fileUrl} style={{ width: '100%', height: '100%', border: 'none' }} />

//         <canvas
//           ref={canvasRef}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             zIndex: 10,
//             backgroundColor: 'transparent',
//             pointerEvents: 'auto',
//             cursor: 'crosshair',
//           }}
//         />
//       </div>

//       <button className="btn btn-success mt-2" onClick={handleSave}>
//         סיום חתימה ושליחה
//       </button>
//     </div>
//   );
// }

// export default SignDocument;

// import React, { useRef, useEffect, useState } from 'react';
// import { PDFDocument } from 'pdf-lib';

// function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   useEffect(() => {
//     const iframe = document.querySelector('iframe');
//     const canvas = canvasRef.current;
//     if (iframe && canvas) {
//       const rect = iframe.getBoundingClientRect();

//       // הגדרת גודל פנימי של הקנבס לפי גודל התצוגה המדויק של האייפריים
//       canvas.width = rect.width;
//       canvas.height = rect.height;

//       // הגדרת גודל חזותי של הקנבס לשמור על יחסי פיקסל-תצוגה
//       canvas.style.width = `${rect.width}px`;
//       canvas.style.height = `${rect.height}px`;
//     }
//   }, []);

//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     }
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.strokeStyle = 'blue';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSave = async () => {
//     if (!canvasRef.current) return;

//     try {
//       const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);

//       const pngDataUrl = canvasRef.current.toDataURL('image/png');
//       const pngImageBytes = Uint8Array.from(
//         atob(pngDataUrl.split(',')[1]),
//         (c) => c.charCodeAt(0)
//       );
//       const pngImage = await pdfDoc.embedPng(pngImageBytes);

//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];
//       const { width: pageWidth, height: pageHeight } = firstPage.getSize();

//       // יחס המרה בין מימדי הקנבס (פיקסלים) למימדי ה-PDF (נקודות)
//       const scaleX = pageWidth / canvasRef.current.width;
//       const scaleY = pageHeight / canvasRef.current.height;

//       // מיקום וגודל מדויק של החתימה על פי הקנבס שציירת עליו (X ו-Y = 0 כדי למקם בדיוק בפינה)
//       firstPage.drawImage(pngImage, {
//         x: 0,
//         y: 0,
//         width: canvasRef.current.width * scaleX,
//         height: canvasRef.current.height * scaleY,
//       });

//       const pdfBytes = await pdfDoc.save();
//       const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//       await onSigned(signedBlob);
//     } catch (error) {
//       alert('שגיאה בשמירת הקובץ החתום: ' + error);
//     }
//   };

//   return (
//     <div>
//       <h3>חתום על הקובץ</h3>
//       <div style={{ position: 'relative', height: '100vh' }}>
//         <iframe src={fileUrl} style={{ width: '100%', height: '100%', border: 'none' }} />

//         <canvas
//           ref={canvasRef}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             zIndex: 10,
//             backgroundColor: 'transparent',
//             pointerEvents: 'auto',
//             cursor: 'crosshair',
//           }}
//         />
//       </div>

//       <button className="btn btn-success mt-2" onClick={handleSave}>
//         סיום חתימה ושליחה
//       </button>
//     </div>
//   );
// }

// export default SignDocument;

// import React, { useRef, useEffect, useState } from 'react';
// import * as pdfjsLib from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker.min.mjs';
// import { PDFDocument } from 'pdf-lib';

// function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
//   const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
//   const signCanvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   useEffect(() => {
//     const renderPdf = async () => {
//       const loadingTask = pdfjsLib.getDocument(fileUrl);
//       const pdf = await loadingTask.promise;
//       const page = await pdf.getPage(1);

//       const viewport = page.getViewport({ scale: 1.5 });

//       const canvas = pdfCanvasRef.current;
//     //   const context = canvas?.getContext('2d');
//     //   if (!canvas || !context) return;

//     //   canvas.width = viewport.width;
//     //   canvas.height = viewport.height;

//     //   const renderContext = {
//     //     canvasContext: context,
//     //     viewport,
//     //   };

//     //   await page.render(renderContext).promise;const canvas = pdfCanvasRef.current;
// const context = canvas?.getContext('2d');
// if (!canvas || !context) return;
// console.log("גגגגגגג");

// canvas.width = viewport.width;
// canvas.height = viewport.height;

// const renderContext = {
//   canvas: canvas,
//   canvasContext: context,
//   viewport,
// };

// await page.render(renderContext).promise;


//       const signCanvas = signCanvasRef.current;
//       if (signCanvas) {
//         signCanvas.width = viewport.width;
//         signCanvas.height = viewport.height;
//         signCanvas.style.width = `${viewport.width}px`;
//         signCanvas.style.height = `${viewport.height}px`;
//       }
//     };

//     renderPdf();
//   }, [fileUrl]);

//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     const ctx = signCanvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     }
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
//     const ctx = signCanvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.strokeStyle = 'blue';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSave = async () => {
//     if (!signCanvasRef.current) return;

//     try {
//       const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);

//       const pngDataUrl = signCanvasRef.current.toDataURL('image/png');
//       const pngImageBytes = Uint8Array.from(
//         atob(pngDataUrl.split(',')[1]),
//         (c) => c.charCodeAt(0)
//       );
//       const pngImage = await pdfDoc.embedPng(pngImageBytes);

//       const firstPage = pdfDoc.getPages()[0];
//       const { width, height } = firstPage.getSize();

//       firstPage.drawImage(pngImage, {
//         x: 0,
//         y: 0,
//         width,
//         height,
//       });

//       const pdfBytes = await pdfDoc.save();
//       const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//       await onSigned(signedBlob);
//     } catch (error) {
//       alert('שגיאה בשמירת הקובץ החתום: ' + error);
//     }
//   };

//   return (
//     <div style={{ overflow: 'auto' }}>
//       <h3>חתום על הקובץ</h3>
//       <div style={{ position: 'relative', display: 'inline-block' }}>
//         <canvas ref={pdfCanvasRef} style={{ display: 'block' }} />
//         <canvas
//           ref={signCanvasRef}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             zIndex: 10,
//             cursor: 'crosshair',
//             backgroundColor: 'transparent',
//           }}
//         />
//       </div>
//       <button className="btn btn-success mt-2" onClick={handleSave}>
//         סיום חתימה ושליחה
//       </button>
//     </div>
//   );
// }

// export default SignDocument;


// import React, { useRef, useEffect, useState } from 'react';
// import { PDFDocument } from 'pdf-lib';

// function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   // שינוי גודל הקנבס לפי ה־iframe
//   useEffect(() => {
//     const resizeCanvasToIframe = () => {
//       const iframe = iframeRef.current;
//       const canvas = canvasRef.current;

//       if (iframe && canvas) {
//         const rect = iframe.getBoundingClientRect();

//         canvas.width = rect.width;
//         canvas.height = rect.height;

//         canvas.style.width = `${rect.width}px`;
//         canvas.style.height = `${rect.height}px`;

//         // מיקום canvas
//         const iframeOffsetTop = iframe.offsetTop;
//         const iframeOffsetLeft = iframe.offsetLeft;
//         canvas.style.top = `${iframeOffsetTop}px`;
//         canvas.style.left = `${iframeOffsetLeft}px`;
//       }
//     };

//     resizeCanvasToIframe();
//     window.addEventListener('resize', resizeCanvasToIframe);
//     return () => window.removeEventListener('resize', resizeCanvasToIframe);
//   }, []);

//   // ציור
//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.beginPath();
//       ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     }
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
//     const ctx = canvasRef.current?.getContext('2d');
//     if (ctx) {
//       ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//       ctx.strokeStyle = 'blue';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSave = async () => {
//     if (!canvasRef.current) return;

//     try {
//       const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);

//       const pngDataUrl = canvasRef.current.toDataURL('image/png');
//       const pngImageBytes = Uint8Array.from(
//         atob(pngDataUrl.split(',')[1]),
//         (c) => c.charCodeAt(0)
//       );
//       const pngImage = await pdfDoc.embedPng(pngImageBytes);

//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];
//       const { width: pageWidth, height: pageHeight } = firstPage.getSize();

//       // התאמה בין מימדי הקנבס לבין ה־PDF
//       const scaleX = pageWidth / canvasRef.current.width;
//       const scaleY = pageHeight / canvasRef.current.height;

//       firstPage.drawImage(pngImage, {
//         x: 0,
//         y: 0,
//         width: canvasRef.current.width * scaleX,
//         height: canvasRef.current.height * scaleY,
//       });

//       const pdfBytes = await pdfDoc.save();
//       const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//       onSigned(signedBlob);
//     } catch (error) {
//       alert('שגיאה בשמירת הקובץ החתום: ' + error);
//     }
//   };

//   return (
//     <div style={{ position: 'relative', height: '90vh', overflow: 'auto' }}>
//       <h3>חתום על הקובץ</h3>

//       {/* אזור תצוגת המסמך */}
//       <div style={{ position: 'relative' }}>
//         <iframe
//           ref={iframeRef}
//           src={fileUrl}
//           title="PDF Viewer"
//           style={{
//             width: '100%',
//             height: '80vh',
//             border: 'none',
//             display: 'block',
//           }}
//         />

//         <canvas
//           ref={canvasRef}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//           style={{
//             position: 'absolute',
//             top: '0',
//             left: '0',
//             zIndex: 10,
//             backgroundColor: 'transparent',
//             pointerEvents: 'auto',
//             cursor: 'crosshair',
//           }}
//         />
//       </div>

//       <button className="btn btn-success mt-2" onClick={handleSave}>
//         סיום חתימה ושליחה
//       </button>
//     </div>
//   );
// }

// export default SignDocument;


import React, { useRef, useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [iframeRect, setIframeRect] = useState<{width: number, height: number, top: number, left: number} | null>(null);

  // עדכון מימדי הקנבס בהתאם למימדי ה-iframe
  useEffect(() => {
    const updateCanvasSize = () => {
      const iframe = iframeRef.current;
      const canvas = canvasRef.current;
      if (iframe && canvas) {
        const rect = iframe.getBoundingClientRect();
        setIframeRect({ width: rect.width, height: rect.height, top: rect.top + window.scrollY, left: rect.left + window.scrollX });

        canvas.width = rect.width;
        canvas.height = rect.height;

        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        // מיקום מוחלט על המסמך (לפי scroll)
        canvas.style.position = 'absolute';
        canvas.style.top = rect.top + window.scrollY + 'px';
        canvas.style.left = rect.left + window.scrollX + 'px';

        canvas.style.zIndex = '1000'; // מעל ה-iframe אבל מתחת לכפתורים אחרים
        canvas.style.backgroundColor = 'transparent';
        canvas.style.pointerEvents = 'auto';
        canvas.style.cursor = 'crosshair';
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('scroll', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', updateCanvasSize);
    };
  }, [fileUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = async () => {
    if (!canvasRef.current || !iframeRect) return;

    try {
      const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const pngDataUrl = canvasRef.current.toDataURL('image/png');
      const pngImageBytes = Uint8Array.from(
        atob(pngDataUrl.split(',')[1]),
        (c) => c.charCodeAt(0)
      );
      const pngImage = await pdfDoc.embedPng(pngImageBytes);

      const firstPage = pdfDoc.getPages()[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      // התאמת המידות של הקנבס למידות ה-PDF
      const scaleX = pageWidth / iframeRect.width;
      const scaleY = pageHeight / iframeRect.height;

      firstPage.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: iframeRect.width * scaleX,
        height: iframeRect.height * scaleY,
      });

      const pdfBytes = await pdfDoc.save();
      const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      onSigned(signedBlob);
    } catch (error) {
      alert('שגיאה בשמירת הקובץ החתום: ' + error);
    }
  };

  return (
    <>
      <h3>חתום על הקובץ</h3>
      <div style={{ position: 'relative' }}>
        <iframe
          ref={iframeRef}
          src={fileUrl}
          title="PDF Viewer"
          style={{
            width: '80vw',
            height: '80vh',
            border: '1px solid #ccc',
            display: 'block',
            margin: 'auto',
          }}
        />

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button onClick={handleSave} className="btn btn-success">
          סיום חתימה ושליחה
        </button>
      </div>
    </>
  );
}

export default SignDocument;
