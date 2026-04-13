package controller

import (
    "net/http"
    "strconv"
    "kwintaj.com/shop/model"
    "github.com/labstack/echo/v4"
)

// mock database
var nextID = 3
var products = []model.Product{
    {ID: 1, Name: "Laptop", Price: 3500.00},
    {ID: 2, Name: "Myszka", Price: 150.00},
}

func GetAllProducts(c echo.Context) error {
    return c.JSON(http.StatusOK, products)
}

func GetProduct(c echo.Context) error {
    id, _ := strconv.Atoi(c.Param("id"))
    for _, p := range products {
        if p.ID == id {
            return c.JSON(http.StatusOK, p)
        }
    }
    return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nieznaleziony"})
}

func CreateProduct(c echo.Context) error {
    p := new(model.Product)
    if err := c.Bind(p); err != nil {
        return err
    }
    p.ID = nextID
    nextID++
    products = append(products, *p)
    return c.JSON(http.StatusCreated, p)
}

func UpdateProduct(c echo.Context) error {
    id, _ := strconv.Atoi(c.Param("id"))
    for i, p := range products {
        if p.ID == id {
            newProduct := new(model.Product)
            if err := c.Bind(newProduct); err != nil {
                return err
            }
            newProduct.ID = id
            products[i] = *newProduct
            return c.JSON(http.StatusOK, newProduct)
        }
    }
    return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie istnieje"})
}

func DeleteProduct(c echo.Context) error {
    id, _ := strconv.Atoi(c.Param("id"))
    for i, p := range products {
        if p.ID == id {
            products = append(products[:i], products[i+1:]...)
            return c.NoContent(http.StatusNoContent)
        }
    }
    return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie istnieje"})
}