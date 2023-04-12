FROM postgres

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=fiu-fit-users

EXPOSE 5432/tcp