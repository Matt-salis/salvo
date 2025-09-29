# Usar la imagen base de OpenJDK 17 (ajusta la versión si tu proyecto usa otra)
FROM openjdk:17-jdk-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia el jar compilado al contenedor (ajusta el nombre del jar)
COPY target/*.jar app.jar

# Expone el puerto 8080 (ajusta si tu app usa otro)
EXPOSE 8080

# Comando por defecto para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
