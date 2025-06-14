package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/kapilsarma2002/launchpulse/backend/internal/handlers"
	"github.com/kapilsarma2002/launchpulse/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Database connection
	dsn := "host=localhost user=postgres password=postgres dbname=launchpulse port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate the schema
	db.AutoMigrate(&models.User{})

	// Initialize Fiber app
	app := fiber.New()

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Initialize handlers
	h := handlers.NewHandler(db)

	// Routes
	api := app.Group("/api")
	api.Post("/signup", h.Signup)
	api.Post("/clerk-user", h.CreateClerkUser)
	api.Get("/stats", h.GetStats)
	api.Get("/settings", h.GetSiteSettings)
	api.Post("/settings", h.UpdateSiteSettings)
	api.Get("/analytics", h.GetAnalytics)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Fatal(app.Listen(":" + port))
}
