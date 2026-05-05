package main

import (
    "app/controller"
    "app/database"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

func main() {
    database.InitDB()

    e := echo.New()

    // Konfiguracja CORS
    e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
        AllowOrigins: []string{"*"},
        AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
        AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
    }))
    
    // Product routes
    p := e.Group("/products")
    p.GET("", controller.GetAllProducts)
    p.GET("/:id", controller.GetProduct)
    p.POST("", controller.CreateProduct)
    p.PUT("/:id", controller.UpdateProduct)
    p.DELETE("/:id", controller.DeleteProduct)
    
    // Payment routes
    n := e.Group("/payments")
    n.GET("/:id", controller.GetPayment)
    n.POST("", controller.CreatePayment)
    n.PUT("/:id/:status", controller.FinalizePayment)

    // Cart routes
    c := e.Group("/cart")
    c.GET("/:cartid", controller.GetCart)
    c.POST("", controller.NewCart)
    c.POST("/:cartid", controller.AddToCart)
    c.PUT("/:cartid/:id", controller.ChangeQuantity)
    c.DELETE("/:cartid/:id", controller.DeleteFromCart)

    e.Logger.Fatal(e.Start(":8080"))
}