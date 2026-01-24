# GrainyMart - Premium Grains & Pulses E-Commerce Platform

![GrainyMart](https://img.shields.io/badge/GrainyMart-E--Commerce-green?style=for-the-badge&logo=next.js)
![Next.js](https://img.shields.io/badge/Next.js-14.0+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248?style=flat-square&logo=mongodb)

GrainyMart is a modern, full-stack e-commerce platform specializing in premium grains and pulses. Built with Next.js 14, TypeScript, and MongoDB, it offers a seamless shopping experience for health-conscious consumers.

## 🌟 Features

### 🛒 Core E-Commerce Features
- **Product Catalog**: Browse through a wide variety of grains and pulses
- **Advanced Search & Filtering**: Filter products by category, price, and rating
- **Shopping Cart**: Add, remove, and manage cart items with persistent storage
- **User Authentication**: Secure login/signup with JWT tokens
- **Order Management**: Complete order placement and history tracking
- **Admin Panel**: Comprehensive admin dashboard for product and order management

### 🎨 User Experience
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Accessibility**: WCAG compliant with proper focus management and ARIA labels
- **Dark/Light Theme**: Customizable theme with organic color palette
- **Smooth Animations**: Fade-in effects, hover transitions, and micro-interactions

### 🛡️ Security & Performance
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation with Zod schemas
- **Error Handling**: Graceful error handling and user feedback
- **Optimized Images**: Next.js Image optimization for fast loading
- **SEO Friendly**: Server-side rendering and meta tag optimization

### 📱 Pages & Components

#### Public Pages
- **Home Page**: Hero section, featured products, categories showcase
- **Shop Page**: Product grid with filtering and search capabilities
- **Product Detail Page**: Individual product information with reviews
- **Cart Page**: Shopping cart management
- **Login/Signup Pages**: User authentication forms

#### Protected Pages
- **User Profile**: Account management and order history
- **Admin Dashboard**: Product, order, and user management

#### Components
- **Header**: Navigation with cart badge and mobile menu
- **Footer**: Comprehensive footer with links and social media
- **ProductCard**: Enhanced product display with wishlist functionality
- **ProductGrid**: Responsive product listing
- **Auth Forms**: Styled login and signup forms

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom utilities
- **State Management**: Zustand for cart and auth state
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Fonts**: Inter font family

### Backend
- **Runtime**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt hashing
- **Validation**: Zod schemas for type safety

### Development Tools
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Package Manager**: npm
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/grainymart.git
   cd grainymart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/grainymart
   JWT_SECRET=your-super-secret-jwt-key
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Products
- `GET /api/products` - Get all products (with optional filtering)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/[id]` - Update product (Admin only)
- `DELETE /api/products/[id]` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile

### Reviews
- `GET /api/reviews` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/[id]` - Update review
- `DELETE /api/reviews/[id]` - Delete review

## 🎯 Usage Examples

### Adding Products to Cart
```typescript
import { useCartStore } from '@/stores/cartStore';

const { addItem } = useCartStore();

// Add product to cart
addItem({
  _id: 'product-id',
  name: 'Organic Brown Rice',
  price: 25.99,
  quantity: 1
});
```

### User Authentication
```typescript
import { useAuthStore } from '@/stores/authStore';

const { login, logout, user } = useAuthStore();

// Login user
await login({ email: 'user@example.com', password: 'password' });

// Logout user
logout();
```

### API Integration
```typescript
// Fetch products with filtering
const response = await fetch('/api/products?category=grains&minPrice=10&maxPrice=50');
const products = await response.json();
```

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📱 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Write tests for new features
- Update documentation as needed
- Ensure code passes linting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [MongoDB](https://www.mongodb.com/) for the database
- [Lucide](https://lucide.dev/) for beautiful icons
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at munazzajaved277@gmail.com
- Check our documentation for common solutions

---

**Made with love for healthy living and sustainable agriculture**
