import React, { useRef, useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// הגדרת workerSrc לגרסה יציבה של pdf.js
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.min.mjs`;
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

function SignDocument({ fileUrl, onSigned }: { fileUrl: string, onSigned: (blob: Blob) => void }) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isRenderingRef = useRef(false);

  useEffect(() => {
    
    const loadPDF = async () => {
      if (isRenderingRef.current) {
        return;
      }

      isRenderingRef.current = true;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      try {
    console.log("222");

        const loadingTask = pdfjsLib.getDocument(fileUrl);
    console.log("111");

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const rotation = page.rotate;
        const scale = 1.5;
        const viewport = page.getViewport({ scale, rotation });

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (canvas && context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          renderTaskRef.current = page.render({ canvasContext: context, viewport });
          await renderTaskRef.current.promise;
          renderTaskRef.current = null;

        }
      } catch (error) {
        if ((error as any).name === 'RenderingCancelledException') {
          // רינדור בוטל          
        } else {
          console.error('Error rendering PDF:', error);
        }
      } finally {
        isRenderingRef.current = false;
      }
    };

    loadPDF();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [fileUrl]);


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

    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          try {
            await onSigned(blob);
          } catch (e) {
            alert('שגיאה בשליחת הקובץ החתום');
          }
        }
      }, 'image/png');
    }
  };

  return (
    <div>
      <h3>חתום על הקובץ</h3>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
      />
      <button className="btn btn-success mt-2" onClick={handleSave}>
        סיום חתימה ושליחה
      </button>
    </div>
  );
}

export default SignDocument;