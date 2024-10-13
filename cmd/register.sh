username="user3"

response=$(
    curl -X POST http://localhost:3000/auth/register \
        -d "{\"username\": \"$username\", \"password\": \"mypass\", \"email\": \"$username@mail1.com\", \"role\":\"admin\"}" \
        -H "Content-Type: application/json" \
        -w "\n"
)
echo $response