'use client';
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Eraser, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
  title: string;
}

export const SignatureModal = ({ isOpen, onClose, onSave, title }: Props) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  if (!isOpen) return null;

  const clear = () => sigCanvas.current?.clear();
  
  const save = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const data = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (data) {
      onSave(data);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo con desenfoque */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Firma Digital</p>
              <h3 className="text-lg font-light text-slate-800">{title}</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X size={20} strokeWidth={1.5} className="text-slate-400" />
            </button>
          </div>

          {/* El lienzo para firmar */}
          <div className="border border-slate-100 rounded-3xl bg-slate-50/50">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="#1e293b" // Slate-800
              canvasProps={{
                className: "w-full h-48 cursor-crosshair"
              }}
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={clear}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              <Eraser size={14} /> Limpiar
            </button>
            <button 
              onClick={save}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-semibold uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
              <Check size={14} /> Guardar Firma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};