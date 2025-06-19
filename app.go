package main

import (
	"context"
	"fmt"
	"guidemo/utils"
)

// 16 字节的密钥
const DECODEKEY = "11.nWv01123f000n"

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// EncryptContent returns the encrypted string
func (a *App) EncryptContent(content, key string) string {
	actualKey := DECODEKEY
	if key != "" {
		actualKey = key
	}

	encrypted, err := utils.EncodeCFB(content, actualKey)
	if err != nil {
		return fmt.Sprintf("Encryption error: %s", err.Error())
	}
	return encrypted
}

// DecryptContent returns the decrypted string
func (a *App) DecryptContent(encodedContent, key string) string {
	actualKey := DECODEKEY
	if key != "" {
		actualKey = key
	}

	decrypted, err := utils.DecodeCFB(encodedContent, actualKey)
	if err != nil {
		return fmt.Sprintf("Decryption error: %s", err.Error())
	}
	return decrypted
}
