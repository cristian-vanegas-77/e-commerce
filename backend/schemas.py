# schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# Esquema para los productos
class Producto(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    stock: int

# Esquema base de clientes (para crear o actualizar)
class ClienteBase(BaseModel):
    nombre: str
    correo: EmailStr  # valida que el correo tenga formato válido
    telefono: Optional[str] = None  # equivale a str | None

# Esquema para mostrar clientes (respuesta con ID incluido)
class ClienteRespuesta(ClienteBase):
    id: int

# Esquema base de usuarios (para crear o actualizar)
class UsuarioBase(BaseModel):
    correo: str
    contrasena: str
    nombre: str
    telefono: str | None = None
    rol: str = "cliente"  # por defecto todos son clientes

class UsuarioLogin(BaseModel):
    correo: str
    contrasena: str

# Esquema para mostrar usuarios
class UsuarioRespuesta(BaseModel):
    id: int
    correo: str
    nombre: str
    rol: str

