package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/kapilsarma2002/launchpulse/backend/internal/models"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

type SignupRequest struct {
	Email        string `json:"email"`
	ReferralCode string `json:"referralCode,omitempty"`
}

type DailyStats struct {
	Date      string `json:"date"`
	Signups   int64  `json:"signups"`
	Referrals int64  `json:"referrals"`
}

type ReferralSource struct {
	Source string `json:"source"`
	Count  int64  `json:"count"`
}

type AnalyticsResponse struct {
	TotalSignups    int64            `json:"totalSignups"`
	TotalReferrals  int64            `json:"totalReferrals"`
	SignupsToday    int64            `json:"signupsToday"`
	ReferralsToday  int64            `json:"referralsToday"`
	ConversionRate  float64          `json:"conversionRate"`
	DailyGrowth     []DailyStats     `json:"dailyGrowth"`
	ReferralSources []ReferralSource `json:"referralSources"`
}

type ClerkUserRequest struct {
	ClerkId string `json:"clerkId"`
	Email   string `json:"email"`
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

func (h *Handler) Signup(c *fiber.Ctx) error {
	var req SignupRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Check if user already exists
	var existingUser models.User
	if result := h.DB.Where("email = ?", req.Email).First(&existingUser); result.Error == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Email already registered",
		})
	}

	user := models.User{
		Email: req.Email,
	}

	// Handle referral
	if req.ReferralCode != "" {
		var referrer models.User
		if result := h.DB.Where("ref_code = ?", req.ReferralCode).First(&referrer); result.Error == nil {
			refID := referrer.ID.String()
			user.ReferredBy = &refID

			// Increment referrer's count
			h.DB.Model(&referrer).Update("ref_count", referrer.RefCount+1)
		}
	}

	if err := h.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Successfully joined waitlist",
		"refCode": user.RefCode,
	})
}

func (h *Handler) GetStats(c *fiber.Ctx) error {
	var totalUsers int64
	var totalReferrals int64

	h.DB.Model(&models.User{}).Count(&totalUsers)
	h.DB.Model(&models.User{}).Where("referred_by IS NOT NULL").Count(&totalReferrals)

	return c.JSON(fiber.Map{
		"totalUsers":     totalUsers,
		"totalReferrals": totalReferrals,
	})
}

func (h *Handler) UpdateSiteSettings(c *fiber.Ctx) error {
	var settings models.SiteSettings
	if err := c.BodyParser(&settings); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Update or create settings
	var existingSettings models.SiteSettings
	result := h.DB.First(&existingSettings)
	if result.Error != nil {
		// Create new settings
		if err := h.DB.Create(&settings).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create settings",
			})
		}
	} else {
		// Update existing settings
		h.DB.Model(&existingSettings).Updates(settings)
	}

	return c.JSON(settings)
}

func (h *Handler) GetSiteSettings(c *fiber.Ctx) error {
	var settings models.SiteSettings
	if err := h.DB.First(&settings).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Site settings not found",
		})
	}
	return c.JSON(settings)
}

func (h *Handler) GetAnalytics(c *fiber.Ctx) error {
	var response AnalyticsResponse

	// Get total signups
	h.DB.Model(&models.User{}).Count(&response.TotalSignups)

	// Get total referrals
	h.DB.Model(&models.User{}).Where("referred_by IS NOT NULL").Count(&response.TotalReferrals)

	// Get today's stats
	today := time.Now().UTC().Truncate(24 * time.Hour)
	h.DB.Model(&models.User{}).Where("created_at >= ?", today).Count(&response.SignupsToday)
	h.DB.Model(&models.User{}).Where("referred_by IS NOT NULL AND created_at >= ?", today).Count(&response.ReferralsToday)

	// Calculate conversion rate
	if response.TotalSignups > 0 {
		response.ConversionRate = float64(response.TotalReferrals) / float64(response.TotalSignups) * 100
	}

	// Get daily growth for the last 7 days
	var dailyStats []DailyStats
	for i := 6; i >= 0; i-- {
		date := today.AddDate(0, 0, -i)
		nextDate := date.AddDate(0, 0, 1)

		var stats DailyStats
		stats.Date = date.Format("1/2") // MM/DD format

		h.DB.Model(&models.User{}).
			Where("created_at >= ? AND created_at < ?", date, nextDate).
			Count(&stats.Signups)

		h.DB.Model(&models.User{}).
			Where("referred_by IS NOT NULL AND created_at >= ? AND created_at < ?", date, nextDate).
			Count(&stats.Referrals)

		dailyStats = append(dailyStats, stats)
	}
	response.DailyGrowth = dailyStats

	// Get referral sources
	var sources []ReferralSource

	// Direct signups (no referral)
	var directCount int64
	h.DB.Model(&models.User{}).Where("referred_by IS NULL").Count(&directCount)
	sources = append(sources, ReferralSource{Source: "Direct", Count: directCount})

	// Referral signups
	var referralCount int64
	h.DB.Model(&models.User{}).Where("referred_by IS NOT NULL").Count(&referralCount)
	sources = append(sources, ReferralSource{Source: "Referral", Count: referralCount})

	response.ReferralSources = sources

	return c.JSON(response)
}

func (h *Handler) CreateClerkUser(c *fiber.Ctx) error {
	var req ClerkUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Check if user already exists
	var existingUser models.User
	if result := h.DB.Where("clerk_id = ?", req.ClerkId).First(&existingUser); result.Error == nil {
		return c.Status(fiber.StatusOK).JSON(existingUser)
	}

	user := models.User{
		ClerkId: req.ClerkId,
		Email:   req.Email,
	}

	if err := h.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(user)
}
