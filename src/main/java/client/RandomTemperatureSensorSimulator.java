package client;

import java.io.IOException;

public class RandomTemperatureSensorSimulator {

	public static void main(String[] args) {
		String server = "http://webapplication-226612.appspot.com/Datastore";
				
		try {
			TemperatureSensor[] sensors = {
					new TemperatureSensor("myFirstSensor", new Location(-11.540312, -48.619735), server),
					new TemperatureSensor("mySecondSensor", new Location(37.132292, -94.761191), server),
					new TemperatureSensor("myThirdSensor", new Location(-31.683305, 21.905842), server),
					new TemperatureSensor("myForthSensor", new Location(35.303021, 138.735593), server),
					new TemperatureSensor("myFifthSensor", new Location(46.788024, 8.163880), server)				
			};
			
			for(TemperatureSensor ts : sensors) {
				ts.connect();
				new Thread(ts).start();
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
