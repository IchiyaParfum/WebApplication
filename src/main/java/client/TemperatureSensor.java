package client;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Date;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class TemperatureSensor extends Device{
	


	public TemperatureSensor(String id, Location loc, String destURL) throws MalformedURLException {
		super(id, loc, destURL);
	}

	@Override
	public void sendData(DeviceData data) {
		// TODO Auto-generated method stub		
	}
	
	@Override
	public void run() {
		while(true) {
			if(isConnected()) {
				GsonBuilder gsonBuilder = new GsonBuilder();
				Gson gson = gsonBuilder.create();
				String json = gson.toJson(getTemperatureSensorData());
				try {
					con.post(json);
				} catch (IOException e) {
					e.printStackTrace();
				}
				try {
					Thread.sleep(sendingIntervall);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}		
		}
	
	}		
	
	private Random random = new Random();
	private double getTemperature() {
		return random.nextInt(40) - 20 + random.nextDouble();	//Return values from -10 up to 30 degrees
	}
	
	private TemperatureSensorData getTemperatureSensorData() {
		return new TemperatureSensorData(id, new Date(), loc, getTemperature());
	}

}
