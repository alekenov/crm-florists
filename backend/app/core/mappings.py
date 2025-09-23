"""
Status mappings and converters for the CRM system
Provides bidirectional mapping between contract codes and RU labels
"""
from app.models.enums import OrderStatus


# Mapping from contract codes to RU labels
STATUS_EN_TO_RU = {
    "new": "новый",
    "paid": "оплачен",
    "accepted": "принят",
    "assembled": "собран",
    "in-transit": "в доставке",
    "completed": "доставлен",
    "canceled": "отменен"
}

# Reverse mapping for input validation (RU -> contract)
STATUS_RU_TO_EN = {
    "новый": "new",
    "оплачен": "paid",
    "принят": "accepted",
    "собран": "assembled",
    "в доставке": "in-transit",
    "в пути": "in-transit",  # альтернативное название
    "доставлен": "completed",
    "завершен": "completed",  # альтернативное название
    "отменен": "canceled",
    # Legacy support
    "в работе": "accepted",
    "готов": "assembled"
}


def normalize_status(status: str) -> OrderStatus:
    """
    Normalize status string to OrderStatus enum
    Accepts contract codes, RU labels, and legacy values
    """
    # If already an enum, return it
    if isinstance(status, OrderStatus):
        return status

    # Normalize to lowercase for comparison
    status_lower = status.lower()

    # Try as contract code first (already lowercase)
    try:
        return OrderStatus(status_lower)
    except ValueError:
        pass

    # Try uppercase variants (legacy support)
    status_upper = status.upper()
    legacy_mappings = {
        "NEW": OrderStatus.NEW,
        "IN_PROGRESS": OrderStatus.ACCEPTED,
        "IN_WORK": OrderStatus.ACCEPTED,
        "ASSEMBLED": OrderStatus.ASSEMBLED,
        "READY": OrderStatus.ASSEMBLED,
        "COLLECTED": OrderStatus.ASSEMBLED,
        "ON_DELIVERY": OrderStatus.IN_TRANSIT,
        "DELIVERED": OrderStatus.COMPLETED,
        "CANCELED": OrderStatus.CANCELED,
        "PAID": OrderStatus.PAID
    }
    if status_upper in legacy_mappings:
        return legacy_mappings[status_upper]

    # Try as RU label
    if status_lower in STATUS_RU_TO_EN:
        contract_code = STATUS_RU_TO_EN[status_lower]
        return OrderStatus(contract_code)

    # Default to NEW if unknown
    return OrderStatus.NEW


def get_status_label_ru(status: OrderStatus) -> str:
    """Get Russian label for status enum"""
    return STATUS_EN_TO_RU.get(status.value, status.value)