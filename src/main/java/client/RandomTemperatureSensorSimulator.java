package client;

import java.io.IOException;

public class RandomTemperatureSensorSimulator {

	public static void main(String[] args) {
		try {
			TemperatureSensor ts = new TemperatureSensor("myFirstSensor", "http://localhost:8080/Datastore");
			new Thread(ts).start();
			ts.connect();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
