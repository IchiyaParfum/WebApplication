package server;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;

@WebServlet(
    name = "DatastoreServlet",
    urlPatterns = {"/Datastore/*"}
)
public class DatastoreServlet extends HttpServlet {
	private DatastoreManager ds;
	
	public DatastoreServlet() {
		ds = DatastoreManager.getInstance();
	}
	
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
	 //setAccessControlHeaders(response);
	String responseString = getResponseContent(request, response);
	setResponseContent(response, responseString, HttpServletResponse.SC_OK);
  }
  
  private String getResponseContent(HttpServletRequest request, HttpServletResponse response){
	  	String requestedRes = request.getRequestURI().substring(request.getRequestURI().lastIndexOf("/") + 1);
		response.setHeader("Content-disposition","attachment; filename="+ requestedRes);
		
		if(requestedRes.endsWith(".csv")) {
			return new String();
		}else if(requestedRes.endsWith(".json")){
			return doGetAsJson(request, response);
		}
		return new String();
	}
  
  	private String doGetAsJson(HttpServletRequest request, HttpServletResponse response){
		response.setContentType ("application/json");
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(ds.queryGSon("myFirstSensor"));
  	}
	
	private void setResponseContent(HttpServletResponse response, String content, int status) throws IOException {
		response.setStatus(status);
		response.getWriter().write(content);
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