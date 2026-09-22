package com.company.service;

import com.company.entity.Product;
import com.company.exception.ProductNotFoundException;
import com.company.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    
    

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
 // Search products
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // Get product by ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                new ProductNotFoundException("Product not found with id: " + id));
               
    }

    // Add product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Update product
    public Product updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = getProductById(id);

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setSupplier(updatedProduct.getSupplier());

        return productRepository.save(existingProduct);
    }
    
    public Product updateStock(Long id, int quantity) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found with id: " + id));

        if (quantity < 0) {
            throw new IllegalArgumentException(
                    "Quantity cannot be negative");
        }

        product.setQuantity(quantity);

        return productRepository.save(product);
    }
    
    
 // Low stock products
    public List<Product> getLowStockProducts() {
        return productRepository.findByQuantityLessThanEqual(5);
    }

    // Delete product
    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        productRepository.deleteById(id);
    }
}