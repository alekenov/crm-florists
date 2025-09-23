"""
Common schema models for API validation
"""

from typing import Optional, Any, Dict, List
from sqlmodel import SQLModel, Field
from pydantic import validator


class PaginationParams(SQLModel):
    """Pagination parameters for list endpoints"""
    skip: int = Field(default=0, ge=0, description="Number of records to skip")
    limit: int = Field(default=100, ge=1, le=1000, description="Number of records to return")
    search: Optional[str] = Field(default=None, description="Search query")
    sort_by: Optional[str] = Field(default=None, description="Field to sort by")
    sort_order: Optional[str] = Field(default="asc", description="Sort order: asc or desc")

    @validator("sort_order")
    def validate_sort_order(cls, v):
        """Validate sort order"""
        if v is not None and v not in ["asc", "desc"]:
            raise ValueError("Sort order must be 'asc' or 'desc'")
        return v


class StatusUpdateRequest(SQLModel):
    """Request model for updating status"""
    status: str
    comment: Optional[str] = None

    @validator("status")
    def validate_status(cls, v):
        """Validate status value"""
        if not v or not v.strip():
            raise ValueError("Status is required")
        return v.strip()


class CommonResponse(SQLModel):
    """Common response model"""
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None


class ErrorResponse(SQLModel):
    """Error response model"""
    success: bool = False
    error: str
    details: Optional[Dict[str, Any]] = None
    code: Optional[str] = None


class PaginatedResponse(SQLModel):
    """Paginated response model"""
    items: List[Any]
    total: int = Field(ge=0)
    skip: int = Field(ge=0)
    limit: int = Field(ge=1)
    has_more: bool = False

    def __init__(self, **data):
        super().__init__(**data)
        # Calculate has_more based on total, skip, and limit
        self.has_more = (self.skip + self.limit) < self.total


class BulkOperationRequest(SQLModel):
    """Request model for bulk operations"""
    ids: List[int] = Field(min_items=1)
    action: str
    data: Optional[Dict[str, Any]] = None

    @validator("action")
    def validate_action(cls, v):
        """Validate action value"""
        if not v or not v.strip():
            raise ValueError("Action is required")
        return v.strip()


class BulkOperationResponse(SQLModel):
    """Response model for bulk operations"""
    success_count: int = Field(ge=0)
    error_count: int = Field(ge=0)
    total_count: int = Field(ge=0)
    errors: List[Dict[str, Any]] = []
    successful_ids: List[int] = []