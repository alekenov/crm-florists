"""
Client schema models for API validation
"""

from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import validator
import re


class ClientBase(SQLModel):
    """Base client model with shared fields"""
    name: Optional[str] = None
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    client_type: str = "оба"  # "заказчик", "получатель", "оба"
    notes: Optional[str] = None


class ClientCreate(ClientBase):
    """Schema for creating a new client"""

    @validator("phone")
    def validate_phone(cls, v):
        """Validate phone number format"""
        if not v:
            raise ValueError("Phone number is required")

        # Remove all non-digit characters
        phone_digits = re.sub(r'\D', '', v)

        # Check if it's a valid Kazakhstan number
        if len(phone_digits) == 11 and phone_digits.startswith('7'):
            return f"+{phone_digits}"
        elif len(phone_digits) == 10 and phone_digits.startswith('7'):
            return f"+7{phone_digits}"
        elif len(phone_digits) == 10:
            return f"+7{phone_digits}"
        else:
            raise ValueError("Invalid phone number format. Expected format: +7XXXXXXXXXX")

    @validator("email")
    def validate_email(cls, v):
        """Validate email format if provided"""
        if v is not None and v.strip():
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, v.strip()):
                raise ValueError("Invalid email format")
            return v.strip()
        return v

    @validator("client_type")
    def validate_client_type(cls, v):
        """Validate client type"""
        valid_types = ["заказчик", "получатель", "оба"]
        if v not in valid_types:
            raise ValueError(f"Client type must be one of: {valid_types}")
        return v


class ClientRead(ClientBase):
    """Schema for reading client data"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ClientUpdate(SQLModel):
    """Schema for updating client data (all fields optional)"""
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    client_type: Optional[str] = None
    notes: Optional[str] = None

    @validator("phone")
    def validate_phone(cls, v):
        """Validate phone number format if provided"""
        if v is not None:
            # Remove all non-digit characters
            phone_digits = re.sub(r'\D', '', v)

            # Check if it's a valid Kazakhstan number
            if len(phone_digits) == 11 and phone_digits.startswith('7'):
                return f"+{phone_digits}"
            elif len(phone_digits) == 10 and phone_digits.startswith('7'):
                return f"+7{phone_digits}"
            elif len(phone_digits) == 10:
                return f"+7{phone_digits}"
            else:
                raise ValueError("Invalid phone number format. Expected format: +7XXXXXXXXXX")
        return v

    @validator("email")
    def validate_email(cls, v):
        """Validate email format if provided"""
        if v is not None and v.strip():
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, v.strip()):
                raise ValueError("Invalid email format")
            return v.strip()
        return v

    @validator("client_type")
    def validate_client_type(cls, v):
        """Validate client type if provided"""
        if v is not None:
            valid_types = ["заказчик", "получатель", "оба"]
            if v not in valid_types:
                raise ValueError(f"Client type must be one of: {valid_types}")
        return v