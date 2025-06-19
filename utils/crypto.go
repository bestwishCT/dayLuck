package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"errors"
	"strings"
)

func addBytes(iv, data []byte) []byte {
	// 将 IV 和加密数据合并
	return append(iv, data...)
}

func EncodeCFB(content, key string) (string, error) {
	if len(content) == 0 {
		return "", nil
	}

	if len(key) != 16 && len(key) != 24 && len(key) != 32 {
		return "", errors.New("invalid key size, must be 16, 24, or 32 bytes long")
	}

	buffer := []byte(content)

	// Create IV (initialization vector) from the content bytes
	iv := make([]byte, aes.BlockSize) // 16 bytes for AES
	for i := 0; i < aes.BlockSize && i < len(buffer); i++ {
		iv[i] = buffer[i]
	}

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}
	mode := cipher.NewCFBEncrypter(block, iv)

	// Encrypt the content
	encrypted := make([]byte, len(buffer))
	mode.XORKeyStream(encrypted, buffer)

	ivEncrypted := addBytes(iv, encrypted)
	encodeBase64Str := base64.StdEncoding.EncodeToString(ivEncrypted)
	encodeBase64Str = strings.ReplaceAll(encodeBase64Str, "+", "-")
	encodeBase64Str = strings.ReplaceAll(encodeBase64Str, "/", "_")

	return encodeBase64Str, nil
}

func DecodeCFB(encodedContent, key string) (string, error) {
	if len(encodedContent) == 0 {
		return "", nil
	}

	// Replace characters back to original from base64 encoding
	encodedContent = strings.ReplaceAll(encodedContent, "-", "+")
	encodedContent = strings.ReplaceAll(encodedContent, "_", "/")

	// Decode base64
	decoded, err := base64.StdEncoding.DecodeString(encodedContent)
	if err != nil {
		return "", err
	}

	// The first block is the IV
	iv := decoded[:aes.BlockSize]
	encrypted := decoded[aes.BlockSize:]

	// Create a new AES cipher
	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	// Create a CFB decrypter
	mode := cipher.NewCFBDecrypter(block, iv)

	// Decrypt the content
	decrypted := make([]byte, len(encrypted))
	mode.XORKeyStream(decrypted, encrypted)

	// Convert decrypted bytes back to string
	return string(decrypted), nil
}
