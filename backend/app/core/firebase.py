"""
Firebase Admin SDK initialization and utilities
"""

import json
import os
from typing import Optional, Dict, Any
from google.cloud import firestore
from firebase_admin import credentials, auth, storage, initialize_app
from .config import settings

# Global Firebase instances
_firestore_client: Optional[firestore.Client] = None
_auth_client: Optional[auth.Client] = None
_storage_client: Optional[storage.Client] = None
_firebase_app = None

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    global _firebase_app, _firestore_client, _auth_client, _storage_client

    if _firebase_app is not None:
        return  # Already initialized

    try:
        # Initialize Firebase credentials
        cred = None

        # Try service account file first
        if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            print(f"📁 Using Firebase credentials from: {settings.FIREBASE_CREDENTIALS_PATH}")
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        elif "FIREBASE_CREDENTIALS_JSON" in os.environ:
            # Use environment variable
            print("🔧 Using Firebase credentials from environment variable")
            cred_dict = json.loads(os.environ["FIREBASE_CREDENTIALS_JSON"])
            cred = credentials.Certificate(cred_dict)
        else:
            # Use default credentials (for development)
            print("⚠️  Using default Firebase credentials (may not work for all services)")
            cred = credentials.ApplicationDefault()

        # Initialize Firebase app
        app_config = {
            'projectId': settings.FIREBASE_PROJECT_ID,
        }

        # Add database URL if provided
        if settings.FIREBASE_DATABASE_URL:
            app_config['databaseURL'] = settings.FIREBASE_DATABASE_URL

        _firebase_app = initialize_app(
            cred,
            app_config,
            name='bde-system'
        )

        # Initialize Firebase services
        _firestore_client = firestore.Client(app=_firebase_app)
        _auth_client = auth.Client(app=_firebase_app)
        _storage_client = storage.bucket(app=_firebase_app, name=f"{settings.FIREBASE_PROJECT_ID}.appspot.com")

        print(f"✅ Firebase initialized successfully for project: {settings.FIREBASE_PROJECT_ID}")
        print(f"🔥 Services: Firestore, Auth, Storage ready")

    except Exception as e:
        print(f"❌ Failed to initialize Firebase: {str(e)}")
        print("🔍 Please check:")
        print("   1. Firebase project exists and is properly configured")
        print("   2. Service account has necessary permissions")
        print("   3. Credentials file is valid and accessible")
        raise

def get_firestore() -> firestore.Client:
    """Get Firestore client instance"""
    if _firestore_client is None:
        initialize_firebase()
    return _firestore_client

def get_auth() -> auth.Client:
    """Get Firebase Auth client instance"""
    if _auth_client is None:
        initialize_firebase()
    return _auth_client

def get_storage() -> storage.Bucket:
    """Get Firebase Storage client instance"""
    if _storage_client is None:
        initialize_firebase()
    return _storage_client

async def verify_firebase_token(id_token: str) -> Dict[str, Any]:
    """
    Verify Firebase ID token and return decoded user data

    Args:
        id_token: Firebase ID token from client

    Returns:
        Decoded token data

    Raises:
        ValueError: If token is invalid
    """
    try:
        decoded_token = get_auth().verify_id_token(id_token)
        return decoded_token
    except auth.InvalidIdTokenError:
        raise ValueError("Invalid ID token")
    except auth.ExpiredIdTokenError:
        raise ValueError("ID token has expired")
    except auth.RevokedIdTokenError:
        raise ValueError("ID token has been revoked")
    except Exception as e:
        raise ValueError(f"Token verification failed: {str(e)}")

async def get_user_from_firestore(uid: str) -> Optional[Dict[str, Any]]:
    """
    Get user document from Firestore

    Args:
        uid: User UID from Firebase Auth

    Returns:
        User document data or None if not found
    """
    try:
        doc_ref = get_firestore().collection('users').document(uid)
        doc = doc_ref.get()

        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        print(f"Error getting user from Firestore: {str(e)}")
        return None

async def create_user_in_firestore(uid: str, user_data: Dict[str, Any]) -> bool:
    """
    Create user document in Firestore

    Args:
        uid: User UID from Firebase Auth
        user_data: User data to store

    Returns:
        True if successful, False otherwise
    """
    try:
        user_data.update({
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'lastLoginAt': firestore.SERVER_TIMESTAMP,
        })

        doc_ref = get_firestore().collection('users').document(uid)
        doc_ref.set(user_data)
        return True
    except Exception as e:
        print(f"Error creating user in Firestore: {str(e)}")
        return False

async def update_user_in_firestore(uid: str, update_data: Dict[str, Any]) -> bool:
    """
    Update user document in Firestore

    Args:
        uid: User UID from Firebase Auth
        update_data: User data to update

    Returns:
        True if successful, False otherwise
    """
    try:
        update_data.update({
            'updatedAt': firestore.SERVER_TIMESTAMP,
        })

        doc_ref = get_firestore().collection('users').document(uid)
        doc_ref.update(update_data)
        return True
    except Exception as e:
        print(f"Error updating user in Firestore: {str(e)}")
        return False

async def upload_file_to_storage(file_data: bytes, file_path: str, content_type: str) -> Optional[str]:
    """
    Upload file to Firebase Storage

    Args:
        file_data: File binary data
        file_path: Storage path for the file
        content_type: MIME type of the file

    Returns:
        Public URL of the uploaded file or None if failed
    """
    try:
        blob = get_storage().blob(file_path)
        blob.upload_from_string(file_data, content_type=content_type)
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(f"Error uploading file to storage: {str(e)}")
        return None

async def delete_file_from_storage(file_path: str) -> bool:
    """
    Delete file from Firebase Storage

    Args:
        file_path: Storage path of the file to delete

    Returns:
        True if successful, False otherwise
    """
    try:
        blob = get_storage().blob(file_path)
        blob.delete()
        return True
    except Exception as e:
        print(f"Error deleting file from storage: {str(e)}")
        return False