# Etapa 1: Compilar la aplicación con Maven
FROM maven:3.8-openjdk-17 AS builder
WORKDIR /app

# Copiar archivo de dependencias primero (para cachear)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecutar la aplicación
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiar el JAR compilado desde la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

# Puerto que usa la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]