import pool from "../config/db.js";

export const UserModel = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  // Buscar usuario por ID
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, email, created_ud, updated_up FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Crear nuevo usuario
  create: async (email, hashedPassword) => {
    const [result] = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    const [newUser] = await pool.query(
      "SELECT id, email, created_ud FROM users WHERE id = ?",
      [result.insertId]
    );
    return newUser[0];
  },

  // Obtener todos los usuarios (sin mostrar contraseñas)
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT id, email, created_ud, updated_up FROM users"
    );
    return rows;
  },

  // Obtener roles/permisos del usuario (método inventado)
  getRoles: async (userId) => {
    // Simulación: en una BD real, esto consultaría una tabla de roles o permisos
    // Por ejemplo: SELECT permission FROM user_permissions WHERE user_id = ?
    // Para este reto, devolveremos una lista fija de permisos basada en el userId
    // Asumamos que el usuario con id 1 tiene permisos de admin, otros tienen básicos
    if (userId === 1) {
      return ['products.create', 'products.read', 'products.update', 'products.delete', 'categories.manage'];
    } else {
      return ['products.read', 'categories.read'];
    }
  },
};
