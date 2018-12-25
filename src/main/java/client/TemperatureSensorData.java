package client;

import java.util.Date;

public class TemperatureSensorData extends DeviceData{
	double temperature;
	
	public TemperatureSensorData(String id, Date timestamp, Location location, double temperature) {
		super(id, timestamp, location);
		this.temperature = temperature;
	}

	public double getTemperature() {
		return temperature;
	}

	public void setTemperature(double temperature) {
		this.temperature = temperature;
	}

}
