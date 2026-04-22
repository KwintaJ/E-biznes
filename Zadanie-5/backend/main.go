package main

import (
    "net/http"
    "app/controller"
    "app/database"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

func main() {
    database.InitDB()

    e := echo.New()

    e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
        AllowOrigins: []string{"http://localhost:5173"},
        
        AllowMethods: []string{
            http.MethodGet, 
            http.MethodPost, 
            http.MethodPut, 
            http.MethodDelete, 
        },
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

    e.Logger.Fatal(e.Start(":8080"))
}