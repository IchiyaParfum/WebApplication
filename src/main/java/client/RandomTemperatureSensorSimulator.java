package client;

import java.io.IOException;

public class RandomTemperatureSensorSimulator {

	public static void main(String[] args) {
		try {
			TemperatureSensor ts = new TemperatureSensor("myFirstSensor", "http://webapplication-226612.appspot.com/Datastore");
			//TemperatureSensor ts = new TemperatureSensor("myFirstSensor", "http://localhost:8080/Datastore");
			ts.connect();
			new Thread(ts).start();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
