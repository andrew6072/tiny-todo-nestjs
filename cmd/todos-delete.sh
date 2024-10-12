br="======================================================================================"
bl=""
todo_id=17

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

    curl -X DELETE http://localhost:3000/todos/?id=$todo_id \
        -H "Authorization: Bearer $access_token" \
        -w "\n"

    echo $bl
    echo $br
fi

