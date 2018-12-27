package server;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

public class Json2CsvConverterTest {
	public static void main(String[] args) {
		Json2CsvConverter j = new Json2CsvConverter();
		
		//Build Json
		String json = "[\r\n" + 
				"  {\r\n" + 
				"    \"id\": \"myFifthSensor\",\r\n" + 
				"    \"locLat\": 46.788024,\r\n" + 
				"    \"locLong\": 8.16388\r\n" + 
				"  },\r\n" + 
				"  {\r\n" + 
				"    \"id\": \"myFirstSensor\",\r\n" + 
				"    \"locLat\": -11.540312,\r\n" + 
				"    \"locLong\": -48.619735\r\n" + 
				"  },\r\n" + 
				"  {\r\n" + 
				"    \"id\": \"myForthSensor\",\r\n" + 
				"    \"locLat\": 35.303021,\r\n" + 
				"    \"locLong\": 138.735593\r\n" + 
				"  },\r\n" + 
				"  {\r\n" + 
				"    \"id\": \"mySecondSensor\",\r\n" + 
				"    \"locLat\": 37.132292,\r\n" + 
				"    \"locLong\": -94.761191\r\n" + 
				"  },\r\n" + 
				"  {\r\n" + 
				"    \"id\": \"myThirdSensor\",\r\n" + 
				"    \"locLat\": -31.683305,\r\n" + 
				"    \"locLong\": 21.905842\r\n" + 
				"  }\r\n" + 
				"]";
		JsonParser jsonParser = new JsonParser();
		JsonArray jsonArray = jsonParser.parse(json).getAsJsonArray();
		
		System.out.println(j.toCsv(jsonArray));
	}
}
