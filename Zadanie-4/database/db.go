package database

import (
    "kwintaj.com/shop/model"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var DB *gorm.DB
var cartID uint

func InitDB() {
    database, err := gorm.Open(sqlite.Open("shop.db"), &gorm.Config{})
    if err != nil {
        panic("Nie udało się połączyć z bazą danych!")
    }

    database.AutoMigrate(&model.Product{}, &model.Cart{}, &model.CartItem{})

    DB = database
}

func CartInit() {
    // czyszczenie koszykow (hard delete)
    DB.Unscoped().Where("1 = 1").Delete(&model.CartItem{})
    DB.Unscoped().Where("1 = 1").Delete(&model.Cart{})

    // stworzenie nowego koszyka
    newCart := model.Cart{}
    DB.Create(&newCart)
    cartID = newCart.ID
}

func GetCartID() uint {
    return cartID
}