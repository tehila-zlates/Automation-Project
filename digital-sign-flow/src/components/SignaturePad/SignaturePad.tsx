import React, { useRef, useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const iframe = document.querySelector('iframe');
    const canvas = canvasRef.current;
    if (iframe && canvas) {
      const rect = iframe.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }, []);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const draw = (e: any) => {
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
    if (!canvasRef.current) return;

    try {
      // 1. הורד את ה-PDF המקורי
      const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());

      // 2. טען את ה-PDF עם pdf-lib
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // 3. המר את החתימה מ-canvas ל-PNG
      const pngDataUrl = canvasRef.current.toDataURL('image/png');
      const pngImageBytes = Uint8Array.from(
        atob(pngDataUrl.split(',')[1]),
        (c) => c.charCodeAt(0)
      );

      // 4. הטמע את תמונת החתימה ב-PDF
      const pngImage = await pdfDoc.embedPng(pngImageBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // 5. חשב מיקום וגודל החתימה - כאן אפשר לשנות לפי הצורך
      // לדוגמה למקם בחלק התחתון של העמוד, בגודל שמתאים ל-canvas
      const imgWidth = canvasRef.current.width;
      const imgHeight = canvasRef.current.height;

      firstPage.drawImage(pngImage, {
        x: 50, // מיקום אופקי
        y: 50, // מיקום אנכי
        width: imgWidth,
        height: imgHeight,
      });

      // 6. שמור את ה-PDF החדש
      const pdfBytes = await pdfDoc.save();

      // 7. המר ל-Blob ושלח חזרה
      const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      await onSigned(signedBlob);
    } catch (error) {
      alert('שגיאה בשמירת הקובץ החתום: ' + error);
    }
  };

  return (
    <div>
      <h3>חתום על הקובץ</h3>
      <div style={{ position: 'relative', height: '100vh' }}>
        <iframe
          src={fileUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            backgroundColor: 'transparent',
            pointerEvents: 'auto',
          }}
        />
      </div>

      <button className="btn btn-success mt-2" onClick={handleSave}>
        סיום חתימה ושליחה
      </button>
    </div>
  );
}

export default SignDocument;
