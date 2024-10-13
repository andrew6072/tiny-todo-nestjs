br="======================================================================================"
bl=""
echo $br
access_token=$(cat /home/andrew6072/cmpt688/todo-app-js/cmd/access_token.txt)
this_user=$(
    curl http://localhost:3000/auth/profile \
        -H "Authorization: Bearer $access_token" \
        -w "\n" | jq -r '.data.username'
)

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
        -d "{
            \"title\": \"ABCD $this_user\", 
            \"description\": \"ABCD $this_user\",
            \"status\": \"in-progress\"
        }" \
        -H "Content-Type: application/json" \
        -w "\n" \
        -H "Authorization: Bearer $access_token"

    echo $bl
    echo $br
fi

