"""
Enum definitions for CRM Florist System
Matching the working SQLModel data structure
"""
from enum import Enum


class ClientType(str, Enum):
    CUSTOMER = "заказчик"
    RECIPIENT = "получатель"
    BOTH = "оба"


class OrderStatus(str, Enum):
    NEW = "новый"
    IN_WORK = "в работе"
    READY = "готов"
    DELIVERED = "доставлен"
    PAID = "оплачен"
    COLLECTED = "собран"
    CANCELED = "отменен"


class ProductCategory(str, Enum):
    BOUQUET = "букет"
    COMPOSITION = "композиция"
    POTTED = "горшечный"