br="======================================================================================"
bl=""
user_id=11

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

    curl -X PUT http://localhost:3000/users/?id=$user_id \
        -H "Authorization: Bearer $access_token" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"CHANGED_$user_id\", \"email\":\"CHANGED_$user_id@test.com\", \"password\":\"mypass\"}" \
        -w "\n"

    echo $bl
    echo $br
fi

