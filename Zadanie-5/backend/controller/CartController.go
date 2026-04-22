package controller

import (
    "net/http"
    "strconv"
    "app/database"
    "app/model"
    "github.com/labstack/echo/v4"
)

func NewCart(c echo.Context) error {
    cart := new(model.Cart)

    database.DB.Create(&cart)
    return c.JSON(http.StatusCreated, cart)
}

func AddToCart(c echo.Context) error {    
    cartID, _ := strconv.Atoi(c.Param("cartid"))

    type AddRequest struct {
        ProductID uint    `json:"product_id"`
        Name      string  `json:"name"`
        Price     float64 `json:"price"`
        Quantity  int     `json:"quantity"`
    }

    req := new(AddRequest)
    if err := c.Bind(req); err != nil {
        return err
    }

    var cart model.Cart
    if err := database.DB.First(&cart, cartID).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Koszyk nie istnieje"})
    }

    var existingItem model.CartItem
    err := database.DB.Where("cart_id = ? AND product_id = ?", cartID, req.ProductID).First(&existingItem).Error

    if err == nil {
        existingItem.Quantity += req.Quantity
        database.DB.Save(&existingItem) 
    } else {
        var newItem model.CartItem
        newItem = model.CartItem{
                CartID:    uint(cartID),
                ProductID: req.ProductID,
                Name:      req.Name,
                Price:     req.Price,
                Quantity:  req.Quantity,
        }
        database.DB.Create(&newItem)
        
        database.DB.Model(&cart).Association("Items").Append(&newItem)
    }
    database.DB.Save(&cart)
    database.DB.Preload("Items").First(&cart, cartID)

    return c.JSON(http.StatusOK, cart)
}



func ChangeQuantity(c echo.Context) error {    
    cartID, _ := strconv.Atoi(c.Param("cartid"))
    itemID := c.Param("id")
    var item model.CartItem
    
    if err := database.DB.Where("id = ? AND cart_id = ?", itemID, cartID).First(&item).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Produktu nie ma w koszyku"})
    }

    type AddRequest struct {
        NewQuantity  int  `json:"quantity"`
    }

    req := new(AddRequest)
    if err := c.Bind(req); err != nil {
        return err
    }

    if req.NewQuantity < 1 {
        return c.JSON(http.StatusForbidden, item)
    }

    item.Quantity = req.NewQuantity

    database.DB.Save(&item)
    return c.JSON(http.StatusOK, item)
}

func DeleteFromCart(c echo.Context) error {
    cartID, _ := strconv.Atoi(c.Param("cartid"))
    itemID := c.Param("id")
    var item model.CartItem
    
    if err := database.DB.Where("id = ? AND cart_id = ?", itemID, cartID).First(&item).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Produktu nie ma w koszyku"})
    }
    
    database.DB.Delete(&item)
    return c.NoContent(http.StatusNoContent)
}

func GetCart(c echo.Context) error {
    cartID, _ := strconv.Atoi(c.Param("cartid"))

    var cart model.Cart

    if err := database.DB.Preload("Items").First(&cart, cartID).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Koszyk nie znaleziony"})
    }

    var currentTotal float64 = 0
    for _, item := range cart.Items {
        currentTotal += item.Price * float64(item.Quantity)
    }

    cart.Total = currentTotal

    return c.JSON(http.StatusOK, cart)
}