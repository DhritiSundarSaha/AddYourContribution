'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, FabricImage, IText } from 'fabric';
import { api } from '@/lib/api';
import type { Asset } from '@/types';
import { useAppStore } from '@/store/useStore';

export function DesignStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [prompt, setPrompt] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const selectedProduct = useAppStore((state) => state.selectedProduct);
  const disclaimerAccepted = useAppStore((state) => state.disclaimerAccepted);
  const setDisclaimerAccepted = useAppStore((state) => state.setDisclaimerAccepted);

  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new Canvas(canvasRef.current, { width: 500, height: 500, backgroundColor: '#ffffff' });
    setCanvas(c);
    return () => c.dispose();
  }, []);

  useEffect(() => {
    api<Asset[]>('/designs/assets').then(setAssets).catch(() => setAssets([]));
  }, []);

  const addText = () => {
    if (!canvas) return;
    canvas.add(new IText('Your text', { left: 60, top: 70, fill: '#111' }));
  };

  const addImageFromUrl = async (url: string) => {
    if (!canvas) return;
    const img = await FabricImage.fromURL(url);
    img.scaleToWidth(220);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  };

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) return;
    if (!disclaimerAccepted) {
      alert('Please accept design ownership disclaimer first.');
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    await api('/designs/upload', { method: 'POST', body: JSON.stringify({ dataUrl }) });
    await addImageFromUrl(dataUrl);
  };

  const generateAI = async () => {
    if (!canvas || !prompt) return;
    const result = await api<{ design: { designUrl: string } }>('/designs/ai-generate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
    if (result.design?.designUrl) await addImageFromUrl(result.design.designUrl);
  };

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold">Design Studio{selectedProduct ? ` · ${selectedProduct.name}` : ''}</h2>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={disclaimerAccepted} onChange={(e) => setDisclaimerAccepted(e.target.checked)} />
          I confirm I own rights for uploaded designs.
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="card space-y-3">
          <canvas ref={canvasRef} className="max-w-full rounded bg-white" />
          <div className="flex flex-wrap gap-2">
            <input type="file" accept="image/png,image/jpg,image/jpeg" onChange={onUpload} />
            <button className="rounded bg-indigo-500 px-3 py-2" onClick={addText}>Add text</button>
            <button className="rounded bg-indigo-500 px-3 py-2" onClick={() => canvas?.bringObjectForward(canvas.getActiveObject()!)}>Layer up</button>
            <button className="rounded bg-indigo-500 px-3 py-2" onClick={() => canvas?.sendObjectBackwards(canvas.getActiveObject()!)}>Layer down</button>
            <button
              className="rounded bg-emerald-500 px-3 py-2"
              onClick={async () => {
                if (!canvas) return;
                await api('/designs/canvas/save', {
                  method: 'POST',
                  body: JSON.stringify({
                    designId: 'replace-with-selected-design-id',
                    canvasJson: canvas.toJSON(),
                    mockupDataUrl: canvas.toDataURL({ format: 'png', multiplier: 1 })
                  })
                });
              }}
            >
              Save Mockup
            </button>
          </div>

          <div className="flex gap-2">
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Generate with AI prompt"
            />
            <button className="rounded bg-purple-500 px-3 py-2" onClick={generateAI}>Generate AI</button>
          </div>
        </div>

        <div className="card space-y-3">
          <h3 className="font-semibold">Asset Library</h3>
          <div className="grid grid-cols-2 gap-2">
            {assets.map((asset) => (
              <button
                key={asset._id}
                className="overflow-hidden rounded border border-slate-700"
                onClick={() => addImageFromUrl(asset.fileUrl)}
              >
                <img src={asset.fileUrl} alt={asset.title} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
