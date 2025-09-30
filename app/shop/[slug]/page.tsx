import { productsService } from '../../services/productService';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const products = await productsService.getAllProducts();
  const product = products.find(p => 
    p.title.replace(/\s+/g, '-').toLowerCase() === params.slug
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Зображення */}
            <div>
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-96 object-contain rounded-2xl"
              />
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {product.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Інформація */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.title}
              </h1>
              <p className="text-2xl font-semibold text-gray-700 mb-6">
                {product.price} $
              </p>
              
              {product.description && (
                <div className="prose max-w-none mb-6">
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}