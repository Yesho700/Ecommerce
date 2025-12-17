import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "Experience crystal-clear audio with our flagship wireless headphones. Featuring active noise cancellation, 40-hour battery life, and premium comfort for all-day wear.",
    price: 299.99,
    originalPrice: 399.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"
    ],
    category: "Electronics",
    tags: ["Bestseller", "Sale"],
    rating: 4.8,
    reviewCount: 2847,
    inStock: true,
    colors: ["Midnight Black", "Arctic White", "Navy Blue"],
    specifications: {
      "Battery Life": "40 hours",
      "Driver Size": "40mm",
      "Connectivity": "Bluetooth 5.2",
      "Weight": "250g"
    }
  },
  {
    id: "2",
    name: "Smart Fitness Watch Pro",
    description: "Track your fitness journey with precision. Heart rate monitoring, GPS tracking, sleep analysis, and 100+ workout modes in a sleek titanium design.",
    price: 449.99,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800"
    ],
    category: "Electronics",
    tags: ["New"],
    rating: 4.9,
    reviewCount: 1563,
    inStock: true,
    colors: ["Titanium Silver", "Graphite Black", "Rose Gold"],
    sizes: ["42mm", "46mm"],
    specifications: {
      "Display": "AMOLED 1.4\"",
      "Water Resistance": "50m",
      "Battery": "14 days",
      "Sensors": "Heart rate, SpO2, GPS"
    }
  },
  {
    id: "3",
    name: "Designer Leather Backpack",
    description: "Crafted from premium Italian leather with meticulous attention to detail. Features dedicated laptop compartment, anti-theft pockets, and timeless design.",
    price: 189.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"
    ],
    category: "Fashion",
    tags: ["Sale"],
    rating: 4.7,
    reviewCount: 892,
    inStock: true,
    colors: ["Cognac Brown", "Jet Black", "Forest Green"],
    specifications: {
      "Material": "Italian Leather",
      "Capacity": "25L",
      "Laptop Size": "Up to 15\"",
      "Dimensions": "45x30x15cm"
    }
  },
  {
    id: "4",
    name: "Minimalist Desk Lamp",
    description: "Illuminate your workspace with style. Adjustable LED brightness, wireless charging base, and sculptural aluminum design that complements any modern desk.",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800"
    ],
    category: "Home",
    tags: [],
    rating: 4.6,
    reviewCount: 445,
    inStock: true,
    colors: ["Brushed Aluminum", "Matte Black", "White"],
    specifications: {
      "Light Output": "800 lumens",
      "Color Temp": "2700K-6500K",
      "Wireless Charging": "15W",
      "Material": "Aluminum"
    }
  },
  {
    id: "5",
    name: "Premium Mechanical Keyboard",
    description: "The ultimate typing experience with hot-swappable switches, per-key RGB lighting, and aircraft-grade aluminum construction. Built for enthusiasts.",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800"
    ],
    category: "Electronics",
    tags: ["Bestseller"],
    rating: 4.9,
    reviewCount: 3241,
    inStock: true,
    colors: ["Space Gray", "Pearl White"],
    specifications: {
      "Switches": "Hot-swappable",
      "Keycaps": "PBT Double-shot",
      "Connectivity": "USB-C, Bluetooth",
      "Battery": "4000mAh"
    }
  },
  {
    id: "6",
    name: "Artisan Coffee Maker",
    description: "Brew café-quality coffee at home. Precision temperature control, built-in grinder, and barista-level milk frothing for the perfect cup every time.",
    price: 599.99,
    originalPrice: 749.99,
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
    ],
    category: "Home",
    tags: ["Sale", "New"],
    rating: 4.8,
    reviewCount: 678,
    inStock: true,
    colors: ["Stainless Steel", "Matte Black"],
    specifications: {
      "Grinder": "Conical Burr",
      "Pressure": "15 bar",
      "Water Tank": "2L",
      "Milk Frother": "Steam wand"
    }
  },
  {
    id: "7",
    name: "Ultralight Running Shoes",
    description: "Engineered for speed with responsive foam cushioning, breathable mesh upper, and carbon fiber plate for explosive energy return.",
    price: 179.99,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800"
    ],
    category: "Fashion",
    tags: ["New"],
    rating: 4.7,
    reviewCount: 1892,
    inStock: true,
    colors: ["Electric Blue", "Solar Orange", "Stealth Black"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    specifications: {
      "Weight": "185g",
      "Drop": "8mm",
      "Cushioning": "ZoomX Foam",
      "Plate": "Carbon Fiber"
    }
  },
  {
    id: "8",
    name: "Portable Power Station",
    description: "Power your adventures with 1000Wh capacity, fast solar charging, and multiple output ports. Perfect for camping, emergencies, or off-grid living.",
    price: 899.99,
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
      "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800"
    ],
    category: "Electronics",
    tags: [],
    rating: 4.6,
    reviewCount: 534,
    inStock: false,
    colors: ["Orange", "Black"],
    specifications: {
      "Capacity": "1000Wh",
      "Output": "2000W peak",
      "Solar Input": "400W",
      "Weight": "10kg"
    }
  }
];

export const categories = ["All", "Electronics", "Fashion", "Home"];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "All") return products;
  return products.filter(p => p.category === category);
};
