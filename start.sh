#!/bin/bash 

docker-compose down
docker build ./sutom -t chleo/sutom
docker build ./score -t chleo/score
docker-compose up -d
