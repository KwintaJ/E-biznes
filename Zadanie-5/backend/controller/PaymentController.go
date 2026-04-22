package controller

import (
    "net/http"
    "app/database"
    "app/model"
    "github.com/labstack/echo/v4"
)

func CreatePayment(c echo.Context) error {
    payment := new(model.Payment)

    if err := c.Bind(payment); err != nil {
        return err
    }

    payment.Status = "pending"

    database.DB.Create(&payment)
    return c.JSON(http.StatusCreated, payment)
}

func GetPayment(c echo.Context) error {
    id := c.Param("id")
    var payment model.Payment

    if err := database.DB.First(&payment, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Nieznana transakcja"})
    }

    return c.JSON(http.StatusOK, payment)
}

func FinalizePayment(c echo.Context) error {
    id := c.Param("id")
    stat := c.Param("status")
    var payment model.Payment
    
    if err := database.DB.First(&payment, id).Error; err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Nieznana transakcja"})
    }

    payment.Status = stat
    
    database.DB.Save(&payment)
    return c.JSON(http.StatusOK, payment)
}
