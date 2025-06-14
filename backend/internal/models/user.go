package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID         uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	ClerkId    string    `gorm:"unique;not null" json:"clerkId"`
	Email      string    `gorm:"unique;not null" json:"email"`
	RefCode    string    `gorm:"unique;not null" json:"refCode"`
	RefCount   int       `gorm:"default:0" json:"refCount"`
	ReferredBy *string   `gorm:"type:uuid" json:"referredBy,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	if u.RefCode == "" {
		// Create a shorter referral code from UUID
		fullUUID := uuid.New()
		u.RefCode = fullUUID.String()[:8]
	}
	return nil
}
