package server;

import java.util.Map;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

public class Json2CsvConverter {
	private StringBuilder builder;
	private final String separator = ",";
	private final String nl = "\r\n";
	
	public String toCsv(JsonArray jsonArray) {
		builder = new StringBuilder();
		getJsonObjects(jsonArray);
		return builder.toString();
	}
	
	private void getJsonObjects(JsonArray jsonArray) {
		for(JsonElement e : jsonArray) {
			//Ignore other jsonElements in array
			if(e.isJsonObject()) {
				JsonObject obj = (JsonObject) e;
				getJsonValues(obj);
				int i = builder.lastIndexOf(separator);
				if(i >= 0) {
					builder.replace(i, i+1, nl); //Replace last comma on line with new line character
				}				
			}
		}
	}
	
	private void getJsonValues(JsonObject jsonObject) {
		for(Map.Entry<String, JsonElement> e: jsonObject.entrySet()) {
			if(e.getValue().isJsonPrimitive()) {
				JsonPrimitive p = (JsonPrimitive) e.getValue();
				appendJsonPrimitive(p);
			}else if(e.getValue().isJsonObject()) {
				getJsonValues((JsonObject) e.getValue());	//Call method recursively
			}
		}
	}
	
	private void appendJsonPrimitive(JsonPrimitive p) {
		if(p.isBoolean()) {
			builder.append(p.getAsBoolean());
			builder.append(separator);
		}else if(p.isString()) {
			builder.append(p.getAsString());
			builder.append(separator);
		}else if(p.isNumber()){
			builder.append(p.getAsDouble());
			builder.append(separator);
		}
	}
}
