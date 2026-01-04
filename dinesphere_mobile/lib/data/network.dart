

const String deviceIP = "127.0.0.1";
const String port = "8000";
const String API = "api/";


String getRestaurant (String name) => "$API/getRestaurant/$name";
String getAllRestaurant () => "$API/get/Restaurants";

