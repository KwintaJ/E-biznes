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
    Product   Product `json:"product" gorm:"foreignKey:ProductID"`
    Quantity  int     `json:"quantity"`
}