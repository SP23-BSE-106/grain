import 'dotenv/config';
import connectToDatabase from '../lib/mongoose';
import Product from '../models/Product';

async function seed() {
  await connectToDatabase();

  const products = [
    {
      name: 'Organic Wheat',
      category: 'Whole Grains',
      price: 5.99,
      description: 'High-quality organic wheat grains.',
      image: 'https://images.unsplash.com/photo-1654856453392-e59c00596781?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T3JnYW5pYyUyMFdoZWF0fGVufDB8fDB8fHww',
      rating: 4.5,
      stock: 100,
      reviews: []
    },
    {
      name: 'Brown Rice',
      category: 'Whole Grains',
      price: 4.99,
      description: 'Nutritious brown rice.',
      image: 'https://shorturl.at/ElsUG',
      rating: 4.0,
      stock: 100,
      reviews: []
    },
    {
      name: 'Lentils',
      category: 'Pulses',
      price: 3.99,
      description: 'Protein-rich lentils.',
      image: 'https://shorturl.at/Evd2f',
      rating: 4.2,
      stock: 100,
      reviews: []
    },
    {
      name: 'Quinoa',
      category: 'Whole Grains',
      price: 7.99,
      description: 'Superfood quinoa.',
      image: 'https://shorturl.at/L2Ij6',
      rating: 4.8,
      stock: 100,
      reviews: []
    },
    {
      name: 'Chickpeas',
      category: 'Pulses',
      price: 4.49,
      description: 'Versatile chickpeas.',
      image: 'https://shorturl.at/caSYw',
      rating: 4.3,
      stock: 100,
      reviews: []
    },
    {
      name: 'Oats',
      category: 'Whole Grains',
      price: 3.99,
      description: 'Nutritious oats.',
      image: 'https://shorturl.at/7srJu',
      rating: 4.1,
      stock: 100,
      reviews: []
    },
    {
      name: 'Black Beans',
      category: 'Pulses',
      price: 4.99,
      description: 'Versatile black beans.',
      image: 'https://plus.unsplash.com/premium_photo-1675237625091-e40de414b510?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QmxhY2slMjBCZWFuc3xlbnwwfHwwfHx8MA%3D%3D',
      rating: 4.4,
      stock: 100,
      reviews: []
    },
    {
      name: 'Barley',
      category: 'Whole Grains',
      price: 4.49,
      description: 'Healthy barley grains.',
      image: 'https://plus.unsplash.com/premium_photo-1705146640695-cab3aa2005f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8QmFybGV5fGVufDB8fDB8fHww',
      rating: 4.0,
      stock: 100,
      reviews: []
    },
    {
      name: 'Whole Wheat Flour',
      category: 'Flours',
      price: 6.99,
      description: 'Premium whole wheat flour for baking.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8V2hvbGUlMjBXaGVhdCUyMEZsb3VyfGVufDB8fDB8fHww',
      rating: 4.6,
      stock: 100,
      reviews: []
    },
    {
      name: 'Cornmeal',
      category: 'Flours',
      price: 3.49,
      description: 'Fine cornmeal for various recipes.',
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q29ybm1lYWx8ZW58MHx8MHx8fDA%3D',
      rating: 4.1,
      stock: 100,
      reviews: []
    },
    {
      name: 'Rice Flour',
      category: 'Flours',
      price: 5.49,
      description: 'Gluten-free rice flour.',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UmljZSUyMEZsb3VyfGVufDB8fDB8fHww',
      rating: 4.3,
      stock: 100,
      reviews: []
    }
  ];

  await Product.insertMany(products);
  console.log('Sample products added');
  process.exit(0);
}

seed().catch(console.error);