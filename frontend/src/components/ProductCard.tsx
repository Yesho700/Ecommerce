import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square rounded-2xl overflow-hidden glass-card hover-lift">
          {/* Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tags */}
          <div className="absolute top-4 left-4 flex gap-2">
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
            {discount > 0 && !product.tags.includes("Sale") && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Button variant="glass" className="w-full" size="lg">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {product.category}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
