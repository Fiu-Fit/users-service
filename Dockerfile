FROM postgres

COPY package.json
COPY yarn.lock

RUN yarn install --frozen-lockfile

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=fiu-fit-users

EXPOSE 5432/tcp

CMD ["yarn", "prisma:dev:deploy"]
CMD ["yarn", "start"]