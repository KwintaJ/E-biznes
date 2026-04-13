package main

import (
    "kwintaj.com/shop/controller"
    "kwintaj.com/shop/database"
    "github.com/labstack/echo/v4"
)

func main() {
    database.InitDB()
    database.CartInit()
    
    e := echo.New()
    
    // Product routes
    p := e.Group("/products")
    p.GET("", controller.GetAllProducts)
    p.GET("/:id", controller.GetProduct)
    p.POST("", controller.CreateProduct)
    p.PUT("/:id", controller.UpdateProduct)
    p.DELETE("/:id", controller.DeleteProduct)

    // Cart routes
    c := e.Group("/cart")
    c.GET("", controller.GetCart)
    c.POST("", controller.AddToCart)
    c.PUT("/:id", controller.ChangeQuantity)
    c.DELETE("/:id", controller.DeleteFromCart)

    // Categories routes
    t := e.Group("/categories")
    t.GET("", controller.GetCategories)
    t.POST("", controller.CreateCategory)
    t.GET("/:id/products", controller.GetCategoryProducts)

    e.Logger.Fatal(e.Start(":8080"))
}