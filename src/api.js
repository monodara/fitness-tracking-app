import axios from "axios"
//add axios dependency to simplify api request.

function getFoodList(keyword) {
    var data = JSON.stringify({
        "query": keyword,
        //passing the keyword into method.
        "num_servings": 0,
        "line_delimited": false,
        "use_raw_foods": false,
        "include_subrecipe": false,
        "lat": 0,
        "lng": 0,
        "meal_type": 0,
        "use_branded_foods": false,
        "locale": "en_US",
        "taxonomy": false,
        "ingredient_statement": false,
        "last_modified": false
    });

    var config = {
        method: 'post',
        //use the post request according to the API official requirements
        url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
        //specify the api address which we need request
        headers: {
            'accept': 'application/json',
            //request data type
            'x-app-id': 'ce37d2c9',
            //api request verification id
            'x-app-key': '683597201bdbd81d447cead9f95b47cb',
            //api request verification key
            'x-remote-user-id': '0',
            //app user id, default value 0
            'Content-Type': 'application/json'
            //request data type
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return {
                success: true,
                // success is a flag if the request is success or failure
                data: {
                    //handle the response data, return the data what we need.
                    foodList: response.data.foods.map(food => {
                        return {
                            "id": food.tags.tag_id,
                            "name": food.tags.item,
                            "qty": food.tags.quantity,
                            "cal": food.nf_calories,
                            "photo": food.photo.thumb,
                        }
                    })
                }
            }
        })
        .catch(function (error) {
            //catch the api request error information 
            console.log(error);
            return {
                success: false,
                data: { error: error.toString() }
            }
        });
}
export default getFoodList;
