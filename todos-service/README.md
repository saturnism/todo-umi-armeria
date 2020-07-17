## Run

`mvn spring-boot:run`

## Build package

`mvn verify`

The deployable is `target/todos-1.0-SNAPSHOT.jar`.

## Run the package

`java -jar target/todos-1.0-SNAPSHOT.jar`

## Build Container

Update the `jib` plugin in the `pom.xml` to configure your own image coordinate.

`mvn compile jib:build`
