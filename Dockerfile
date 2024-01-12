# run production backend
FROM mrinjamul/pnpm:git

WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install
ADD . .

EXPOSE 4000

CMD ["pnpm","run","start"]
