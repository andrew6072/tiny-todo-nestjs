response=$(
    curl -X POST http://localhost:3000/auth/register \
        -d '{"username": "andrew", "password": "mypass", "email": "1234@some.com"}' \
        -H "Content-Type: application/json" \
        -w "\n"
)
echo $response
