'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, FabricImage, IText } from 'fabric';
import { api } from '@/lib/api';
import type { Asset } from '@/types';
import { useAppStore } from '@/store/useStore';

type DesignResponse = { _id: string; designUrl: string };

export function DesignStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [prompt, setPrompt] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState('');
  const selectedProduct = useAppStore((state) => state.selectedProduct);
  const disclaimerAccepted = useAppStore((state) => state.disclaimerAccepted);
  const setDisclaimerAccepted = useAppStore((state) => state.setDisclaimerAccepted);

  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new Canvas(canvasRef.current, { width: 500, height: 500, backgroundColor: '#ffffff' });

    const refreshPreview = () => setPreviewUrl(c.toDataURL({ format: 'png', multiplier: 1 }));
    c.on('object:added', refreshPreview);
    c.on('object:modified', refreshPreview);
    c.on('object:removed', refreshPreview);

    setCanvas(c);
    refreshPreview();

    return () => {
      c.off('object:added', refreshPreview);
      c.off('object:modified', refreshPreview);
      c.off('object:removed', refreshPreview);
      c.dispose();
    };
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
    img.set({ left: 130, top: 130 });
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
    const uploaded = await api<DesignResponse>('/designs/upload', { method: 'POST', body: JSON.stringify({ dataUrl }) });
    setSelectedDesignId(uploaded._id);
    await addImageFromUrl(uploaded.designUrl || dataUrl);
  };

  const generateAI = async () => {
    if (!canvas || !prompt.trim()) return;
    const result = await api<{ design: DesignResponse; warning?: string }>('/designs/ai-generate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
    setSelectedDesignId(result.design._id);
    if (result.warning) alert(result.warning);
    if (result.design?.designUrl) await addImageFromUrl(result.design.designUrl);
  };

  const loadAsset = async (asset: Asset) => {
    await addImageFromUrl(asset.fileUrl);
    const design = await api<DesignResponse>(`/designs/assets/${asset._id}/use`, { method: 'POST' });
    setSelectedDesignId(design._id);
  };

  const canSave = useMemo(() => Boolean(canvas && selectedDesignId), [canvas, selectedDesignId]);

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
            <button className="rounded bg-indigo-500 px-3 py-2" onClick={() => canvas?.getActiveObject()?.rotate((canvas.getActiveObject()?.angle || 0) + 15)}>Rotate +15°</button>
            <button
              className="rounded bg-emerald-500 px-3 py-2 disabled:opacity-50"
              disabled={!canSave}
              onClick={async () => {
                if (!canvas || !selectedDesignId) return;
                await api('/designs/canvas/save', {
                  method: 'POST',
                  body: JSON.stringify({
                    designId: selectedDesignId,
                    canvasJson: canvas.toJSON(),
                    mockupDataUrl: canvas.toDataURL({ format: 'png', multiplier: 1 })
                  })
                });
                alert('Mockup saved.');
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
          <h3 className="font-semibold">Live Mockup Preview</h3>
          {previewUrl ? <img src={previewUrl} alt="Live mockup" className="rounded border border-slate-700" /> : null}
          <h3 className="font-semibold">Asset Library</h3>
          <div className="grid grid-cols-2 gap-2">
            {assets.map((asset) => (
              <button
                key={asset._id}
                className="overflow-hidden rounded border border-slate-700"
                onClick={() => loadAsset(asset)}
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
