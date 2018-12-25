package client;

import java.util.Date;

public class DeviceData {

	private String id;
	private long timestamp;
	private Location location;
	
	public DeviceData(String id, Date timestamp, Location location) {
		this.id = id;
		setTimestamp(timestamp);
		this.location = location;
	}

	public Date getTimestamp() {
		return new Date(timestamp);
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp.getTime();
	}
	
	

}
