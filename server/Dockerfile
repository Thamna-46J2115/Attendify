# define your base image

FROM node:20-alpine



# define the working directory by using the WORKDIR instruction. This will specify where future commands will run and the directory files will be copied inside the countainer image 

WORKDIR /app



# Copy the package.json and package-locl.json files to the working directory

COPY package*.json ./



# Run the npm install command to install the node_modules and ensure to get the latest version

RUN npm install && npm install -g npm@latest





# Copy all the files from the current directory to the working directory

COPY . .



# Run the start script

CMD ["npm","start"]