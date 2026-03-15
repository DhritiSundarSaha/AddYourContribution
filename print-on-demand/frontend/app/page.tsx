import { ProductCatalog } from '@/components/ProductCatalog';
import { api } from '@/lib/api';
import type { Product } from '@/types';

export default async function HomePage() {
  const products = await api<Product[]>('/products').catch(() => []);

  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Print-on-Demand Catalog</h1>
      <p className="text-slate-300">Browse Men, Women, and Unisex products with niche design categories.</p>
      <ProductCatalog products={products} />
    </main>
  );
}
