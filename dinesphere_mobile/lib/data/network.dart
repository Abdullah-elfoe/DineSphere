

const String deviceIP = "192.168.0.111";
const String port = "8000";
const String API = "api/";


String getRestaurant (String name) => "$API/getRestaurant/$name";
String getAllRestaurant () => "$API/get/Restaurants";

