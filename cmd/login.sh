username="admin1"

response=$(
    curl -X POST http://localhost:3000/auth/login \
        -d "{\"username\": \"$username\", \"password\": \"mypass\"}" \
        -H "Content-Type: application/json" \
        -w "\n"
)
access_token=$(echo $response | jq -r '.data.access_token')
echo $access_token > /home/andrew6072/cmpt688/todo-app-js/cmd/access_token.txt

echo $response