FROM gradle:8.12-jdk21-corretto AS build
COPY . .
RUN ./gradlew clean build -x test

FROM amazoncorretto:21-alpine
COPY --from=build build/libs/evemarket-0.0.1-SNAPSHOT.jar test.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","test.jar"]