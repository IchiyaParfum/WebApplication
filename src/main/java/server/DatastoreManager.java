package server;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Entity;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.KeyFactory;
import com.google.cloud.datastore.PathElement;
import com.google.cloud.datastore.Query;
import com.google.cloud.datastore.QueryResults;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.OrderBy;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.datastore.Value;
import com.google.gson.Gson;
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
	private boolean first = false;
	public void storeGSon(String jsonString) {
		//Build Json from received data
		JsonParser jsonParser = new JsonParser();
		JsonObject json = jsonParser.parse(jsonString).getAsJsonObject();
		
		//Create entities in datastore
		createSensorEntity(json);	//If entity does already exist nothing happens				
		addDataChild(json);
	    
	}
	
	private void createSensorEntity(JsonObject json) {		
	    String kind = "sensor";	// The kind for the new entit    
	    String name = json.get("id").getAsString();// The name/ID for the new entity	    
	    Key taskKey = ds.newKeyFactory().setKind(kind).newKey(name);// The Cloud Datastore key for the new entity
	    	    
	    Entity entity = Entity.newBuilder(taskKey)
		        .set("id", json.get("id").getAsString())
		        .set("locLat", json.get("location").getAsJsonObject().get("latitude").getAsDouble())
		        .set("locLong", json.get("location").getAsJsonObject().get("longitude").getAsDouble())
		        .build();
	    
	 // Saves the entity
	    ds.put(entity);
	}
	
	private void addDataChild(JsonObject json) {		
	    String kind = "data";// The kind for the new entity    
	    String name = json.get("id").getAsString();	//Ancestor name
	    String dataId = "" + json.get("timestamp").getAsDouble();
	    
	    //Create key for child using sensor as ancestor
	    KeyFactory keyFactory = ds.newKeyFactory()
	    	    .addAncestors(PathElement.of("sensor", name))
	    	    .setKind(kind);
	    	Key taskKey = keyFactory.newKey(dataId);
	    
	    //Create child entity
	    Entity entity = Entity.newBuilder(taskKey)
		        .set("temperature", json.get("temperature").getAsDouble())
		        .set("timestamp", json.get("timestamp").getAsDouble())
		        .build();
	    
	 // Saves the entity
	    ds.put(entity);
	}
	
	public JsonArray queryGSon(String id) {
		//Queries for data of sensor with given id
		Query<Entity> query = Query.newEntityQueryBuilder()
			    .setKind("data")
			    .setFilter(PropertyFilter.hasAncestor(
			            ds.newKeyFactory().setKind("sensor").newKey(id)))
			    .setOrderBy(OrderBy.asc("timestamp"))
			    .build();	    
			   
		QueryResults<Entity> tasks = ds.run(query);
		
		return queryResultToJson(tasks);
	}
	
	public JsonArray queryGSon() {
		//Queries for all sensor entities
		Query<Entity> query = Query.newEntityQueryBuilder()
			    .setKind("sensor")
			    .build();	    
			   
		QueryResults<Entity> tasks = ds.run(query);
		
		return queryResultToJson(tasks);
	}
	
	private JsonArray queryResultToJson(QueryResults<Entity> queryResult) {
		JsonArray jsonArray = new JsonArray();
		while(queryResult != null && queryResult.hasNext()) {
			Entity entity = queryResult.next();
			jsonArray.add(entityToJsonObject(entity));
		}
		return jsonArray;
	}
	
	private JsonObject entityToJsonObject(Entity entity) {
		JsonObject json = new JsonObject();
		json.addProperty("id", entity.getKey().getId());
		for(String property : entity.getNames()) {
			Value<?> v = entity.getValue(property);
			switch(v.getType()) {
			case BOOLEAN:
				json.addProperty(property, entity.getBoolean(property));
				break;
			case STRING:
				json.addProperty(property, entity.getString(property));
				break;
			case DOUBLE:
				json.addProperty(property, entity.getDouble(property));
				break;
			case LONG:
				json.addProperty(property, entity.getLong(property));
				break;
			case LAT_LNG:
				Gson gson = new Gson();
				json.add(property, gson.toJsonTree(entity.getLatLng(property)));
				break;
			case TIMESTAMP:
				json.addProperty(property, entity.getTimestamp(property).toDate().getTime());
				break;
			default:
				json.addProperty(property, entity.getValue(property).toString());
				break;
			}
		}
		return json;
}
}
