export const initialProducts = [
  {
    id: 'swg-001',
    name: 'Camisa Oversized',
    description: 'Algodao pesado, caimento amplo e gola reforcada.',
    price: 129.9,
    category: 'Camisetas',
    stock: 24,
    featured: true,
    colors: ['#111111', '#ffffff', '#8d8a82'],
    sizes: ['P', 'M', 'G', 'GG'],
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 'swg-002',
    name: 'Tech Trousers',
    description: 'Calca utilitaria em sarja tecnica com bolso lateral.',
    price: 239.9,
    category: 'Calcas',
    stock: 16,
    featured: true,
    colors: ['#0d0d0d', '#6f7568', '#d8d5ce'],
    sizes: ['38', '40', '42', '44'],
    images: [
      { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 'swg-003',
    name: 'Denim Jacket',
    description: 'Jaqueta jeans reta com lavagem escura e estrutura limpa.',
    price: 319.9,
    category: 'Jaquetas',
    stock: 10,
    featured: true,
    colors: ['#1f2937', '#111111'],
    sizes: ['P', 'M', 'G'],
    images: [
      { url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 'swg-004',
    name: 'Essential Hoodie',
    description: 'Moletom encorpado, minimalista e pronto para a rua.',
    price: 269.9,
    category: 'Moletons',
    stock: 18,
    featured: true,
    colors: ['#111111', '#c8c3b9', '#6b6b6b'],
    sizes: ['P', 'M', 'G', 'GG'],
    images: [
      { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 'swg-005',
    name: 'Urban Sneakers',
    description: 'Tenis urbano de silhueta limpa para completar o drop.',
    price: 299.9,
    category: 'Calçados',
    stock: 14,
    featured: true,
    colors: ['#111111', '#ffffff', '#6b6b6b'],
    sizes: ['38', '39', '40', '41', '42'],
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop' }
    ]
  }
];

export const getStoredProducts = () => {
  try {
    return JSON.parse(localStorage.getItem('swag_side_products')) || initialProducts;
  } catch {
    return initialProducts;
  }
};

export const storeProducts = (products) => {
  localStorage.setItem('swag_side_products', JSON.stringify(products));
};
