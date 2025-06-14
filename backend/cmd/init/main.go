package main

import (
	"log"

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

	// Auto-migrate schemas
	err = db.AutoMigrate(&models.User{}, &models.SiteSettings{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Check if settings exist
	var count int64
	db.Model(&models.SiteSettings{}).Count(&count)
	
	// Create default settings if none exist
	if count == 0 {
		settings := models.SiteSettings{
			Name:        "LaunchPulse",
			Description: "Create a waitlist that grows itself. Track referrals, reward early adopters, and launch with an audience.",
			LogoURL:     "",
		}

		if err := db.Create(&settings).Error; err != nil {
			log.Fatal("Failed to create default settings:", err)
		}
		log.Println("Created default site settings")
	}

	log.Println("Database initialization complete")
}
