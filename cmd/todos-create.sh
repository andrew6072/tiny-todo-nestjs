br="======================================================================================"
bl=""
userId=5
echo $br
access_token=$(cat /home/andrew6072/cmpt688/todo-app-js/cmd/access_token.txt)

if [ -z "$access_token" ]; then
    echo $br
    echo "Response:"
    echo $bl
    echo "Failed to retrieve access token"
    echo $bl
    echo $br
else
    echo $br
    echo "Access token: $access_token"
    echo $br
    echo "Response:"
    echo $bl

    curl -X POST http://localhost:3000/todos/ \
        -d "{\"userId\": $userId, \"title\": \"TEST\", \"description\": \"TEST\", \"status\":\"in-progress\"}" \
        -H "Content-Type: application/json" \
        -w "\n" \
        -H "Authorization: Bearer $access_token"

    echo $bl
    echo $br
fi

