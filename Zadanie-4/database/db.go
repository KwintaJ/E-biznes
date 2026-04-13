package database

import (
    "kwintaj.com/shop/model"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
    database, err := gorm.Open(sqlite.Open("shop.db"), &gorm.Config{})
    if err != nil {
        panic("Nie udało się połączyć z bazą danych!")
    }

    database.AutoMigrate(&model.Product{})

    DB = database
}