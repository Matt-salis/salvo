# Usa una imagen con Gradle para compilar el proyecto
FROM gradle:7.6-jdk17 AS build

# Copia los archivos del proyecto al contenedor
COPY . /home/gradle/project

WORKDIR /home/gradle/project

# Construye el proyecto (genera el JAR en build/libs)
RUN gradle clean build --no-daemon

# Imagen final para ejecutar la app
FROM openjdk:17-jdk-alpine

WORKDIR /app

# Copia el JAR desde la etapa de compilación
COPY --from=build /home/gradle/project/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
