FROM node:16

WORKDIR /SCORE

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
CMD [ "node", "index.js" ]


# docker :

# - des imagesdock
#     une image qui est lancé -> peut-être différent de l'état initial



#     MOTUS-1 :
#         /server/index.js -> un utilisateur s'est connecté : rajouter dans latest.log son ip / score
#         /server/package.json
#         /server/data/
#         /server/public/...
#         /MapData/tatitotu
#         /MapData/tutu
#         /server/config.yml
#         /server/latest.log : [3.2.4.2 : 6 ; 42.4.2.2 : 4]


#     MOTUS-2:
#         /server/index.js -> add dans /MapData/tutu
#         /server/data/
#         /server/public/...
#         /MapData/tatitotu
#         /MapData/tutu
#         /server/config.yml
#         /server/latest.log [3.5.2.3 : 5 ; ]


# volume : 
#     name = toto
#     link = /MapData : /home/mathi/map-minecraft

# host : 
#     /home/mathi/map-minecraft/

# ls /home/mathi/map-minecraft/
# 0 found

# touch /home/mathi/map-minecraft/tatitotu

# ls /home/mathi/map-minecraft/
# 1 found
# tatitotu


# ls /home/mathi/map-minecraft/
# 2 found
# tatitotu
# tutu