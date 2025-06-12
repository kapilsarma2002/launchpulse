package models

import (
	"time"

	"github.com/google/uuid"
)

type SiteSettings struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	LogoURL     string    `json:"logoUrl"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
