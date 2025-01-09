FROM cypress/base:20.11.0

# Set up the working directory for the app
RUN mkdir /app
WORKDIR /app

# Copy the application files into the Docker image
COPY . /app

# Install npm dependencies, resolving peer conflicts
RUN npm install --legacy-peer-deps

# Install Cypress binary
RUN npx cypress install && npx cypress verify

# Cache Cypress binary to avoid re-downloading in future builds
RUN mkdir -p ~/.cache/Cypress

CMD ["npm", "run", "cypress:e2e"]

