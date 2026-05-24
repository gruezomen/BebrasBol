import type { usuarios } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

import type { ConsultaUsuariosQuery } from '../dtos/consulta-usuarios.dto';
import { crearUsuarioServicio } from '../servicios/usuario-servicio';
import { validarCrearUsuario } from '../utilidades/validar-crear-usuario';

type UsuarioServicio = ReturnType<typeof crearUsuarioServicio>;

interface UsuarioPublico {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  rol: usuarios['rol'];
  nombreUsuario: string | null;
  telefono: string | null;
  estaActivo: boolean;
  estaVerificado: boolean;
  creadoEn: Date;
}

interface UsuarioControlador {
  crear(req: Request, res: Response, next: NextFunction): Promise<void>;
  listar(req: Request, res: Response, next: NextFunction): Promise<void>;
}

// Nunca se expone contrasena_hash al cliente (regla de seguridad del estandar).
const aRespuestaPublica = (usuario: usuarios): UsuarioPublico => ({
  id: usuario.id,
  correo: usuario.correo,
  nombres: usuario.nombres,
  apellidos: usuario.apellidos,
  rol: usuario.rol,
  nombreUsuario: usuario.nombre_usuario,
  telefono: usuario.telefono,
  estaActivo: usuario.esta_activo,
  estaVerificado: usuario.esta_verificado,
  creadoEn: usuario.creado_en,
});

export const crearUsuarioControlador = (
  servicio: UsuarioServicio = crearUsuarioServicio(),
): UsuarioControlador => ({
  /**
   * POST /api/v1/usuarios
   * Recibe la peticion, valida el cuerpo y delega en el servicio.
   * No contiene logica de negocio (flujo: Controlador -> Servicio -> Repositorio).
   */
  async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = validarCrearUsuario(req.body);
      const usuarioCreado = await servicio.crear(dto);
      res.status(201).json({ data: aRespuestaPublica(usuarioCreado) });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/usuarios
   * Lista usuarios con paginación y filtros (REQ-010)
   */
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: ConsultaUsuariosQuery = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        rol: req.query.rol as string,
        estaActivo: req.query.estaActivo === 'true' ? true : req.query.estaActivo === 'false' ? false : undefined,
        search: req.query.search as string,
        orderBy: req.query.orderBy as string,
        orderDir: req.query.orderDir as 'asc' | 'desc',
      };
      
      const resultado = await servicio.listar(query);
      res.status(200).json({ 
        data: resultado.usuarios.map(aRespuestaPublica),
        paginacion: resultado.paginacion 
      });
    } catch (error) {
      next(error);
    }
  },
});

export const usuarioControlador = crearUsuarioControlador();