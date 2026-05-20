import type { Request, Response } from 'express';

import { requierePermiso, requiereRol } from '../../src/middlewares/autorizar';
import { Accion } from '../../src/shared/permisos';
import type { UsuarioAutenticado } from '../../src/shared/tipos/usuario-autenticado';
import { ErrorNoAutenticado, ErrorProhibido } from '../../src/utilidades/errores';

const next = jest.fn();
const res = {} as Response;

const crearReq = (usuario?: UsuarioAutenticado): Partial<Request> => ({ usuario });

const admin: UsuarioAutenticado = {
  id: 'uuid-admin',
  rol: 'administrador',
  institucionIds: [],
  grupoIds: [],
};

const coordinador: UsuarioAutenticado = {
  id: 'uuid-coord',
  rol: 'coordinador',
  institucionIds: ['inst-001'],
  grupoIds: [],
};

const estudiante: UsuarioAutenticado = {
  id: 'uuid-est',
  rol: 'estudiante',
  institucionIds: [],
  grupoIds: [],
};

describe('requiereRol', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deberia llamar next(ErrorNoAutenticado) si req.usuario no existe', () => {
    requiereRol('administrador')(crearReq() as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorNoAutenticado));
  });

  it('deberia llamar next(ErrorProhibido) si el rol no esta en la lista', () => {
    requiereRol('administrador')(crearReq(estudiante) as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorProhibido));
  });

  it('deberia llamar next() sin error si el rol coincide', () => {
    requiereRol('administrador')(crearReq(admin) as Request, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('deberia permitir multiples roles validos', () => {
    requiereRol('administrador', 'coordinador')(crearReq(coordinador) as Request, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('deberia rechazar un rol que no esta en la lista de multiples', () => {
    requiereRol('administrador', 'coordinador')(crearReq(estudiante) as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorProhibido));
  });
});

describe('requierePermiso', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deberia llamar next(ErrorNoAutenticado) si req.usuario no existe', () => {
    requierePermiso(Accion.CREAR_USUARIO)(crearReq() as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorNoAutenticado));
  });

  it('deberia llamar next(ErrorProhibido) si el rol no tiene el permiso', () => {
    requierePermiso(Accion.CREAR_USUARIO)(crearReq(estudiante) as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorProhibido));
  });

  it('deberia llamar next() sin error si el rol tiene el permiso', () => {
    requierePermiso(Accion.CREAR_USUARIO)(crearReq(admin) as Request, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('deberia permitir al coordinador crear usuarios (dentro de su scope)', () => {
    requierePermiso(Accion.CREAR_USUARIO)(crearReq(coordinador) as Request, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('deberia rechazar al coordinador si intenta eliminar usuarios', () => {
    requierePermiso(Accion.ELIMINAR_USUARIO)(crearReq(coordinador) as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorProhibido));
  });

  it('deberia rechazar al estudiante si intenta ver estadisticas globales', () => {
    requierePermiso(Accion.VER_ESTADISTICAS_GLOBALES)(crearReq(estudiante) as Request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorProhibido));
  });

  it('deberia permitir al estudiante acceder a practica', () => {
    requierePermiso(Accion.ACCEDER_PRACTICA)(crearReq(estudiante) as Request, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
