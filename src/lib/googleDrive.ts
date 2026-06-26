// Google Drive REST API Helper (v3)
// Handles authentication callback token storage, token expiration, backup uploads, and restores.

export interface GoogleOAuthToken {
    accessToken: string;
    expiresAt: number; // epoch timestamp in ms
}

const TOKEN_KEY = "tasbeehly_google_drive_token";
const EXPIRES_AT_KEY = "tasbeehly_google_drive_expires_at";
const CLIENT_ID_KEY = "tasbeehly_google_client_id";

// Get stored Client ID
export function getStoredClientId(): string {
    return localStorage.getItem(CLIENT_ID_KEY) || "";
}

// Store Client ID
export function storeClientId(clientId: string) {
    localStorage.setItem(CLIENT_ID_KEY, clientId.trim());
}

// Get access token (returns null if expired or missing)
export function getAccessToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiresAtStr = localStorage.getItem(EXPIRES_AT_KEY);
    
    if (!token || !expiresAtStr) return null;
    
    const expiresAt = Number(expiresAtStr);
    const now = Date.now();
    
    // Check if token is expired (with 5-minute buffer)
    if (now >= expiresAt - 5 * 60 * 1000) {
        // Token is expired, clean up
        disconnectGoogleDrive();
        return null;
    }
    
    return token;
}

// Disconnect and clear credentials
export function disconnectGoogleDrive() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
}

// Redirect user to Google OAuth 2.0 endpoint
export function authorizeGoogleDrive(clientId: string) {
    if (!clientId) {
        throw new Error("Client ID is required to authorize Google Drive");
    }
    
    storeClientId(clientId);
    
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = "https://www.googleapis.com/auth/drive.file";
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent(scope)}` +
        `&prompt=consent`;
        
    window.location.href = authUrl;
}

// Read OAuth redirect parameters from hash fragment
export function handleOAuthCallback(): boolean {
    const hash = window.location.hash;
    if (!hash) return false;
    
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const expiresIn = params.get("expires_in");
    
    if (accessToken) {
        const durationSec = Number(expiresIn || "3600");
        const expiresAt = Date.now() + durationSec * 1000;
        
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
        
        // Clean hash from browser URL without reloading
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        return true;
    }
    
    return false;
}

// Helper to make authorized fetch requests
async function driveFetch(url: string, options: RequestInit, accessToken: string) {
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${accessToken}`);
    
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Google Drive API error: ${response.status}`);
    }
    return response;
}

// Search for 'tasbeehly_backup.json' in user's Drive
export async function findBackupFile(accessToken: string): Promise<string | null> {
    const query = encodeURIComponent("name = 'tasbeehly_backup.json' and trashed = false");
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
    
    const response = await driveFetch(url, { method: "GET" }, accessToken);
    const data = await response.json();
    
    if (data.files && data.files.length > 0) {
        return data.files[0].id;
    }
    return null;
}

// Backup (Upload) app data to Google Drive
export async function uploadBackup(accessToken: string, fileData: string): Promise<void> {
    const fileId = await findBackupFile(accessToken);
    
    if (fileId) {
        // File exists, patch/update its contents
        const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
        await driveFetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: fileData
        }, accessToken);
    } else {
        // File does not exist, create metadata first
        const metadataUrl = "https://www.googleapis.com/drive/v3/files";
        const metadataResponse = await driveFetch(metadataUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "tasbeehly_backup.json",
                mimeType: "application/json"
            })
        }, accessToken);
        
        const fileMetadata = await metadataResponse.json();
        const newFileId = fileMetadata.id;
        
        // Patch file contents
        const contentUrl = `https://www.googleapis.com/upload/drive/v3/files/${newFileId}?uploadType=media`;
        await driveFetch(contentUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: fileData
        }, accessToken);
    }
}

// Restore (Download) app data from Google Drive
export async function downloadBackup(accessToken: string): Promise<string> {
    const fileId = await findBackupFile(accessToken);
    if (!fileId) {
        throw new Error("No backup file found in your Google Drive.");
    }
    
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await driveFetch(url, { method: "GET" }, accessToken);
    return await response.text();
}
