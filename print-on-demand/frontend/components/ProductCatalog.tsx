'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/types';
import { useAppStore } from '@/store/useStore';

const categories = ['All', 'Men', 'Women', 'Unisex'];
const designCategories = ['All', 'Anime', 'Bollywood', 'Hollywood', 'Gaming', 'Sports', 'Mandala', 'Minimal', 'Line art'];

export function ProductCatalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState('All');
  const [designCategory, setDesignCategory] = useState('All');
  const setSelectedProduct = useAppStore((state) => state.setSelectedProduct);

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === 'All' || product.category === category) &&
          (designCategory === 'All' || product.designCategory === designCategory)
      ),
    [products, category, designCategory]
  );

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <select className="card" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className="card" value={designCategory} onChange={(event) => setDesignCategory(event.target.value)}>
          {designCategories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((product) => (
          <article key={product._id} className="card space-y-2">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-slate-300">{product.type} · {product.category} · {product.designCategory}</p>
            <p>₹{product.basePrice}</p>
            <button
              className="rounded bg-indigo-500 px-3 py-2"
              onClick={() => setSelectedProduct(product)}
            >
              Customize
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
