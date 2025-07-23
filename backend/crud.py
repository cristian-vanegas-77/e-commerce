# crud.py
from database import get_connection
from schemas import Producto, ClienteBase, UsuarioBase
import hashlib

# Esta función convierte una contraseña normal en una versión cifrada usando SHA-256.
# Esto se hace para proteger la contraseña y no guardarla en texto plano en la base de datos.
# El resultado es un hash (cadena larga de caracteres) que no se puede revertir fácilmente.
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# ------------------- Funciones Productos -------------------

def crear_producto(producto: Producto):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO productos (nombre, descripcion, precio, stock)
        VALUES (?, ?, ?, ?)
    """, (producto.nombre, producto.descripcion, producto.precio, producto.stock))
    conn.commit()
    id_producto = cursor.lastrowid
    conn.close()
    return id_producto

def listar_productos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    conn.close()
    return productos

def obtener_producto(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM productos WHERE id = ?", (id,))
    producto = cursor.fetchone()
    conn.close()
    return producto

def actualizar_producto(id: int, producto: Producto):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE productos
        SET nombre = ?, descripcion = ?, precio = ?, stock = ?
        WHERE id = ?
    """, (producto.nombre, producto.descripcion, producto.precio, producto.stock, id))
    conn.commit()
    conn.close()

def eliminar_producto(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM productos WHERE id = ?", (id,))
    conn.commit()
    conn.close()

# ------------------- Funciones Clientes -------------------

def crear_cliente(cliente: ClienteBase):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO clientes (nombre, correo, telefono)
        VALUES (?, ?, ?)
    """, (cliente.nombre, cliente.correo, cliente.telefono))
    conn.commit()
    id_cliente = cursor.lastrowid
    conn.close()
    return id_cliente

def obtener_clientes():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clientes")
    clientes = cursor.fetchall()
    conn.close()
    return clientes

def actualizar_clientes(id: int, cliente: ClienteBase):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE clientes
        SET nombre = ?, correo = ?, telefono = ?
        WHERE id = ?
    """, (cliente.nombre, cliente.correo, cliente.telefono, id))
    conn.commit()
    conn.close()

def eliminar_cliente(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clientes WHERE id = ?", (id,))
    conn.commit()
    conn.close()

# ------------------- Funciones Usuarios -------------------
def crear_usuario(usuario: UsuarioBase):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO usuarios (correo, contraseña, nombre, telefono, rol)
            VALUES (?, ?, ?, ?, ?)
        """, (
            usuario.correo,
            hash_password(usuario.contraseña),
            usuario.nombre,
            usuario.telefono,
            usuario.rol  # debe estar definido en el modelo UsuarioBase
        ))
        conn.commit()
        return cursor.lastrowid
    except Exception:
        raise Exception("No se pudo registrar el usuario. Verifica que el correo no esté en uso.")
    finally:
        conn.close()



def login_usuario(usuario):
    conn = get_connection()
    cursor = conn.cursor()
    contraseña_hash = hashlib.sha256(usuario.contraseña.encode()).hexdigest()
    cursor.execute("""
        SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?
    """, (usuario.correo, contraseña_hash))
    user = cursor.fetchone()
    conn.close()
    return user
