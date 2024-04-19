FROM python:3.12-slim

WORKDIR /app

# Copy everything to /app directory
COPY . /app

# Install pip and numpy first to ensure numpy.distutils is available
RUN pip install --upgrade pip
RUN pip install numpy

# Install other dependencies
RUN pip install -r environment/requirements.txt

# Make the entrypoint script executable
RUN chmod +x entrypoint.sh

# Expose the port the app runs on
EXPOSE 5000

# Set the entrypoint to your script
ENTRYPOINT ["./entrypoint.sh"]
