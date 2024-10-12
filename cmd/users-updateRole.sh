br="======================================================================================"
bl=""
user_id=8
to_role_id=2

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

    curl -X PUT http://localhost:3000/users/role/$to_role_id?id=$user_id \
        -H "Authorization: Bearer $access_token" \
        -w "\n"

    echo $bl
    echo $br
fi

