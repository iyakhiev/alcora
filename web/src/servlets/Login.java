package servlets;

import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

/**
 * Created by iyakhiev on 09.09.15.
 */
public class Login extends HttpServlet {
    private DB db;

    public Login() {
        db = new DB();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)  {
        try {
            PrintWriter out = response.getWriter();

            String code = request.getParameter("code");
            out.println("Login: Your code = " + code);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) {
        try {
            res.setContentType("application/json");
            PrintWriter out = res.getWriter();
            String mail = req.getParameter("mail"),
                    password = req.getParameter("password");

            Statement stmt = db.connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM alcora.users WHERE email = '" + mail + "';");
            int ans = 0, n = 0;
            while(rs.next()) {
                n++;
                if(rs.getString("password").equals(password)) {
                    if(rs.getString("active").equals("true")) {
                        ans = 1;
                    } else {
                        ans = 2;
                    }
                } else {
                    ans = -1;
                }
            }
            if(n == 0) {
                ans = 0;
            }
            out.println("{ \"login\": \"" + ans + "\" }");
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
