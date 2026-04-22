package model

import "gorm.io/gorm"

type Payment struct {
    gorm.Model
    Amount  float64 `json:"amount"`
    Method  string  `json:"method"`     // card/blik/applepay
    Status  string  `json:"status"`     // pending/completed/failed
    CartID  uint    `json:"cart_id"`
}