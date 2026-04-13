package model

import "gorm.io/gorm"

type Cart struct {
    gorm.Model
    Items []CartItem `json:"items"`
}

type CartItem struct {
    gorm.Model
    CartID    uint    `json:"cart_id"`
    ProductID uint    `json:"product_id"`
    Quantity  int     `json:"quantity"`
}