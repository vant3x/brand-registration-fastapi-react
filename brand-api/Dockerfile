# Etapa de construcción
FROM python:3.10.7-slim-buster AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar Poetry
RUN pip install poetry==1.8.2

# Copiar los archivos de configuración de Poetry
COPY pyproject.toml poetry.lock ./

# Configurar Poetry para no crear un entorno virtual en el directorio del proyecto
RUN poetry config virtualenvs.in-project false

# Instalar las dependencias de producción
RUN poetry install --no-root --only main

# Etapa final (producción)
FROM python:3.10.7-slim-buster AS runner

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar las dependencias instaladas desde la etapa de construcción
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin/poetry /usr/local/bin/poetry

# Copiar el código de tu aplicación
COPY . .

# Exponer el puerto que usa Uvicorn
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
