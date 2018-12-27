package client;

import java.io.IOException;
import java.util.Random;

public class RandomTemperatureSensorSimulator {
	final static int nOfSensors = 10;
	final static String server = "http://webapplication-226612.appspot.com/Datastore";
	
	public static void main(String[] args) {
		
		try {
			for(int i = 0; i < nOfSensors; i++) {
				TemperatureSensor ts = new TemperatureSensor("sensor_ID" + i, new Location(getRandomSymmetric(89), getRandomSymmetric(179)), server);
				ts.connect();
				new Thread(ts).start();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static double getRandomSymmetric(int i) {
		Random rnd = new Random();
		return rnd.nextInt(2*i) - i + rnd.nextDouble();
	}

}
