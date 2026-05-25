import cors from 'cors';
import express from 'express';

import appBase from './app';
import { manejadorErrorHttp } from './compartido/infraestructura/http/manejador-error-http';
import rutasRol from './rutas/rol-rutas';
import usuarioRutas from './rutas/usuario-rutas';

const app = express();

// 2. Le das permiso a tu frontend (puerto 3000) de conectarse
app.use(cors({
    origin: 'http://localhost:3000', // El dominio de tu frontend
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true
}));

app.use(express.json()); // El que lee los body en JSON

// ... aquí cargas tus rutas ...
app.use('/api/v1/roles', rutasRol);
app.use('/api/v1/usuarios', usuarioRutas);
app.use(appBase);
app.use(manejadorErrorHttp);

const PORT = process.env.USER_SERVICE_PORT || 4102;
app.listen(PORT, () => {
    console.log(`Servidor de usuarios corriendo en el puerto ${PORT}`);
});