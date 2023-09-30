build:
	docker build -t restapps-service .

run-docker:
	docker run -d --restart=always --name restapps-service \
	-p 9001:9001 \
	-v $(shell pwd):/app \
	-w /app \
	--add-host=host.docker.internal:host-gateway \
	--env DB_HOST=host.docker.internal \
	--env DB_USERNAME=root \
	--env DB_PASSWORD= \
	--env DB_DATABASE= \
	--env DB_PORT=27017 \
	restapps-service \
	npm start
