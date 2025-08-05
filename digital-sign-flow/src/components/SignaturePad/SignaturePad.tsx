import React, { useRef, useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

function SignDocument({ fileUrl, onSigned }: { fileUrl: string; onSigned: (blob: Blob) => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  fileUrl = fileUrl + ".pdf";
  useEffect(() => {
    // הגדרת קנבס חתימה בגודל רוחב חלון וגובה 200 פיקסלים
    const canvas = canvasRef.current;
    if (canvas) {
      const width = window.innerWidth;
      const height = 200;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.backgroundColor = 'transparent';
      canvas.style.borderTop = '1px solid #ccc';
      canvas.style.cursor = 'crosshair';
      canvas.style.display = 'block';
      canvas.style.marginTop = '20px';
    }
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
    if (!canvasRef.current) return;

    try {
      const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // הפיכת חתימת הקנבס לתמונה
      const pngDataUrl = canvasRef.current.toDataURL('image/png');
      const pngImageBytes = Uint8Array.from(atob(pngDataUrl.split(',')[1]), c => c.charCodeAt(0));
      const pngImage = await pdfDoc.embedPng(pngImageBytes);

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width: pageWidth, height: pageHeight } = lastPage.getSize();

      // יחס בין גודל הקנבס לגודל העמוד PDF
      const scaleX = pageWidth / canvasRef.current.width;
      const scaleY = 200 / canvasRef.current.height; // גובה הקנבס קבוע ל-200

      // הוספת חתימה מעל העמוד האחרון (תחתית העמוד)
      lastPage.drawImage(pngImage, {
        x: 0,
        y: 0, // מתחיל מהתחתית
        width: canvasRef.current.width * scaleX,
        height: 200 * scaleY,
      });

      // שמירת המסמך החדש
      const pdfBytes = await pdfDoc.save();
      const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      onSigned(signedBlob);
    } catch (error) {
      alert('שגיאה בשמירת הקובץ החתום: ' + error);
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', overflowY: 'auto', padding: '10px', boxSizing: 'border-box' }}>

      <iframe
        ref={iframeRef}
        src={fileUrl}
        title="PDF Viewer"
        style={{
          width: '100%',
          height: '80vh',
          border: 'none',
          display: 'block',
        }}
      />

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <button onClick={handleSave} className="btn btn-success">
          סיום חתימה ושליחה
        </button>
      </div>
    </div>
  );
}

export default SignDocument;
