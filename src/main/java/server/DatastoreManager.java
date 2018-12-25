package server;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class DatastoreManager {
	
	private static DatastoreManager datastoreManager;
	private Datastore ds;
	
	private DatastoreManager() {
		// Instantiates a client
	    ds = DatastoreOptions.getDefaultInstance().getService();
	}
	
	public static DatastoreManager getInstance() {
		if(datastoreManager == null) {
			datastoreManager = new DatastoreManager();
		}
		return datastoreManager;
	}
	
	public void storeGSon(String jsonString) {
		//Build gson
		JsonParser jsonParser = new JsonParser();
		JsonObject json = jsonParser.parse(jsonString).getAsJsonObject();
		
	    // The kind for the new entity
	    String kind = "sensor";
	    // The name/ID for the new entity
	    String name = "" + json.get("timestamp").getAsDouble();
	    // The Cloud Datastore key for the new entity
	    Key taskKey = ds.newKeyFactory().setKind(kind).newKey(name);
	    
	    // Prepares the new entity
	    Entity entity = Entity.newBuilder(taskKey)
	        .set("id", json.get("id").getAsString())
	        .set("temperature", json.get("temperature").getAsDouble())
	        .set("timestamp", json.get("timestamp").getAsDouble())
	        .set("locLat", json.get("location").getAsJsonObject().get("latitude").getAsDouble())
	        .set("locLong", json.get("location").getAsJsonObject().get("longitude").getAsDouble())
	        .build();
	    
	    // Saves the entity
	    ds.put(entity);

	}
	
	public JsonArray queryGSon(String queryString) {
		return null;
	}
	
}
