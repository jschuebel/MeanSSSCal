# Get-NetNat | Remove-NetNat

#MongoDB needs inbound ports 27017,27018,27019

#docker build -t sssnodei --build-arg NODE_VERSION=8.2.1 .
#docker run -dit -p 3600:3500 --name sssnodec sssnodei:latest
#docker exec -ti sssnodec powershell

#docker cp ssscalNode2\package.json sssnodec:c:\app

FROM compulim/nanoserver-node
ARG NODE_VERSION
LABEL Description="Windows Server 2016 Nano Server base OS image for Windows containers" Vendor="SSS" Version="${NODE_VERSION}"
MAINTAINER schuebelsoft@yahoo.com
EXPOSE 3500
WORKDIR /app

COPY dist/. .

RUN npm install

#ENTRYPOINT C:\node\node.exe
ENTRYPOINT node server
#CMD ["npm","start"]