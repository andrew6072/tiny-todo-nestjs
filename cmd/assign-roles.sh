br="======================================================================================"
bl=""
user_id=11
to_role_ids='[1,3]'

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

    curl -X POST "http://localhost:3000/users/$user_id/assign-roles" \
        -H "Authorization: Bearer $access_token" \
        -H 'Content-Type: application/json' \
        -d "{\"roleIds\": $to_role_ids}"

    echo $bl
    echo $br
fi

