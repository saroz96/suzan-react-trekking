# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["suzan-react-trekking.csproj", "."]
RUN dotnet restore "./suzan-react-trekking.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "./suzan-react-trekking.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

# Start the application
ENTRYPOINT ["dotnet", "suzan-react-trekking.dll"]