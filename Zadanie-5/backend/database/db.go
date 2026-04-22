package database

import (
    "app/model"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
    database, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
    if err != nil {
        panic("Nie udało się połączyć z bazą danych!")
    }

    database.AutoMigrate(&model.Product{}, &model.Payment{}, &model.Cart{}, &model.CartItem{})

    DB = database
}
