<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Setup

### PostgreSQL

Seguir [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart) para instalarlo. **Recorda el username y password que le pongas!!!**

### .env

1. Crear un nuevo archivo en la carpeta backend que se llame _.env_
2. Copiar los contenidos del archivo _.env.template_ al archivo que creaste en el paso anterior
3. Reemplazar los valores entre "< >" por los que corresponda (espero que hayas guardado ese username y password 👀)

### Inicializar DB

En la consola correr el comando

```bash
yarn migrate reset
```

## Documentacion relevante

- [Documentacion oficial de NestJS](https://docs.nestjs.com/)
- Documentacion [Prisma](https://www.prisma.io/docs/) que es el [ORM](https://docs.google.com/document/d/1YLmp9vMnSzKg2emt3Bx564Tf1CLalShPc98Z8nCoi7s) que vamos a estar usando.
- [NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)
- [Que es el .env???](https://github.com/motdotla/dotenv#readme)

## Comandos

### `yarn start`

Para levantar el proyecto

### `yarn migrate`

Nos va a decir todas las utilidades que podemos hacer con las migraciones de Prisma.

- `yarn migrate reset` resetea la DB y corre todoas las migraciones/seeder
- `yarn migrate dev` crea una nueva migracion a partir de los cambios que le hayamos hecho al schema
- `yarn migrate deploy` corre las migrations

### `yarn prisma generate`

Si hicimos algun cambio al schema este comando actualiza prisma. Si ya corriste las migrations este comando ya se llamo.

### `yarn test`

Correr tests
