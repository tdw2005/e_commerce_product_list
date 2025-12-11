# e_commerce_product_list

This is an e-commerce product listing application built with React, featuring product browsing, filtering, sorting, and a shopping cart system—ideal as a reference for frontend development of e-commerce websites or product showcase platforms.

## Project Features

- **Product Display**: Shows product information in card format, including images, names, prices, and more.
- **Filtering**: Supports side-panel-based categorization filters for products.
- **Sorting**: Enables sorting products by price, ratings, and other criteria.
- **Shopping Cart System**: Users can add products to the cart and proceed to checkout.
- **Responsive Design**: Optimized for seamless display across various devices.
- **Virtual Scrolling**: Implements virtual scrolling to enhance performance when displaying large product lists.

## Technology Stack

- **React**: Frontend framework
- **Redux Toolkit**: State management
- **Ant Design**: UI component library
- **React Virtualized**: Virtual scrolling implementation
- **React Router**: Routing management
- **Axios**: HTTP request library

## Directory Structure

```
src/
├── components/                # Reusable components
├── hooks/                     # Custom hooks
├── pages/                     # Page components
├── store/                     # Redux state management
├── utils/                     # Utility functions
├── App.js                     # Root component
├── index.js                   # Entry file
```

## Installation and Setup

Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

```bash
# Clone the project
git clone https://gitee.com/tdw2005/e_commerce_product_list.git

# Navigate to the project directory
cd e_commerce_product_list

# Install dependencies
npm install

# Start the development server
npm start
```

The application will run at `http://localhost:3000`.

## Usage Instructions

- **Home Page**: Displays the product list, sorted by recommendation by default.
- **Filtering**: Click on the left-side filter panel to filter products by category, price range, etc.
- **Sorting**: Click on the sorting options at the top to sort products by price, rating, etc.
- **Shopping Cart**: Click the “Add to Cart” button to add items; view and checkout items on the cart page.

## Contribution Guidelines

Issues and pull requests are welcome! Please follow these steps:

1. Fork the project
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please contact [tdw2005@gitee.com](mailto:tdw2005@gitee.com).