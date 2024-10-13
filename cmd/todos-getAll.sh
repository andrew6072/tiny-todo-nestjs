br="======================================================================================"
bl=""

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

    curl -X GET http://localhost:3000/todos \
    -H "Authorization: Bearer $access_token" \
    -H "Content-Type: application/json" \
    -d '{
        "page": 3,
        "per_page": 3,
        "sort_by": "created_at",
        "sort_order": "ASC",
        "status": "",
        "time": ["2024-10-10", "2024-10-14"]
    }'
    
    # curl -X GET http://localhost:3000/todos \
    #     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
    #     -H "Content-Type: application/json" \
    #     -d '{
    #         "page": 1,
    #         "per_page": 10
    #     }'


    echo $bl
    echo $br
fi

