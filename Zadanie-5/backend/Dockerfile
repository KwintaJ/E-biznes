# build
FROM golang:1.26-alpine AS builder
RUN apk add --no-cache gcc musl-dev sqlite-dev

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

ENV CGO_ENABLED=1
RUN go build -o server .

# run
FROM alpine:latest
RUN apk add --no-cache libc6-compat ca-certificates
WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
CMD ["./server"]