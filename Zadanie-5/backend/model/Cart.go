package model

import "gorm.io/gorm"

type Cart struct {
    gorm.Model
    Items   []CartItem  `gorm:"foreignKey:CartID" json:"items"`
    Total   float64     `json:"total"`
}

type CartItem struct {
    gorm.Model
    CartID    uint    `json:"cart_id"`
    ProductID uint    `json:"product_id"`
    Name      string  `json:"name"`
    Price     float64 `json:"price"`
    Quantity  int     `json:"quantity"`
}