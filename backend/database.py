# database.py
import sqlite3

# Función para obtener la conexión a la base de datos
def get_connection():
    conn = sqlite3.connect("ecommerce.db")
    conn.row_factory = sqlite3.Row  # Para acceder a columnas como diccionario
    return conn

# Crear tabla de productos si no existe
def create_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL NOT NULL,
            stock INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# Crear tabla de clientes si no existe
def crear_tabla_clientes():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo TEXT UNIQUE NOT NULL,
            telefono TEXT
        )
    """)
    conn.commit()
    conn.close()

# Crear tabla de clientes si no existe 
def crear_tabla_usuarios():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            correo TEXT UNIQUE NOT NULL,
            contraseña TEXT NOT NULL,
            nombre TEXT NOT NULL,
            telefono TEXT,
            rol TEXT DEFAULT 'cliente'
            );
    """)
    conn.commit()
    conn.close()
