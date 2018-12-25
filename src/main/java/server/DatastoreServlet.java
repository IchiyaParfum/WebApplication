package server;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;

@WebServlet(
    name = "DatastoreServlet",
    urlPatterns = {"/Datastore"}
)
public class DatastoreServlet extends HttpServlet {
	private DatastoreManager ds;
	
	public DatastoreServlet() {
		ds = DatastoreManager.getInstance();
	}
	
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) 
      throws IOException {
  }
  
  @Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
	  InputStreamReader is = new InputStreamReader(req.getInputStream());
	  BufferedReader br = new BufferedReader(is);
	  
	  String line = new String();
	  String msg = new String();
	  
	  while((line = br.readLine()) != null) {
		  msg = msg + line;
	  }
	  ds.storeGSon(msg);
	  JsonArray ja = ds.queryGSon("myFirstSensor");
	  resp.getWriter().print(ja);	//Send back to client
	}
}