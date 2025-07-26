from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import os

# Módulos propios
import crud
from database import create_table, crear_tabla_clientes, crear_tabla_usuarios
from schemas import Producto, ClienteBase, ClienteRespuesta, UsuarioBase, UsuarioRespuesta, UsuarioLogin

# Crear app FastAPI
app = FastAPI(title="API de Productos y Clientes - E-commerce")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas en la base de datos
create_table()
crear_tabla_clientes()
crear_tabla_usuarios()

# === Ajuste importante: rutas absolutas relativas al archivo ===
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Montar carpeta de archivos estáticos (css, js, img)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "assets")), name="static")

# Configurar plantillas Jinja2 (html)
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "view"))

# ===============================
# CRUD PRODUCTOS
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
# CRUD CLIENTES
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
# REGISTRO Y LOGIN
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

# ===============================
# RUTAS HTML CON JINJA2
# ===============================

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/iniciarSesion", response_class=HTMLResponse)
def iniciar_sesion(request: Request):
    return templates.TemplateResponse("iniciarSesion.html", {"request": request})

@app.get("/registrarse", response_class=HTMLResponse)
def registrarse(request: Request):
    return templates.TemplateResponse("registrarse.html", {"request": request})

@app.get("/productos", response_class=HTMLResponse)
def productos(request: Request):
    return templates.TemplateResponse("productos.html", {"request": request})

@app.get("/cliente", response_class=HTMLResponse)
def cliente(request: Request):
    return templates.TemplateResponse("cliente.html", {"request": request})

@app.get("/admin", response_class=HTMLResponse)
def admin(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})

@app.get("/admin/productos/html", response_class=HTMLResponse)
def admin_productos(request: Request):
    return templates.TemplateResponse("adminProductos.html", {"request": request})

@app.get("/admin/clientes/html", response_class=HTMLResponse)
def admin_clientes(request: Request):
    return templates.TemplateResponse("adminClientes.html", {"request": request})
