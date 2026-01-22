const Footer = () => {
  return (
    <footer className="bg-olive-green text-off-white p-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2026 GrainyMart. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-beige">Home</a>
          <a href="#" className="hover:text-beige">Shop</a>
          <a href="#" className="hover:text-beige">Login</a>
          <a href="#" className="hover:text-beige">Signup</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;