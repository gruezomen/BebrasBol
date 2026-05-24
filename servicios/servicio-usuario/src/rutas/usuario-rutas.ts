import { Router } from 'express';

import { usuarioControlador } from '../controladores/usuario-controlador';

/**
 * Rutas del modulo de usuarios.
 *
 * GET / - Listar usuarios con paginación y filtros (REQ-010)
 * POST / - Crear usuario manualmente (REQ-004)
 *
 * NOTA: la restriccion "solo administrador" (REQ-004 sub-tarea de permisos)
 * depende del middleware de autorizacion de REQ-009, que aun no existe.
 * Cuando exista, se montara aqui antes del controlador. Por ahora el
 * endpoint queda abierto a proposito (acordado con el equipo).
 */
const usuarioRutas: Router = Router();

// GET: Listar usuarios con paginación y filtros (REQ-010)
usuarioRutas.get('/', (req, res, next) => {
  void usuarioControlador.listar(req, res, next);
});

// POST: Crear usuario manualmente (REQ-004)
usuarioRutas.post('/', (req, res, next) => {
  void usuarioControlador.crear(req, res, next);
});

export default usuarioRutas;