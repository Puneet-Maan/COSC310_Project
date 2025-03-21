# Use the official MySQL image as the base image
FROM mysql:9.2.0

# Set environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE nullPointersDatabase
ENV MYSQL_ROOT_PASSWORD root

# Copy the SQL script to create tables into the container
COPY ddl/createDatabase.sql /docker-entrypoint-initdb.d/createDatabase.sql

# Copy the script to populate the database into the container
COPY server/baseScript.sh /docker-entrypoint-initdb.d/baseScript.sh

# Ensure the baseScript.sh is executable
RUN chmod +x /docker-entrypoint-initdb.d/baseScript.sh

# Expose the default MySQL port
EXPOSE 3306
