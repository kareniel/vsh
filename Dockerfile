# Base
FROM diagonal/nodejs as base

# Install
FROM base as install

COPY ./package*.json ./
RUN npm install 
COPY . .

EXPOSE 8080

# Test
FROM install as test
CMD ["npm", "test"]

# Development
FROM install as development
CMD ["nodemon", "src"]

# Production
FROM install as production
CMD ["node", "src"]
