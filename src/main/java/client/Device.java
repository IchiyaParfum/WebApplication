package client;

import java.io.IOException;
import java.net.MalformedURLException;

import client.net.HttpClient;
import client.net.HttpsClient;

public abstract class Device implements Runnable{

	protected String id;
	protected Location loc;
	protected int sendingIntervall = 5000;
	protected HttpClient con;
	
	public Device(String id, Location loc, String destURL) throws MalformedURLException {
		this.id = id;
		this.loc = loc;
		con = new HttpClient(destURL);
	}
	
	public abstract void sendData(DeviceData data);
	
	public String getId() {
		return this.id;
	}
	
	public void setSendingIntervall(int sendingIntervall) {
		this.sendingIntervall = sendingIntervall;
	}
	
	public int getSendingIntervall() {
		return this.sendingIntervall;
	}
	
	public void connect() throws IOException {
		con.connect();
	}
	
	public void disconnect() {
		con.disconnect();
	}
	
	public boolean isConnected() {
		return con.isConnected();
	}
}
