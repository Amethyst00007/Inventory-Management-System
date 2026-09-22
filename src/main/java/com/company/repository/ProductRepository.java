package com.company.repository;

import com.company.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByQuantityLessThanEqual(int quantity);
    
}