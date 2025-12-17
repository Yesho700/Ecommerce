import { useState } from "react";
import { X, MessageCircle, Package, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { z } from "zod";

interface WhatsAppPurchaseFormProps {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phone: z.string().trim().min(10, "Valid phone number required").max(20, "Phone number too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  address: z.string().trim().min(10, "Please provide a complete address").max(500, "Address too long"),
});

const WhatsAppPurchaseForm = ({
  product,
  quantity,
  selectedColor,
  selectedSize,
  onClose,
}: WhatsAppPurchaseFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const STANDARD_COST = Number(import.meta.env.VITE_SHIPPING_STANDARD_COST ?? 0);
  const EXPRESS_COST = Number(import.meta.env.VITE_SHIPPING_EXPRESS_COST ?? 15);
  const shippingCost = shippingMethod === "express" ? EXPRESS_COST : STANDARD_COST;
  const total = product.price * quantity + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const orderId = generateOrderId();
    const timestamp = new Date().toLocaleString();

    const businessName = import.meta.env.VITE_BUSINESS_NAME || "Customer Order";
    const businessAddress = import.meta.env.VITE_BUSINESS_ADDRESS || "";

    // Build WhatsApp message
    const message = `*NEW ORDER RECEIVED* 🛒

*Business:*
${businessName}${businessAddress ? `\nAddress: ${businessAddress}` : ""}

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Address: ${formData.address}

*Order Details:*
Product: ${product.name}
${selectedColor ? `Color: ${selectedColor}` : ""}
${selectedSize ? `Size: ${selectedSize}` : ""}
Price: $${product.price.toFixed(2)}
Quantity: ${quantity}
Subtotal: $${(product.price * quantity).toFixed(2)}

*Shipping:* ${shippingMethod === "express" ? `Express ($${EXPRESS_COST.toFixed(2)})` : `Standard ($${STANDARD_COST.toFixed(2)})`}
*Total: $${total.toFixed(2)}*

Order ID: ${orderId}
Timestamp: ${timestamp}

Product Image: ${product.images[0]}`;

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl p-6 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-display font-bold mb-6">
          Complete Your <span className="gradient-text">Purchase</span>
        </h2>

        {/* Order Summary */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <div className="flex gap-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                {selectedColor && <p>Color: {selectedColor}</p>}
                {selectedSize && <p>Size: {selectedSize}</p>}
                <p>Quantity: {quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">${(product.price * quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={cn(errors.name && "border-destructive")}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  className={cn(errors.phone && "border-destructive")}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Shipping Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St, City, Country, ZIP"
                className={cn(errors.address && "border-destructive")}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>
          </div>

          {/* Shipping Method */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              Shipping Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "standard", label: "Standard", price: "Free", time: "5-7 days" },
                { id: "express", label: "Express", price: "$15", time: "2-3 days" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setShippingMethod(option.id as "standard" | "express")}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    shippingMethod === option.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{option.label}</span>
                    <span className="font-semibold text-primary">{option.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="glass-card rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl gradient-text">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="whatsapp" size="xl" className="w-full">
            <MessageCircle className="w-5 h-5 mr-2" />
            Complete Purchase via WhatsApp
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By clicking above, you'll be redirected to WhatsApp to complete your order with our team.
          </p>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppPurchaseForm;
