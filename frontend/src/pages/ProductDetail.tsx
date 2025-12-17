import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Minus, Plus, Heart, Share2, Truck, Shield, ArrowLeft, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppPurchaseForm from "@/components/WhatsAppPurchaseForm";
import { Button } from "@/components/ui/button";
import { getProductById, products } from "@/data/products";
import { cn } from "@/lib/utils";
import { getProduct } from "@/lib/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(getProductById(id || ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (product) return;
      try {
        setLoading(true);
        const remote = await getProduct(id || "");
        const mapped = {
          id: remote._id,
          name: remote.name,
          description: remote.description,
          price: remote.price,
          originalPrice: remote.originalPrice,
          images: remote.images || [],
          category: remote.category,
          tags: remote.tags || [],
          rating: remote.rating || 0,
          reviewCount: remote.reviewCount || 0,
          inStock: remote.inStock !== false,
          colors: remote.colors || [],
          sizes: remote.sizes || [],
          specifications: remote.specifications || {}
        };
        setProduct(mapped);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load product";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, product]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">
            {loading ? "Loading..." : "Product Not Found"}
          </h1>
          <Link to="/shop">
            <Button variant="gradient">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all",
                      selectedImage === index
                        ? "ring-2 ring-primary"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Tags */}
              <div className="flex gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      tag === "Sale" && "bg-destructive text-destructive-foreground",
                      tag === "New" && "bg-secondary text-secondary-foreground",
                      tag === "Bestseller" && "bg-accent text-accent-foreground"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(product.rating)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold gradient-text">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Color Selection */}
              {product.colors && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Color: {selectedColor || "Select a color"}
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          selectedColor === color
                            ? "bg-primary text-primary-foreground"
                            : "glass-card hover:bg-muted"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Size: {selectedSize || "Select a size"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[60px]",
                          selectedSize === size
                            ? "bg-primary text-primary-foreground"
                            : "glass-card hover:bg-muted"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center glass-card rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-muted transition-colors rounded-l-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted transition-colors rounded-r-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {!product.inStock && (
                    <span className="text-sm text-destructive">Out of stock</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="whatsapp"
                  size="xl"
                  className="flex-1"
                  disabled={!product.inStock}
                  onClick={() => setShowPurchaseForm(true)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Buy via WhatsApp
                </Button>
                <Button variant="outline" size="xl">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="xl">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg glass-card flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg glass-card flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">2 Year Warranty</p>
                    <p className="text-xs text-muted-foreground">Full coverage</p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="pt-6 border-t border-border">
                  <h3 className="font-display font-semibold mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="glass-card rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">{key}</p>
                        <p className="text-sm font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
                You Might Also <span className="gradient-text">Like</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <WhatsAppPurchaseForm
          product={product}
          quantity={quantity}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onClose={() => setShowPurchaseForm(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
