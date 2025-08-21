from enum import Enum

class BrandStatus(str, Enum):
    ACTIVO = "activo"
    INACTIVO = "inactivo"
    PENDIENTE_APROBACION = "pendiente de aprobacion"
    RECHAZADO = "rechazado"
