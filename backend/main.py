from fastapi import FastAPI, HTTPException
import crud
from database import create_table, crear_tabla_clientes, crear_tabla_usuarios
from schemas import Producto, ClienteBase, ClienteRespuesta, UsuarioBase, UsuarioRespuesta, UsuarioLogin
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API de Productos y Clientes - E-commerce")

# Middleware CORS (habilitar conexión con el frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas al iniciar
create_table()
crear_tabla_clientes()
crear_tabla_usuarios()

# ===============================
# SECCIÓN ADMIN: CRUD PRODUCTOS
# ===============================

@app.post("/admin/productos/", response_model=int)
def crear_producto(producto: Producto):
    return crud.crear_producto(producto)

@app.get("/admin/productos/")
def listar_productos():
    productos = crud.listar_productos()
    return [dict(p) for p in productos]

@app.get("/admin/productos/{id}")
def obtener_producto(id: int):
    producto = crud.obtener_producto(id)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return dict(producto)

@app.put("/admin/productos/{id}")
def actualizar_producto(id: int, producto: Producto):
    crud.actualizar_producto(id, producto)
    return {"mensaje": "Producto actualizado"}

@app.delete("/admin/productos/{id}")
def eliminar_producto(id: int):
    crud.eliminar_producto(id)
    return {"mensaje": "Producto eliminado"}

# ===============================
# SECCIÓN ADMIN: CRUD CLIENTES
# ===============================

@app.post("/admin/clientes/", response_model=int)
def crear_cliente(cliente: ClienteBase):
    return crud.crear_cliente(cliente)

@app.get("/admin/clientes/", response_model=list[ClienteRespuesta])
def listar_clientes():
    clientes = crud.obtener_clientes()
    return [ClienteRespuesta(**dict(c)) for c in clientes]

@app.put("/admin/clientes/{id}")
def actualizar_clientes(id: int, cliente: ClienteBase): 
    crud.actualizar_clientes(id, cliente)
    return {"mensaje": "Cliente actualizado"}

@app.delete("/admin/clientes/{id}")
def eliminar_cliente(id: int):
    crud.eliminar_cliente(id)
    return {"mensaje": "Cliente eliminado"}

# ===============================
# Registro y login
# ===============================

@app.post("/registro/")
def registrar(usuario: UsuarioBase):
    id_usuario = crud.crear_usuario(usuario)
    cliente = ClienteBase(nombre=usuario.nombre, correo=usuario.correo, telefono=usuario.telefono)
    crud.crear_cliente(cliente)
    return {"mensaje": "Usuario registrado correctamente", "usuario_id": id_usuario}

@app.post("/login/", response_model=UsuarioRespuesta)
def login(usuario: UsuarioLogin):
    user = crud.login_usuario(usuario)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    return UsuarioRespuesta(**dict(user))
