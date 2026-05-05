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

    var count int64
    database.Model(&model.Product{}).Count(&count)
    if count == 0 {
        products := []model.Product{
            {Name: "GeForce RTX 5080", Price: 6000},
            {Name: "Intel Core i9-14900K", Price: 2459.59},
            {Name: "Zasilacz be quiet 1000W", Price: 900},
            {Name: "Logitech MX Master 3S", Price: 499.99},
            {Name: "Klawiatura Keychron Q1", Price: 851.72},
        }
        database.Create(&products)
    }

    DB = database
}
