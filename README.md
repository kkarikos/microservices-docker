### WIP: Orchestrating microservices with docker containers
Current setup includes:  
* 2 node instances running in their own containers
* nginx container used as reverse proxy
* mongo container
* redis container

### Get Started
For OS X install Docker Toolbox  
https://www.docker.com/products/docker-toolbox

##### Common Commands
docker-compose build  
docker-compose up

docker rm `docker ps -qa`  
docker rm --force `docker ps -qa`  
docker exec -it SERVICE bash

##### References
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/  
https://docs.docker.com/compose/overview/  
https://docs.docker.com/compose/reference/  
http://anandmanisankar.com/posts/docker-container-nginx-node-redis-example/
